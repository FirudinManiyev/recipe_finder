using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeFinderAPI.Data;
using RecipeFinderAPI.DTOs;
using RecipeFinderAPI.Helpers;
using RecipeFinderAPI.Interfaces;
using RecipeFinderAPI.Services;

namespace RecipeFinderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipesController : ControllerBase
    {
        private readonly IRecipeService _service;
        private readonly AppDbContext _context;

        public RecipesController(IRecipeService service, AppDbContext context)
        {
            _service = service;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] PaginationParams paginationParams)
        {
            var recipes = await _service.GetAllAsync(paginationParams);
            return Ok(recipes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var recipe = await _service.GetByIdAsync(id);

            if (recipe == null)
                return NotFound();

            return Ok(recipe);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CreateRecipeDto dto)
        {
            await _service.CreateAsync(dto);
            return Ok();
        }

        [HttpPost("search")]
        public async Task<IActionResult> Search([FromBody] RecipeSearchDto searchDto)
        {
            var result = await _service.SearchAsync(searchDto);
            return Ok(result);
        }

        [HttpGet("random")]
        public async Task<IActionResult> GetRandom()
        {
            var recipe = await _service.GetRandomAsync();

            if (recipe == null)
                return NotFound();

            return Ok(recipe);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Update(int id, CreateRecipeDto dto)
        {
            await _service.UpdateAsync(id, dto);
            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return Ok();
        }

        [HttpGet("count")]
        public async Task<IActionResult> GetRecipeCount()
        {
            var count = await _context.Recipes.CountAsync();
            return Ok(count);
        }
    }
}
