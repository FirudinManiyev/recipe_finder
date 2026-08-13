using System.ComponentModel.DataAnnotations;

namespace RecipeFinderAPI.Entities
{
    public class Ingredient
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        public ICollection<RecipeIngredient> RecipeIngredients { get; set; } = [];
    }
}
