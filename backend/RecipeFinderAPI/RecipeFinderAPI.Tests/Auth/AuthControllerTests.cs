using System.Text.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using RecipeFinderAPI.Controllers;
using RecipeFinderAPI.Data;
using RecipeFinderAPI.DTOs;
using RecipeFinderAPI.Entities;
using RecipeFinderAPI.Helpers;
using RecipeFinderAPI.Services;
using Xunit;

namespace RecipeFinderAPI.Tests.Auth;

public class AuthControllerTests
{
    [Fact]
    public async Task Login_WritesHttpOnlyCookieAndDoesNotExposeToken()
    {
        await using var context = CreateContext();
        context.Users.Add(new User
        {
            Username = "firudin",
            Email = "user@example.com",
            PasswordHash = PasswordHasher.Hash("StrongPass123!"),
            Role = "User"
        });
        await context.SaveChangesAsync();
        var controller = CreateController(context);

        var result = await controller.Login(new LoginDto
        {
            Username = "firudin",
            Password = "StrongPass123!"
        });

        var ok = Assert.IsType<OkObjectResult>(result);
        var json = JsonSerializer.Serialize(ok.Value);
        var cookie = controller.Response.Headers.SetCookie.ToString();
        Assert.DoesNotContain("token", json, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("expiresAtUtc", json, StringComparison.Ordinal);
        Assert.Contains("recipe_finder_auth=", cookie);
        Assert.Contains("httponly", cookie, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("samesite=strict", cookie, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task Me_ReturnsTheAuthenticatedSessionExpiration()
    {
        await using var context = CreateContext();
        context.Users.Add(new User
        {
            Username = "firudin",
            Email = "user@example.com",
            PasswordHash = PasswordHasher.Hash("StrongPass123!"),
            Role = "User"
        });
        await context.SaveChangesAsync();
        var controller = CreateController(context);
        var expiration = DateTimeOffset.Parse("2026-08-17T13:00:00Z");
        controller.HttpContext.User = new ClaimsPrincipal(new ClaimsIdentity(
        [
            new Claim(ClaimTypes.Name, "firudin"),
            new Claim(JwtRegisteredClaimNames.Exp, expiration.ToUnixTimeSeconds().ToString())
        ], "test"));

        var result = await controller.Me();

        var ok = Assert.IsType<OkObjectResult>(result);
        using var json = JsonDocument.Parse(JsonSerializer.Serialize(ok.Value));
        Assert.Equal(expiration, json.RootElement.GetProperty("expiresAtUtc").GetDateTimeOffset());
    }

    [Fact]
    public async Task Login_MigratesLegacyPasswordHash()
    {
        await using var context = CreateContext();
        var user = new User
        {
            Username = "legacy-user",
            Email = "legacy@example.com",
            PasswordHash = LegacyHash("LegacyPass123!"),
            Role = "User"
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();
        var controller = CreateController(context);

        await controller.Login(new LoginDto
        {
            Username = "legacy-user",
            Password = "LegacyPass123!"
        });

        Assert.StartsWith("PBKDF2$", user.PasswordHash);
    }

    private static AuthController CreateController(AppDbContext context)
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "test-only-signing-key-with-at-least-32-characters",
                ["Jwt:Issuer"] = "RecipeFinderAPI",
                ["Jwt:Audience"] = "RecipeFinderClient"
            })
            .Build();
        return new AuthController(context, new JwtService(configuration))
        {
            ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext() }
        };
    }

    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    private static string LegacyHash(string password)
    {
        var bytes = System.Security.Cryptography.SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(bytes);
    }
}
