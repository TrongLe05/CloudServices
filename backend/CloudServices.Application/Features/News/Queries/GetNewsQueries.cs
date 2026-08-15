using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces.Repositories;
using MediatR;

namespace CloudServices.Application.Features.News.Queries;

public sealed record GetNewsQuery(string? Search, string? Category, string? Sort, int Page = 1, int PageSize = 10) : IRequest<NewsPage>;
public sealed record GetNewsByIdQuery(Guid Id) : IRequest<NewsDto>;

public sealed class GetNewsQueryHandler(INewsRepository repository) : IRequestHandler<GetNewsQuery, NewsPage>
{
    public async Task<NewsPage> Handle(GetNewsQuery request, CancellationToken cancellationToken)
    {
        var page = Math.Max(request.Page, 1); var pageSize = Math.Clamp(request.PageSize, 1, 100);
        var (items, total) = await repository.GetPagedAsync(request.Search, request.Category, request.Sort, page, pageSize, cancellationToken);
        return new NewsPage(items.Select(Map).ToList(), page, pageSize, total);
    }
    internal static NewsDto Map(Domain.Entities.NewsArticle article) => new(article.Id, article.Title, article.Slug, article.Category, article.Content, article.ThumbnailUrl, article.PublishedAt, article.CreatedAt);
}

public sealed class GetNewsByIdQueryHandler(INewsRepository repository) : IRequestHandler<GetNewsByIdQuery, NewsDto>
{
    public async Task<NewsDto> Handle(GetNewsByIdQuery request, CancellationToken cancellationToken) => GetNewsQueryHandler.Map(
        await repository.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException("News article was not found."));
}
