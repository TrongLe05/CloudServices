using MediatR;
namespace CloudServices.Application.Features.News.Queries.GetNews;
public sealed record GetNewsQuery(string? Search, string? Category, string? Sort, int Page = 1, int PageSize = 10) : IRequest<NewsPage>;
