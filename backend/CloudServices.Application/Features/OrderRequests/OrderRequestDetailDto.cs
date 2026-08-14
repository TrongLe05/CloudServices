namespace CloudServices.Application.Features.OrderRequests;

public record OrderRequestDetailDto(
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
    string? Notes,
    DateTime CreatedAt,
    DateTime? LastModifiedAt);
