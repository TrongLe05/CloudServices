using MediatR;

namespace CloudServices.Application.Features.News.Commands.UpdateNews;

public record UpdateNewsCommand : IRequest
{
    public Guid Id { get; init; }
    public string? Title { get; init; }
    public string? Slug { get; init; }
    public string? Content { get; init; }
    public string? ThumbnailUrl { get; init; }
    public DateTime? PublishedAt { get; init; }
    public Guid? AuthorId { get; init; }
}
