using System.ComponentModel.DataAnnotations;

namespace RecipeFinderAPI.DTOs;

public class RegisterDto : IValidatableObject
{
    [Required, StringLength(50, MinimumLength = 3)]
    [RegularExpression(@"^[\p{L}\p{N}._-]+$", ErrorMessage = "İstifadəçi adında yalnız hərf, rəqəm, nöqtə, alt xətt və tire istifadə oluna bilər.")]
    public string Username { get; set; } = string.Empty;

    [Required, EmailAddress, StringLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required, StringLength(128, MinimumLength = 8)]
    [RegularExpression(@"^(?=.*[A-Za-z])(?=.*\d).+$", ErrorMessage = "Şifrə ən azı bir hərf və bir rəqəm daxil etməlidir.")]
    public string Password { get; set; } = string.Empty;

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (string.IsNullOrWhiteSpace(Username))
            yield return new ValidationResult("İstifadəçi adı tələb olunur.", [nameof(Username)]);
        if (string.IsNullOrWhiteSpace(Email))
            yield return new ValidationResult("E-poçt tələb olunur.", [nameof(Email)]);
        if (string.IsNullOrWhiteSpace(Password))
            yield return new ValidationResult("Şifrə tələb olunur.", [nameof(Password)]);
    }
}
