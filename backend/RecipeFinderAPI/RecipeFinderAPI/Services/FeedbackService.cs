using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RecipeFinderAPI.Data;
using RecipeFinderAPI.DTOs;
using RecipeFinderAPI.Entities;
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

        public async Task CreateAsync(CreateFeedbackDto dto)
        {
            var feedback = _mapper.Map<Feedback>(dto);

            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();
        }

        public async Task<List<CreateFeedbackDto>> GetAllAsync()
        {
            var feedbacks = await _context.Feedbacks
                .OrderByDescending(f => f.Id)
                .ToListAsync();

            return _mapper.Map<List<CreateFeedbackDto>>(feedbacks);
        }
    }
}