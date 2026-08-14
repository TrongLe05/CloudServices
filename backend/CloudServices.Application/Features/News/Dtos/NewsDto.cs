using System;

namespace CloudServices.Application.Features.News.Dtos;

public record NewsDto
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string Content { get; init; } = string.Empty;
    public string? ThumbnailUrl { get; init; }
    public DateTime? PublishedAt { get; init; }
    public Guid? AuthorId { get; init; }
}
