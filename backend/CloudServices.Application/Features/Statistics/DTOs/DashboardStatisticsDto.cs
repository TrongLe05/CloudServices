namespace CloudServices.Application.Features.Statistics.DTOs;

public record DashboardStatisticsDto(
    int TotalOrders,
    int NewOrders,
    int ProcessingOrders,
    int CompletedOrders,
    int RejectedOrders,
    IReadOnlyList<PopularPlanDto> PopularPlans
);

public record PopularPlanDto(
    Guid PlanId,
    string PlanName,
    string? CategoryName,
    int OrderCount
);

public record MonthlyOrderStatisticDto(
    string Month,              
    int TotalOrders,          
    int NewOrders,            
    int ProcessingOrders,     
    int CompletedOrders,       
    int RejectedOrders
);