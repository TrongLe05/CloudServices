namespace CloudServices.Application.Features.OrderRequests;

public record OrderRequestDto(
    Guid Id,
    Guid ServicePlanId,
    string ServicePlanName,
    string BillingCycle,
    decimal Price,
    string CustomerName,
    string Email,
    string Phone,
    string? CompanyName,
    string Status,
    DateTime CreatedAt);
