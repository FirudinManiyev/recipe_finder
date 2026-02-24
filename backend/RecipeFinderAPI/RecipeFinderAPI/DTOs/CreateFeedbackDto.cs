using System.ComponentModel.DataAnnotations;

namespace RecipeFinderAPI.DTOs
{
    public class CreateFeedbackDto
    {
        [Required]
        public string FullName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Message { get; set; }
    }
}