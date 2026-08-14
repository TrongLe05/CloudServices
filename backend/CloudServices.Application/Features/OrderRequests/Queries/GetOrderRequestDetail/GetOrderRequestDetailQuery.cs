using MediatR;

namespace CloudServices.Application.Features.OrderRequests.Queries.GetOrderRequestDetail;

public record GetOrderRequestDetailQuery(Guid Id) : IRequest<OrderRequestDetailDto?>;
