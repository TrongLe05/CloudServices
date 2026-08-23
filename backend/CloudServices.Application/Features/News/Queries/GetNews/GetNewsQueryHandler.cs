using CloudServices.Application.Common.Interfaces.Repositories;
using MediatR;
namespace CloudServices.Application.Features.News.Queries.GetNews;
public sealed class GetNewsQueryHandler(INewsRepository repository) : IRequestHandler<GetNewsQuery, NewsPage>
{ public async Task<NewsPage> Handle(GetNewsQuery request, CancellationToken cancellationToken) { var page = Math.Max(request.Page, 1); var pageSize = Math.Clamp(request.PageSize, 1, 100); var (items, total) = await repository.GetPagedAsync(request.Search, request.Category, request.Sort, page, pageSize, cancellationToken); return new NewsPage(items.Select(NewsMapper.ToDto).ToList(), page, pageSize, total); } }
