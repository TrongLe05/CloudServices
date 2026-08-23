using MediatR;
namespace CloudServices.Application.Features.OrderRequests.Commands.CreateOrderRequest;
public sealed record CreateOrderRequestCommand(Guid ServicePlanId, string BillingCycle, string CustomerName, string Email, string Phone, string? CompanyName) : IRequest<Guid>;
