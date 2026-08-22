using MediatR;
namespace CloudServices.Application.Features.OrderRequests.Queries.GetOrderRequests;
public sealed record GetOrderRequestsQuery(string? Search, string? Status, string? Sort, int Page = 1, int PageSize = 10, string? CustomerEmail = null) : IRequest<OrderRequestPage>;

