using CloudServices.Application.Features.ServicePlans.Commands;
using CloudServices.Application.Features.ServicePlans.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudServices.API.Controllers;

[Route("api/service-plans")]
public sealed class ServicePlansController : ApiControllerBase
{
    [HttpGet, AllowAnonymous]
    public async Task<IActionResult> Get(Guid? categoryId, string? search, string? sort, int page = 1, int pageSize = 10, CancellationToken cancellationToken = default) =>
        Ok(await Mediator.Send(new GetServicePlansQuery(categoryId, search, sort, page, pageSize), cancellationToken));

    [HttpGet("{id:guid}"), AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken) => Ok(await Mediator.Send(new GetServicePlanByIdQuery(id), cancellationToken));

    [HttpPost, Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(CreateServicePlanCommand command, CancellationToken cancellationToken)
    {
        var id = await Mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:guid}"), Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, UpdateServicePlanRequest request, CancellationToken cancellationToken)
    {
        await Mediator.Send(new UpdateServicePlanCommand(id, request.CategoryId, request.Name, request.Description, request.Cpu, request.Ram, request.Storage, request.Bandwidth), cancellationToken);
        return NoContent();
    }

    [HttpDelete("{id:guid}"), Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken) { await Mediator.Send(new DeleteServicePlanCommand(id), cancellationToken); return NoContent(); }
}

public sealed record UpdateServicePlanRequest(Guid CategoryId, string Name, string? Description, string? Cpu, string? Ram, string? Storage, string? Bandwidth);
