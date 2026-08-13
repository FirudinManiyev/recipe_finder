using Microsoft.EntityFrameworkCore;
using RecipeFinderAPI.Data;
using RecipeFinderAPI.DTOs;
using RecipeFinderAPI.Exceptions;
using RecipeFinderAPI.Interfaces;
using RecipeFinderAPI.Mappings;

namespace RecipeFinderAPI.Services;

public class FeedbackService : IFeedbackService
{
    private readonly AppDbContext _context;
    public FeedbackService(AppDbContext context) => _context = context;

    public async Task CreateAsync(CreateFeedbackDto dto)
    {
        _context.Feedbacks.Add(dto.ToEntity());
        await _context.SaveChangesAsync();
    }

    public async Task<List<FeedbackDto>> GetAllAsync()
    {
        var feedbacks = await _context.Feedbacks.AsNoTracking().OrderByDescending(item => item.Id).ToListAsync();
        return feedbacks.Select(item => item.ToDto()).ToList();
    }

    public async Task DeleteAsync(int id)
    {
        var feedback = await _context.Feedbacks.FindAsync(id)
            ?? throw new NotFoundException("Feedback tapılmadı");
        _context.Feedbacks.Remove(feedback);
        await _context.SaveChangesAsync();
    }
}
