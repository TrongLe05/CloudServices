using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CloudServices.Application.Features.PlanPrices.Commands;
using CloudServices.Application.Features.PlanPrices.DTOs;
using CloudServices.Application.Features.PlanPrices.Queries;

namespace CloudServices.API.Controllers;

[ApiController]
[Route("api/service-plans/{id:guid}/prices")]
public class PlanPricesController : ControllerBase
{
    private readonly IMediator _mediator;

    public PlanPricesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // Public: GET /api/service-plans/{id}/prices
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<PlanPriceDto>>> GetPrices(Guid id)
    {
        var result = await _mediator.Send(new GetPlanPricesQuery(id));
        return Ok(result);
    }

    // Admin: POST /api/service-plans/{id}/prices
    [HttpPost]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<ActionResult<Guid>> CreatePrice(Guid id, [FromBody] CreatePlanPriceRequest request)
    {
        var command = new CreatePlanPriceCommand(id, request.BillingCycle, request.Price, request.PromotionId);
        var createdId = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetPrices), new { id }, createdId);
    }

    // Admin: PUT /api/service-plans/{id}/prices/{priceId}
    [HttpPut("{priceId:guid}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> UpdatePrice(Guid id, Guid priceId, [FromBody] UpdatePlanPriceRequest request)
    {
        var command = new UpdatePlanPriceCommand(id, priceId, request.BillingCycle, request.Price, request.PromotionId);
        var success = await _mediator.Send(command);

        if (!success) return NotFound();
        return NoContent();
    }

    // Admin: DELETE /api/service-plans/{id}/prices/{priceId}
    [HttpDelete("{priceId:guid}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> DeletePrice(Guid id, Guid priceId)
    {
        var command = new DeletePlanPriceCommand(id, priceId);
        var success = await _mediator.Send(command);

        if (!success) return NotFound();
        return NoContent();
    }
}

public record CreatePlanPriceRequest(string BillingCycle, decimal Price, Guid? PromotionId);
public record UpdatePlanPriceRequest(string BillingCycle, decimal Price, Guid? PromotionId);