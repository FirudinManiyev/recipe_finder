using Microsoft.AspNetCore.Mvc;
using RecipeFinderAPI.DTOs;
using RecipeFinderAPI.Interfaces;

namespace RecipeFinderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _service;

        public FeedbackController(IFeedbackService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateFeedbackDto dto)
        {
            await _service.CreateAsync(dto);
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var feedbacks = await _service.GetAllAsync();
            return Ok(feedbacks);
        }
    }
}