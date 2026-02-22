namespace RecipeFinderAPI.DTOs
{
    public class RecipeSearchDto
    {
        public List<string> Ingredients { get; set; } = new();
        public int? MaxCookingTime { get; set; }
        public string? Difficulty { get; set; }
        public string? SortBy { get; set; }
    }
}