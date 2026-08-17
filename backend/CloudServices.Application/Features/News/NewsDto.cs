namespace CloudServices.Application.Features.News;

public sealed record NewsDto(Guid Id, string Title, string Slug, string Category, string Content, string? ThumbnailUrl, DateTime? PublishedAt, DateTime CreatedAt);
public sealed record NewsPage(IReadOnlyList<NewsDto> Items, int Page, int PageSize, int TotalCount);
