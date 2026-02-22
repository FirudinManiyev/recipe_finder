namespace RecipeFinderAPI.DTOs
{
    public class RecipeDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int CookingTime { get; set; }
        public string Difficulty { get; set; }
        public string ImageUrl { get; set; }
        public List<string> Ingredients { get; set; }
        public int MatchingScore { get; set; }
        public List<string> MissingIngredients { get; set; } = new();
    }
}