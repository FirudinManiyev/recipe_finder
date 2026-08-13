using RecipeFinderAPI.DTOs;
using RecipeFinderAPI.Helpers;

namespace RecipeFinderAPI.Interfaces
{
    public interface IRecipeService
    {
        Task<List<RecipeDto>> GetAllAsync(PaginationParams paginationParams);
        Task<RecipeDto> GetByIdAsync(int id);
        Task CreateAsync(CreateRecipeDto dto);
        Task<List<RecipeDto>> SearchAsync(RecipeSearchDto searchDto);
        Task<RecipeDto?> GetRandomAsync();
        Task UpdateAsync(int id, CreateRecipeDto dto);
        Task DeleteAsync(int id);
    }
}
