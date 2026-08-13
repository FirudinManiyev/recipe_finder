using System.ComponentModel.DataAnnotations;

namespace RecipeFinderAPI.Entities
{
    public class Recipe
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        public string Instructions { get; set; } = string.Empty;

        public int CookingTime { get; set; } // dəqiqə ilə

        public string Difficulty { get; set; } = string.Empty; // Easy, Medium, Hard

        public string ImageUrl { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<RecipeIngredient> RecipeIngredients { get; set; } = [];
    }
}
