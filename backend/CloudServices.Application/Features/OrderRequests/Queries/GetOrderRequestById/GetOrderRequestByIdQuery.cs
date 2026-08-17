using MediatR;
namespace CloudServices.Application.Features.OrderRequests.Queries.GetOrderRequestById;
public sealed record GetOrderRequestByIdQuery(Guid Id) : IRequest<OrderRequestDto>;
