using MediatR;
using CloudServices.Application.Features.News.Dtos;

namespace CloudServices.Application.Features.News.Queries.GetNewsList;

public record GetNewsListQuery : IRequest<GetNewsListResult>
{
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 10;
    public string? Search { get; init; }
    public string? Category { get; init; }
    public string? Sort { get; init; }
}

public record GetNewsListResult(List<NewsDto> Items, int Total);
