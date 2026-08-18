using MediatR;
namespace CloudServices.Application.Features.News.Queries.GetNewsById;
public sealed record GetNewsByIdQuery(Guid Id) : IRequest<NewsDto>;
