using MediatR;
using CloudServices.Application.Features.News.Dtos;

namespace CloudServices.Application.Features.News.Queries.GetNewsById;

public record GetNewsByIdQuery(Guid Id) : IRequest<NewsDto?>;
