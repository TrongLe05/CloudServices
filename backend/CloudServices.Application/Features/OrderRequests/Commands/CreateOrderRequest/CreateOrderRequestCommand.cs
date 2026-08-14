using MediatR;

namespace CloudServices.Application.Features.OrderRequests.Commands.CreateOrderRequest;

public record CreateOrderRequestCommand : IRequest<Guid>
{
    public Guid ServicePlanId { get; init; } = Guid.Empty;
    public string BillingCycle { get; init; } = string.Empty;
    public string CustomerName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public string? CompanyName { get; init; }
}
