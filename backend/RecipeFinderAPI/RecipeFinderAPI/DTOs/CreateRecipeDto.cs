using System.ComponentModel.DataAnnotations;
using RecipeFinderAPI.Validation;

namespace RecipeFinderAPI.DTOs;

public class CreateRecipeDto : IValidatableObject
{
    private static readonly HashSet<string> AllowedDifficulties = new(StringComparer.OrdinalIgnoreCase)
    {
        "Çox asan", "Asan", "Orta", "Çətin", "Çox çətin", "Easy", "Medium", "Hard"
    };

    [Required, StringLength(150, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;

    [Required, StringLength(1000, MinimumLength = 10)]
    public string Description { get; set; } = string.Empty;

    [Required, StringLength(10_000, MinimumLength = 10)]
    public string Instructions { get; set; } = string.Empty;

    [Range(1, 1000)]
    public int CookingTime { get; set; }

    [Required, StringLength(30)]
    public string Difficulty { get; set; } = string.Empty;

    [Required, StringLength(500), SafeImageUrl]
    public string ImageUrl { get; set; } = string.Empty;

    [Required, MinLength(1), MaxLength(50)]
    public List<string> Ingredients { get; set; } = [];

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (!string.IsNullOrWhiteSpace(Difficulty) && !AllowedDifficulties.Contains(Difficulty.Trim()))
            yield return new ValidationResult("Çətinlik dəyəri düzgün deyil.", [nameof(Difficulty)]);

        if (Ingredients is null)
            yield break;

        var normalized = Ingredients
            .Where(item => !string.IsNullOrWhiteSpace(item))
            .Select(item => item.Trim())
            .ToList();

        if (normalized.Count != Ingredients.Count || normalized.Any(item => item.Length > 100))
            yield return new ValidationResult("Ərzaq adları boş olmamalı və 100 simvoldan uzun olmamalıdır.", [nameof(Ingredients)]);

        if (normalized.Distinct(StringComparer.OrdinalIgnoreCase).Count() != normalized.Count)
            yield return new ValidationResult("Təkrarlanan ərzaq daxil edilə bilməz.", [nameof(Ingredients)]);
    }
}
