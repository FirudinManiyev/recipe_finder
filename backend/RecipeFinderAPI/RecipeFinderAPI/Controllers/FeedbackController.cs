using Microsoft.AspNetCore.Authorization;
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

        // 🔓 Public - istənilən user feedback göndərə bilər
        [HttpPost]
        public async Task<IActionResult> Create(CreateFeedbackDto dto)
        {
            await _service.CreateAsync(dto);
            return Ok("Feedback göndərildi");
        }

        // 🔒 Admin bütün feedbackləri görür
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var feedbacks = await _service.GetAllAsync();
            return Ok(feedbacks);
        }

        // 🔒 Admin feedback silir
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return Ok("Feedback silindi");
        }
    }
}