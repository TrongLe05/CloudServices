using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CloudServices.Application.Features.Testimonials.Commands;
using CloudServices.Application.Features.Testimonials.DTOs;
using CloudServices.Application.Features.Testimonials.Queries;

namespace CloudServices.API.Controllers;

[ApiController]
[Route("api/testimonials")]
public class TestimonialsController : ApiControllerBase
{
    // 1. PUBLIC: GET /api/testimonials
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<TestimonialDto>>> GetAll()
    {
        var result = await Mediator.Send(new GetAllTestimonialsQuery());
        return Ok(result);
    }

    // 2. PUBLIC: GET /api/testimonials/{id}
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<TestimonialDto>> GetById(Guid id)
    {
        var result = await Mediator.Send(new GetTestimonialByIdQuery(id));
        if (result == null) return NotFound(new { message = "Testimonial not found." });
        return Ok(result);
    }

    // 3. ADMIN: POST /api/testimonials
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<TestimonialDto>> Create([FromBody] CreateTestimonialDto dto)
    {
        var result = await Mediator.Send(new CreateTestimonialCommand(dto));
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    // 4. ADMIN: PUT /api/testimonials/{id}
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<TestimonialDto>> Update(Guid id, [FromBody] UpdateTestimonialDto dto)
    {
        var result = await Mediator.Send(new UpdateTestimonialCommand(id, dto));
        if (result == null) return NotFound(new { message = "Testimonial not found." });
        return Ok(result);
    }

    // 5. ADMIN: DELETE /api/testimonials/{id}
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await Mediator.Send(new DeleteTestimonialCommand(id));
        if (!success) return NotFound(new { message = "Testimonial not found." });
        return Ok(new { message = "Testimonial deleted successfully." });
    }
}