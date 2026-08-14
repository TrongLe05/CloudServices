using MediatR;

namespace CloudServices.Application.Features.OrderRequests.Queries.GetOrderRequests;

public record GetOrderRequestsQuery(
    int Page = 1,
    int PageSize = 10,
    string? Search = null,
    string? Status = null,
    string? Sort = null) : IRequest<List<OrderRequestDto>>;
