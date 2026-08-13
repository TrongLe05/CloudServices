using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.News.Dtos;
using MediatR;

namespace CloudServices.Application.Features.News.Queries.GetNewsList;

public class GetNewsListQueryHandler : IRequestHandler<GetNewsListQuery, GetNewsListResult>
{
    private readonly INewsRepository _newsRepository;

    public GetNewsListQueryHandler(INewsRepository newsRepository)
    {
        _newsRepository = newsRepository;
    }

    public async Task<GetNewsListResult> Handle(GetNewsListQuery request, CancellationToken cancellationToken)
    {
        var (items, total) = await _newsRepository.GetPagedAsync(request.Page, request.PageSize, request.Search, request.Category, request.Sort, cancellationToken);

        var dtos = items.Select(n => new NewsDto
        {
            Id = n.Id,
            Title = n.Title,
            Slug = n.Slug,
            Content = n.Content,
            ThumbnailUrl = n.ThumbnailUrl,
            PublishedAt = n.PublishedAt,
            AuthorId = n.AuthorId
        }).ToList();

        return new GetNewsListResult(dtos, total);
    }
}
