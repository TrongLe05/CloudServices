using CloudServices.Application.Features.ServiceCategories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudServices.API.Controllers;

[Route("api/service-categories")]
public sealed class ServiceCategoriesController : ApiControllerBase
{
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ServiceCategoryDto>>> GetAll(CancellationToken cancellationToken) =>
        Ok(await Mediator.Send(new GetServiceCategoriesQuery(), cancellationToken));

    [AllowAnonymous]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ServiceCategoryDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var category = await Mediator.Send(new GetServiceCategoryByIdQuery(id), cancellationToken);
        return category is null ? NotFound() : Ok(category);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<ServiceCategoryDto>> Create(
        CreateServiceCategoryCommand command,
        CancellationToken cancellationToken)
    {
        var id = await Mediator.Send(command, cancellationToken);
        var category = await Mediator.Send(new GetServiceCategoryByIdQuery(id), cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id }, category);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateServiceCategoryRequest request,
        CancellationToken cancellationToken)
    {
        var updated = await Mediator.Send(
            new UpdateServiceCategoryCommand(id, request.Name, request.Slug, request.Description),
            cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await Mediator.Send(new DeleteServiceCategoryCommand(id), cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}

public sealed record UpdateServiceCategoryRequest(string Name, string Slug, string? Description);
