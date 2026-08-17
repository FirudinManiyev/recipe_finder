using Microsoft.IdentityModel.Tokens;
using RecipeFinderAPI.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RecipeFinderAPI.Services
{
    public sealed record JwtToken(string Value, DateTimeOffset ExpiresAtUtc);

    public class JwtService
    {
        private readonly IConfiguration _configuration;

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration; 
        }

        public JwtToken GenerateToken(User user)
        {
            var expiresAtUtc = DateTimeOffset.FromUnixTimeSeconds(
                DateTimeOffset.UtcNow.AddHours(3).ToUnixTimeSeconds());
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: expiresAtUtc.UtcDateTime,
                signingCredentials: creds
            );

            return new JwtToken(
                new JwtSecurityTokenHandler().WriteToken(token),
                expiresAtUtc);
        }
    }
}
