using System.ComponentModel.DataAnnotations;

namespace RecipeFinderAPI.DTOs
{
    public class CreateBlogDto
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string Content { get; set; }
        [Required]
        public string ImageUrl { get; set; }
    }
}
