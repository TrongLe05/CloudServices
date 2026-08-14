using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.News.Dtos;
using MediatR;

namespace CloudServices.Application.Features.News.Queries.GetNewsById;

public class GetNewsByIdQueryHandler : IRequestHandler<GetNewsByIdQuery, NewsDto?>
{
    private readonly INewsRepository _newsRepository;

    public GetNewsByIdQueryHandler(INewsRepository newsRepository)
    {
        _newsRepository = newsRepository;
    }

    public async Task<NewsDto?> Handle(GetNewsByIdQuery request, CancellationToken cancellationToken)
    {
        var n = await _newsRepository.GetByIdAsync(request.Id, cancellationToken);
        if (n == null) return null;

        return new NewsDto
        {
            Id = n.Id,
            Title = n.Title,
            Slug = n.Slug,
            Content = n.Content,
            ThumbnailUrl = n.ThumbnailUrl,
            PublishedAt = n.PublishedAt,
            AuthorId = n.AuthorId
        };
    }
}
