using System.ComponentModel.DataAnnotations;

namespace RecipeFinderAPI.DTOs;

public class CreateFeedbackDto : IValidatableObject
{
    [Required, StringLength(100, MinimumLength = 2)]
    public string FullName { get; set; } = string.Empty;

    [Required, EmailAddress, StringLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required, StringLength(1000, MinimumLength = 10)]
    public string Message { get; set; } = string.Empty;

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (string.IsNullOrWhiteSpace(FullName))
            yield return new ValidationResult("Ad və soyad tələb olunur.", [nameof(FullName)]);
        if (string.IsNullOrWhiteSpace(Message))
            yield return new ValidationResult("Mesaj tələb olunur.", [nameof(Message)]);
    }
}
