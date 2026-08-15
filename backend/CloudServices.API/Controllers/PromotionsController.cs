using CloudServices.Application.Features.Promotions.Commands;
using CloudServices.Application.Features.Promotions.DTOs;
using CloudServices.Application.Features.Promotions.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudServices.API.Controllers;

[ApiController]
[Route("api/promotions")]
public class PromotionsController : ApiControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<PromotionDto>>> GetAll()
    {
        return await Mediator.Send(new GetPromotionsQuery());
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<PromotionDto>> GetById(Guid id)
    {
        var result = await Mediator.Send(new GetPromotionByIdQuery(id));
        if (result == null) return NotFound();
        return result;
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<PromotionDto>> Create(CreatePromotionCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<PromotionDto>> Update(Guid id, UpdatePromotionCommand command)
    {
        if (id != command.Id) return BadRequest();
        var result = await Mediator.Send(command);
        if (result == null) return NotFound();
        return result;
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await Mediator.Send(new DeletePromotionCommand(id));
        if (!result) return NotFound();
        return NoContent();
    }
}