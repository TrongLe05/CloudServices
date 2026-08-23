using MediatR;
namespace CloudServices.Application.Features.OrderRequests.Commands.ChangeOrderStatus;
public sealed record ChangeOrderStatusCommand(Guid Id, string Status) : IRequest;
