using System.ComponentModel.DataAnnotations;

namespace RecipeFinderAPI.Entities
{
    public class Ingredient
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        public ICollection<RecipeIngredient> RecipeIngredients { get; set; }
    }
}