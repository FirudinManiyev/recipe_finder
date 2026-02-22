using Microsoft.AspNetCore.Mvc;
using RecipeFinderAPI.DTOs;
using RecipeFinderAPI.Interfaces;

namespace RecipeFinderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipesController : ControllerBase
    {
        private readonly IRecipeService _service;

        public RecipesController(IRecipeService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var recipes = await _service.GetAllAsync();
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

        [HttpPost]
        public async Task<IActionResult> Create(CreateRecipeDto dto)
        {
            await _service.CreateAsync(dto);
            return Ok();
        }

        [HttpPost("search")]
        public async Task<IActionResult> Search([FromBody] List<string> ingredients)
        {
            var result = await _service.SearchByIngredientsAsync(ingredients);
            return Ok(result);
        }
    }
}