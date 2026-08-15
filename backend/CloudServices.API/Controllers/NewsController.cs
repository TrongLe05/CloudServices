using CloudServices.Application.Features.News.Commands.CreateNews;
using CloudServices.Application.Features.News.Commands.DeleteNews;
using CloudServices.Application.Features.News.Commands.UpdateNews;
using CloudServices.Application.Features.News.Queries.GetNews;
using CloudServices.Application.Features.News.Queries.GetNewsById;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudServices.API.Controllers;

[Route("api/news")]
public sealed class NewsController : ApiControllerBase
{
    [HttpGet, AllowAnonymous]
    public async Task<IActionResult> Get(string? search, string? category, string? sort, int page = 1, int pageSize = 10, CancellationToken cancellationToken = default) => Ok(await Mediator.Send(new GetNewsQuery(search, category, sort, page, pageSize), cancellationToken));
    [HttpGet("{id:guid}"), AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken) => Ok(await Mediator.Send(new GetNewsByIdQuery(id), cancellationToken));
    [HttpPost, Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> Create(CreateNewsCommand command, CancellationToken cancellationToken) { var id = await Mediator.Send(command, cancellationToken); return CreatedAtAction(nameof(GetById), new { id }, new { id }); }
    [HttpPut("{id:guid}"), Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> Update(Guid id, UpdateNewsRequest request, CancellationToken cancellationToken) { await Mediator.Send(new UpdateNewsCommand(id, request.Title, request.Slug, request.Category, request.Content, request.ThumbnailUrl, request.PublishedAt), cancellationToken); return NoContent(); }
    [HttpDelete("{id:guid}"), Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken) { await Mediator.Send(new DeleteNewsCommand(id), cancellationToken); return NoContent(); }
}
public sealed record UpdateNewsRequest(string Title, string Slug, string Category, string Content, string? ThumbnailUrl, DateTime? PublishedAt);
