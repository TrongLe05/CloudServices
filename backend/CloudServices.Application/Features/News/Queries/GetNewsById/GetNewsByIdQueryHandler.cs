using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.News.Queries.GetNews;
using MediatR;
namespace CloudServices.Application.Features.News.Queries.GetNewsById;
public sealed class GetNewsByIdQueryHandler(INewsRepository repository) : IRequestHandler<GetNewsByIdQuery, NewsDto>
{ public async Task<NewsDto> Handle(GetNewsByIdQuery request, CancellationToken cancellationToken) => NewsMapper.ToDto(await repository.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException("News article was not found.")); }
