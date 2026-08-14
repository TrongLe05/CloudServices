using CloudServices.Application.Features.Testimonials.Commands;
using CloudServices.Application.Features.Testimonials.DTOs;
using CloudServices.Application.Features.Testimonials.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudServices.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestimonialsController : ControllerBase
{
    private readonly IMediator _mediator;

    public TestimonialsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<TestimonialDto>>> GetAll(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAllTestimonialsQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<TestimonialDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetTestimonialByIdQuery(id), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<TestimonialDto>> Create([FromBody] CreateTestimonialRequest request, CancellationToken cancellationToken)
    {
        var command = new CreateTestimonialCommand(
            request.ClientName,
            request.Company,
            request.Position,
            request.Content,
            request.AvatarUrl,
            request.CompanyLogoUrl,
            request.Rating,
            request.IsActive,
            request.DisplayOrder
        );

        var result = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<TestimonialDto>> Update(Guid id, [FromBody] UpdateTestimonialRequest request, CancellationToken cancellationToken)
    {
        var command = new UpdateTestimonialCommand(
            id,
            request.ClientName,
            request.Company,
            request.Position,
            request.Content,
            request.AvatarUrl,
            request.CompanyLogoUrl,
            request.Rating,
            request.IsActive,
            request.DisplayOrder
        );

        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _mediator.Send(new DeleteTestimonialCommand(id), cancellationToken);
        return Ok(new { message = "Testimonial deleted successfully." });
    }
}

public record CreateTestimonialRequest(
    string ClientName,
    string? Company,
    string? Position,
    string Content,
    string? AvatarUrl,
    string? CompanyLogoUrl,
    int Rating,
    bool IsActive = true,
    int DisplayOrder = 0
);

public record UpdateTestimonialRequest(
    string ClientName,
    string? Company,
    string? Position,
    string Content,
    string? AvatarUrl,
    string? CompanyLogoUrl,
    int Rating,
    bool IsActive,
    int DisplayOrder
);