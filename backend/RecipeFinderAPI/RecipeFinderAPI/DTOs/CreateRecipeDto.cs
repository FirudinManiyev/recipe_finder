namespace RecipeFinderAPI.DTOs
{
    public class CreateRecipeDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Instructions { get; set; }
        public int CookingTime { get; set; }
        public string Difficulty { get; set; }
        public string ImageUrl { get; set; }
        public List<string> Ingredients { get; set; }
    }
}