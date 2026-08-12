using CloudServices.Application.Features.ServiceCategories;
using CloudServices.Application.Features.ServiceCategories.Commands.CreateServiceCategory;
using CloudServices.Application.Features.ServiceCategories.Commands.DeleteServiceCategory;
using CloudServices.Application.Features.ServiceCategories.Commands.UpdateServiceCategory;
using CloudServices.Application.Features.ServiceCategories.Queries.GetServiceCategoryById;
using CloudServices.Application.Features.ServiceCategories.Queries.GetServiceCategories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudServices.API.Controllers;

[Route("api/service-categories")]
public class ServiceCategoriesController : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ServiceCategoryDto>>> GetAll(CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(new GetServiceCategoriesQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ServiceCategoryDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(new GetServiceCategoryByIdQuery(id), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Guid>> Create([FromBody] CreateServiceCategoryCommand command, CancellationToken cancellationToken)
    {
        var categoryId = await Mediator.Send(command, cancellationToken);
        return Ok(categoryId);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateServiceCategoryCommand command, CancellationToken cancellationToken)
    {
        if (id != command.Id)
        {
            return BadRequest("Id does not match request body.");
        }

        await Mediator.Send(command, cancellationToken);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await Mediator.Send(new DeleteServiceCategoryCommand(id), cancellationToken);
        return NoContent();
    }
}
