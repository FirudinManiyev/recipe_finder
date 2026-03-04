using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RecipeFinderAPI.Data;
using RecipeFinderAPI.DTOs;
using RecipeFinderAPI.Entities;
using RecipeFinderAPI.Exceptions;
using RecipeFinderAPI.Interfaces;

namespace RecipeFinderAPI.Services
{
    public class FeedbackService : IFeedbackService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public FeedbackService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // User feedback göndərir
        public async Task CreateAsync(CreateFeedbackDto dto)
        {
            var feedback = _mapper.Map<Feedback>(dto);

            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();
        }

        // Admin bütün feedbackləri görür
        public async Task<List<FeedbackDto>> GetAllAsync()
        {
            var feedbacks = await _context.Feedbacks
                .OrderByDescending(f => f.Id)
                .ToListAsync();

            return _mapper.Map<List<FeedbackDto>>(feedbacks);
        }

        // Admin feedback silir
        public async Task DeleteAsync(int id)
        {
            var feedback = await _context.Feedbacks.FindAsync(id);

            if (feedback == null)
                throw new NotFoundException("Feedback tapılmadı");

            _context.Feedbacks.Remove(feedback);
            await _context.SaveChangesAsync();
        }
    }
}