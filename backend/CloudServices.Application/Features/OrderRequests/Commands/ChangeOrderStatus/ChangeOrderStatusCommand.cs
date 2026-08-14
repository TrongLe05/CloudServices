using CloudServices.Domain.Enums;
using MediatR;

namespace CloudServices.Application.Features.OrderRequests.Commands.ChangeOrderStatus;

public record ChangeOrderStatusCommand(Guid Id, string Status) : IRequest<bool>;
