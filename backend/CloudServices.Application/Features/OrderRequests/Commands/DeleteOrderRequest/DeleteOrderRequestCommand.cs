using MediatR;

namespace CloudServices.Application.Features.OrderRequests.Commands.DeleteOrderRequest;

public record DeleteOrderRequestCommand(Guid Id) : IRequest<bool>;
