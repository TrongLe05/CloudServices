using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.News.Queries.GetNews;
using MediatR;

namespace CloudServices.Application.Features.News.Queries.GetNewsById;

public sealed class GetNewsByIdQueryHandler(INewsRepository repository, ICacheService cache) : IRequestHandler<GetNewsByIdQuery, NewsDto>
{
    public async Task<NewsDto> Handle(GetNewsByIdQuery request, CancellationToken cancellationToken)
    {
        return await cache.GetOrCreateAsync(
            $"news:id_{request.Id}",
            async ct =>
            {
                var article = await repository.GetByIdAsync(request.Id, ct)
                    ?? throw new NotFoundException("News article was not found.");
                return NewsMapper.ToDto(article);
            },
            TimeSpan.FromMinutes(5),
            cancellationToken);
    }
}
