using RecipeFinderAPI.DTOs;

namespace RecipeFinderAPI.Interfaces
{
    public interface IBlogService
    {
        Task<List<BlogDto>> GetAllAsync();
        Task<BlogDto> GetByIdAsync(int id);
        Task CreateAsync(CreateBlogDto dto);
        Task UpdateAsync(int id, CreateBlogDto dto);
        Task DeleteAsync(int id);
    }
}
