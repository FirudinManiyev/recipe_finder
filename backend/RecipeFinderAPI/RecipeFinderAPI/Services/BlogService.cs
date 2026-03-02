using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RecipeFinderAPI.Data;
using RecipeFinderAPI.DTOs;
using RecipeFinderAPI.Entities;

namespace RecipeFinderAPI.Services
{
    public class BlogService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public BlogService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<BlogDto>> GetAllAsync()
        {
            var blogs = await _context.Blogs
                .OrderByDescending(b => b.CreatedDate)
                .ToListAsync();

            return _mapper.Map<List<BlogDto>>(blogs);
        }

        public async Task<BlogDto?> GetByIdAsync(int id)
        {
            var blog = await _context.Blogs.FindAsync(id);

            if (blog == null) return null;

            return _mapper.Map<BlogDto>(blog);
        }

        public async Task CreateAsync(BlogDto dto)
        {
            var blog = _mapper.Map<Blog>(dto);
            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();
        }
    }
}