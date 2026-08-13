using System.ComponentModel.DataAnnotations;
using RecipeFinderAPI.Validation;

namespace RecipeFinderAPI.DTOs;

public class CreateBlogDto : IValidatableObject
{
    [Required, StringLength(160, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;

    [Required, StringLength(20_000, MinimumLength = 20)]
    public string Content { get; set; } = string.Empty;

    [Required, StringLength(500), SafeImageUrl]
    public string ImageUrl { get; set; } = string.Empty;

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (string.IsNullOrWhiteSpace(Title))
            yield return new ValidationResult("Başlıq tələb olunur.", [nameof(Title)]);
        if (string.IsNullOrWhiteSpace(Content))
            yield return new ValidationResult("Məzmun tələb olunur.", [nameof(Content)]);
    }
}
