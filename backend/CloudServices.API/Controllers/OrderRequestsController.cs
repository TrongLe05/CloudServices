using CloudServices.Application.Features.OrderRequests;
using CloudServices.Application.Features.OrderRequests.Commands.ChangeOrderStatus;
using CloudServices.Application.Features.OrderRequests.Commands.CreateOrderRequest;
using CloudServices.Application.Features.OrderRequests.Commands.DeleteOrderRequest;
using CloudServices.Application.Features.OrderRequests.Queries.GetOrderRequestDetail;
using CloudServices.Application.Features.OrderRequests.Queries.GetOrderRequests;
using Microsoft.AspNetCore.Mvc;

namespace CloudServices.API.Controllers;

[Route("api/order-requests")]
public class OrderRequestsController : ApiControllerBase
{
    [HttpPost]
    [ProducesResponseType(typeof(Guid), StatusCodes.Status200OK)]
    public async Task<ActionResult<Guid>> CreateOrderRequest(
        [FromBody] CreateOrderRequestCommand command,
        CancellationToken cancellationToken)
    {
        var id = await Mediator.Send(command, cancellationToken);
        return Ok(id);
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<OrderRequestDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<OrderRequestDto>>> GetOrderRequests(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? status = null,
        [FromQuery] string? sort = null,
        CancellationToken cancellationToken = default)
    {
        var result = await Mediator.Send(new GetOrderRequestsQuery(page, pageSize, search, status, sort), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(OrderRequestDetailDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<OrderRequestDetailDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(new GetOrderRequestDetailQuery(id), cancellationToken);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult> ChangeStatus(Guid id, [FromBody] ChangeOrderStatusRequest request, CancellationToken cancellationToken)
    {
        var success = await Mediator.Send(new ChangeOrderStatusCommand(id, request.Status), cancellationToken);
        return success ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var success = await Mediator.Send(new DeleteOrderRequestCommand(id), cancellationToken);
        return success ? NoContent() : NotFound();
    }

    public sealed class ChangeOrderStatusRequest
    {
        public string Status { get; set; } = string.Empty;
    }
}
