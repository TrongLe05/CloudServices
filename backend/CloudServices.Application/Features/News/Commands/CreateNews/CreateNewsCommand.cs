using MediatR;
using CloudServices.Application.Features.News.Dtos;

namespace CloudServices.Application.Features.News.Commands.CreateNews;

public record CreateNewsCommand : IRequest<Guid>
{
    public string Title { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string Content { get; init; } = string.Empty;
    public string? ThumbnailUrl { get; init; }
    public DateTime? PublishedAt { get; init; }
    public Guid? AuthorId { get; init; }
}
