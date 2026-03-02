using Microsoft.AspNetCore.Mvc;
using RecipeFinderAPI.DTOs;
using RecipeFinderAPI.Services;

namespace RecipeFinderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogsController : ControllerBase
    {
        private readonly BlogService _service;

        public BlogsController(BlogService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var blogs = await _service.GetAllAsync();
            return Ok(blogs);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var blog = await _service.GetByIdAsync(id);
            if (blog == null) return NotFound();

            return Ok(blog);
        }

        [HttpPost]
        public async Task<IActionResult> Create(BlogDto dto)
        {
            await _service.CreateAsync(dto);
            return Ok();
        }
    }
}