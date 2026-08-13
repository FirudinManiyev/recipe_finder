namespace RecipeFinderAPI.DTOs
{
    public class RecipeDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Instructions { get; set; } = string.Empty;
        public int CookingTime { get; set; }
        public string Difficulty { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public List<string> Ingredients { get; set; } = [];
        public int MatchingScore { get; set; }
        public List<string> MissingIngredients { get; set; } = [];
    }
}
