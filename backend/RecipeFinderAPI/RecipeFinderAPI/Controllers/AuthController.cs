using System.Security.Claims;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using RecipeFinderAPI.Data;
using RecipeFinderAPI.DTOs;
using RecipeFinderAPI.Entities;
using RecipeFinderAPI.Helpers;
using RecipeFinderAPI.Services;

namespace RecipeFinderAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    public const string AuthCookieName = "recipe_finder_auth";
    private static readonly string DummyPasswordHash = PasswordHasher.Hash("DummyPassword123!");
    private readonly AppDbContext _context;
    private readonly JwtService _jwtService;

    public AuthController(AppDbContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var username = dto.Username.Trim();
        var email = dto.Email.Trim().ToLowerInvariant();
        if (await _context.Users.AnyAsync(user => user.Username == username || user.Email == email))
            return BadRequest(new { message = "Bu məlumatlarla hesab yaratmaq mümkün olmadı." });

        var user = new User
        {
            Username = username,
            Email = email,
            PasswordHash = PasswordHasher.Hash(dto.Password),
            Role = "User"
        };

        _context.Users.Add(user);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return Conflict(new { message = "Bu məlumatlarla hesab yaratmaq mümkün olmadı." });
        }
        return Ok(new { message = "Qeydiyyat uğurla tamamlandı." });
    }

    [HttpPost("login")]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var username = dto.Username.Trim();
        var user = await _context.Users.FirstOrDefaultAsync(item => item.Username == username);
        var passwordMatches = PasswordHasher.Verify(dto.Password, user?.PasswordHash ?? DummyPasswordHash);
        if (user is null || !passwordMatches)
            return Unauthorized(new { message = "İstifadəçi adı və ya şifrə yanlışdır." });

        if (PasswordHasher.IsLegacyHash(user.PasswordHash))
        {
            user.PasswordHash = PasswordHasher.Hash(dto.Password);
            await _context.SaveChangesAsync();
        }

        Response.Cookies.Append(AuthCookieName, _jwtService.GenerateToken(user), BuildCookieOptions());
        return Ok(ToResponse(user));
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var username = User.FindFirstValue(ClaimTypes.Name);
        if (string.IsNullOrWhiteSpace(username))
            return Unauthorized();

        var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(item => item.Username == username);
        return user is null ? Unauthorized() : Ok(ToResponse(user));
    }

    [HttpGet("csrf")]
    public IActionResult Csrf([FromServices] IAntiforgery antiforgery)
    {
        var tokens = antiforgery.GetAndStoreTokens(HttpContext);
        return Ok(new { token = tokens.RequestToken });
    }

    [HttpPost("logout")]
    [ValidateAntiForgeryToken]
    public IActionResult Logout()
    {
        Response.Cookies.Delete(AuthCookieName, BuildCookieOptions());
        return NoContent();
    }

    private static CookieOptions BuildCookieOptions() => new()
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.Strict,
        Path = "/",
        MaxAge = TimeSpan.FromHours(3),
        IsEssential = true
    };

    private static object ToResponse(User user) => new
    {
        username = user.Username,
        role = user.Role
    };
}
