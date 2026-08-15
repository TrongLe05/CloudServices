using CloudServices.Application.Features.OrderRequests.Commands.ChangeOrderStatus;
using CloudServices.Application.Features.OrderRequests.Commands.CreateOrderRequest;
using CloudServices.Application.Features.OrderRequests.Commands.DeleteOrderRequest;
using CloudServices.Application.Features.OrderRequests.Queries.GetOrderRequestById;
using CloudServices.Application.Features.OrderRequests.Queries.GetOrderRequests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudServices.API.Controllers;

[Route("api/order-requests")]
public sealed class OrderRequestsController : ApiControllerBase
{
    [HttpPost, AllowAnonymous]
    public async Task<IActionResult> Create(CreateOrderRequestCommand command, CancellationToken cancellationToken) { var id = await Mediator.Send(command, cancellationToken); return CreatedAtAction(nameof(GetById), new { id }, new { id }); }
    [HttpGet, Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> Get(string? search, string? status, string? sort, int page = 1, int pageSize = 10, CancellationToken cancellationToken = default) => Ok(await Mediator.Send(new GetOrderRequestsQuery(search, status, sort, page, pageSize), cancellationToken));
    [HttpGet("{id:guid}"), Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken) => Ok(await Mediator.Send(new GetOrderRequestByIdQuery(id), cancellationToken));
    [HttpPatch("{id:guid}/status"), Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> ChangeStatus(Guid id, ChangeOrderStatusRequest request, CancellationToken cancellationToken) { await Mediator.Send(new ChangeOrderStatusCommand(id, request.Status), cancellationToken); return NoContent(); }
    [HttpDelete("{id:guid}"), Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken) { await Mediator.Send(new DeleteOrderRequestCommand(id), cancellationToken); return NoContent(); }
}
public sealed record ChangeOrderStatusRequest(string Status);
