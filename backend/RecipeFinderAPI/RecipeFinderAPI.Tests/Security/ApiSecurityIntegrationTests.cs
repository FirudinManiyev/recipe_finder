using System.Net;
using System.Net.Http.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using RecipeFinderAPI.Data;
using Xunit;

namespace RecipeFinderAPI.Tests.Security;

public sealed class ApiSecurityIntegrationTests : IClassFixture<SecurityApiFactory>
{
    private readonly HttpClient _client;

    public ApiSecurityIntegrationTests(SecurityApiFactory factory)
    {
        _client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false,
            BaseAddress = new Uri("https://localhost")
        });
    }

    [Fact]
    public async Task CsrfEndpoint_SetsHardenedCookieAndSecurityHeaders()
    {
        var response = await _client.GetAsync("/api/auth/csrf");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("nosniff", response.Headers.GetValues("X-Content-Type-Options").Single());
        Assert.Equal("strict-origin-when-cross-origin", response.Headers.GetValues("Referrer-Policy").Single());
        Assert.Equal("DENY", response.Headers.GetValues("X-Frame-Options").Single());
        Assert.Contains("object-src 'none'", response.Headers.GetValues("Content-Security-Policy").Single());

        var cookie = response.Headers.GetValues("Set-Cookie").Single(value =>
            value.StartsWith("recipe_finder_csrf=", StringComparison.Ordinal));
        Assert.Contains("httponly", cookie, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("secure", cookie, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("samesite=strict", cookie, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task AdminMutation_RejectsAnonymousRequestBeforeDataAccess()
    {
        var response = await _client.DeleteAsync("/api/recipes/1");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task MissingRoute_ReturnsSafeJsonWithoutImplementationDetails()
    {
        var response = await _client.GetAsync("/api/not-a-real-route");
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        Assert.NotNull(body);
        Assert.Contains("message", body.Keys);
        Assert.DoesNotContain("stack", string.Join(' ', body.Values), StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task ExpiredAuthCookie_ReturnsUnauthorizedWithoutExecutingTheEndpoint()
    {
        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecurityApiFactory.TestJwtKey));
        var token = new JwtSecurityToken(
            issuer: "RecipeFinderAPI",
            audience: "RecipeFinderClient",
            claims: [new Claim(ClaimTypes.Name, "expired-user"), new Claim(ClaimTypes.Role, "Admin")],
            notBefore: DateTime.UtcNow.AddHours(-2),
            expires: DateTime.UtcNow.AddMinutes(-2),
            signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256));
        var request = new HttpRequestMessage(HttpMethod.Get, "/api/auth/me");
        request.Headers.Add("Cookie", $"recipe_finder_auth={new JwtSecurityTokenHandler().WriteToken(token)}");

        var response = await _client.SendAsync(request);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}

public sealed class SecurityApiFactory : WebApplicationFactory<Program>
{
    internal const string TestJwtKey = "integration-test-key-that-is-at-least-32-bytes-long";
    private readonly string? _originalJwtKey;

    public SecurityApiFactory()
    {
        _originalJwtKey = Environment.GetEnvironmentVariable("Jwt__Key");
        Environment.SetEnvironmentVariable("Jwt__Key", TestJwtKey);
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureAppConfiguration((_, configuration) =>
        {
            configuration.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = TestJwtKey,
                ["Jwt:Issuer"] = "RecipeFinderAPI",
                ["Jwt:Audience"] = "RecipeFinderClient",
                ["Frontend:Origins:0"] = "https://localhost"
            });
        });
        builder.ConfigureServices(services =>
        {
            var sqlServerOptions = services.SingleOrDefault(descriptor =>
                descriptor.ServiceType == typeof(DbContextOptions<AppDbContext>));
            if (sqlServerOptions is not null)
                services.Remove(sqlServerOptions);

            services.AddDbContext<AppDbContext>(options =>
                options.UseInMemoryDatabase($"security-tests-{Guid.NewGuid()}"));
        });
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        Environment.SetEnvironmentVariable("Jwt__Key", _originalJwtKey);
    }
}
