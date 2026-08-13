using System.ComponentModel.DataAnnotations;

namespace RecipeFinderAPI.DTOs;

public class LoginDto : IValidatableObject
{
    [Required, StringLength(50, MinimumLength = 3)]
    public string Username { get; set; } = string.Empty;

    [Required, StringLength(128, MinimumLength = 8)]
    public string Password { get; set; } = string.Empty;

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (string.IsNullOrWhiteSpace(Username))
            yield return new ValidationResult("İstifadəçi adı tələb olunur.", [nameof(Username)]);
        if (string.IsNullOrWhiteSpace(Password))
            yield return new ValidationResult("Şifrə tələb olunur.", [nameof(Password)]);
    }
}
