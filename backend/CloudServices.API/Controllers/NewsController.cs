using CloudServices.Application.Features.News.Commands.CreateNews;
using CloudServices.Application.Features.News.Commands.DeleteNews;
using CloudServices.Application.Features.News.Commands.UpdateNews;
using CloudServices.Application.Features.News.Queries.GetNewsById;
using CloudServices.Application.Features.News.Queries.GetNewsList;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudServices.API.Controllers;

public class NewsController : ApiControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null, [FromQuery] string? category = null, [FromQuery] string? sort = null)
    {
        var result = await Mediator.Send(new GetNewsListQuery { Page = page, PageSize = pageSize, Search = search, Category = category, Sort = sort });
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var item = await Mediator.Send(new GetNewsByIdQuery(id));
        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> Create([FromBody] CreateNewsCommand command)
    {
        var id = await Mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id }, new { Id = id });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateNewsCommand command)
    {
        if (id != command.Id) return BadRequest();
        await Mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await Mediator.Send(new DeleteNewsCommand(id));
        return NoContent();
    }
}
