using RecipeFinderAPI.DTOs;

namespace RecipeFinderAPI.Interfaces
{
    public interface IFeedbackService
    {
        Task CreateAsync(CreateFeedbackDto dto);
        Task<List<FeedbackDto>> GetAllAsync();
        Task DeleteAsync(int id);
    }
}