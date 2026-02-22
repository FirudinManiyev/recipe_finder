using System.ComponentModel.DataAnnotations;

namespace RecipeFinderAPI.Entities
{
    public class Recipe
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Title { get; set; }

        [MaxLength(1000)]
        public string Description { get; set; }

        public string Instructions { get; set; }

        public int CookingTime { get; set; } // dəqiqə ilə

        public string Difficulty { get; set; } // Easy, Medium, Hard

        public string ImageUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<RecipeIngredient> RecipeIngredients { get; set; }
    }
}