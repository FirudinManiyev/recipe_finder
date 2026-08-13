using System.ComponentModel.DataAnnotations;

namespace RecipeFinderAPI.DTOs;

public class RecipeSearchDto : IValidatableObject
{
    [Required, MaxLength(50)]
    public List<string> Ingredients { get; set; } = [];

    [Range(1, 1000)]
    public int? MaxCookingTime { get; set; }

    [StringLength(30)]
    public string? Difficulty { get; set; }

    [StringLength(20)]
    public string? SortBy { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        var difficulties = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "Çox asan", "Asan", "Orta", "Çətin", "Çox çətin", "Easy", "Medium", "Hard"
        };
        if (!string.IsNullOrWhiteSpace(Difficulty) && !difficulties.Contains(Difficulty.Trim()))
            yield return new ValidationResult("Çətinlik filtri düzgün deyil.", [nameof(Difficulty)]);

        var sorts = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "mostmatched", "newest", "az" };
        if (!string.IsNullOrWhiteSpace(SortBy) && !sorts.Contains(SortBy.Trim()))
            yield return new ValidationResult("Sıralama dəyəri düzgün deyil.", [nameof(SortBy)]);

        if (Ingredients is null)
            yield break;

        if (Ingredients.Any(item => string.IsNullOrWhiteSpace(item) || item.Trim().Length > 100))
            yield return new ValidationResult("Ərzaq filtrləri düzgün deyil.", [nameof(Ingredients)]);
    }
}
