using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using MediatR;

namespace CloudServices.Application.Features.News.Queries.GetNews;

public sealed class GetNewsQueryHandler(INewsRepository repository, ICacheService cache) : IRequestHandler<GetNewsQuery, NewsPage>
{
    public async Task<NewsPage> Handle(GetNewsQuery request, CancellationToken cancellationToken)
    {
        var page = Math.Max(request.Page, 1);
        var pageSize = Math.Clamp(request.PageSize, 1, 100);
        var cacheKey = $"news:p_{page}_ps_{pageSize}_cat_{request.Category?.Trim().ToLowerInvariant()}_s_{request.Search?.Trim().ToLowerInvariant()}_sort_{request.Sort?.Trim().ToLowerInvariant()}";

        return await cache.GetOrCreateAsync(
            cacheKey,
            async ct =>
            {
                var (items, total) = await repository.GetPagedAsync(request.Search, request.Category, request.Sort, page, pageSize, ct);
                return new NewsPage(items.Select(NewsMapper.ToDto).ToList(), page, pageSize, total);
            },
            TimeSpan.FromMinutes(2),
            cancellationToken);
    }
}
