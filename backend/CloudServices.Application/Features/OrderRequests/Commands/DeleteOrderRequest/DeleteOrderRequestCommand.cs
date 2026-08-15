using MediatR;
namespace CloudServices.Application.Features.OrderRequests.Commands.DeleteOrderRequest;
public sealed record DeleteOrderRequestCommand(Guid Id) : IRequest;
