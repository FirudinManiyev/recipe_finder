using RecipeFinderAPI.DTOs;

namespace RecipeFinderAPI.Interfaces
{
    public interface IRecipeService
    {
        Task<List<RecipeDto>> GetAllAsync();
        Task<RecipeDto> GetByIdAsync(int id);
        Task CreateAsync(CreateRecipeDto dto);
        Task<List<RecipeDto>> SearchByIngredientsAsync(List<string> ingredients);
    }
}