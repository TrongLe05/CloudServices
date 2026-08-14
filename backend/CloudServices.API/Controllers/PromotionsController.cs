using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CloudServices.Application.Features.Promotions.Commands;
using CloudServices.Application.Features.Promotions.DTOs;
using CloudServices.Application.Features.Promotions.Queries;

namespace CloudServices.API.Controllers;

[ApiController]
[Route("api/promotions")]
public class PromotionsController : ApiControllerBase
{
    // 1. PUBLIC: GET /api/promotions
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<PromotionDto>>> GetAll()
    {
        return Ok(await Mediator.Send(new GetPromotionsQuery()));
    }

    // 2. PUBLIC: GET /api/promotions/{id}
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<PromotionDto>> GetById(Guid id)
    {
        var result = await Mediator.Send(new GetPromotionByIdQuery(id));
        if (result == null) return NotFound(new { message = "Promotion not found." });
        return Ok(result);
    }

    // 3. ADMIN: POST /api/promotions
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Guid>> Create([FromBody] CreatePromotionCommand command)
    {
        var id = await Mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    // 4. ADMIN: PUT /api/promotions/{id}
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePromotionCommand command)
    {
        if (id != command.Id) return BadRequest(new { message = "Id mismatch." });

        var success = await Mediator.Send(command);
        if (!success) return NotFound(new { message = "Promotion not found." });

        return NoContent();
    }

    // 5. ADMIN: DELETE /api/promotions/{id}
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await Mediator.Send(new DeletePromotionCommand(id));
        if (!success) return NotFound(new { message = "Promotion not found." });

        return NoContent();
    }
}