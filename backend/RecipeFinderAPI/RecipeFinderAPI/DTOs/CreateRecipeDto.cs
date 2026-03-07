using System.ComponentModel.DataAnnotations;

namespace RecipeFinderAPI.DTOs
{
    public class CreateRecipeDto
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public string Instructions { get; set; }
        [Required]
        [Range(1, 1000)]
        public int CookingTime { get; set; }
        [Required]
        public string Difficulty { get; set; }
        [Required]
        public string ImageUrl { get; set; }
        [Required]
        public List<string> Ingredients { get; set; }
    }
}