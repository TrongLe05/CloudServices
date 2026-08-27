using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Statistics.DTOs;
using CloudServices.Domain.Enums;
using MediatR;

namespace CloudServices.Application.Features.Statistics.Queries.GetDashboardStatistics;

public sealed class GetDashboardStatisticsQueryHandler(IOrderRequestRepository orderRepository, ICacheService cache)
    : IRequestHandler<GetDashboardStatisticsQuery, DashboardStatisticsDto>
{
    public async Task<DashboardStatisticsDto> Handle(GetDashboardStatisticsQuery request, CancellationToken cancellationToken)
    {
        return await cache.GetOrCreateAsync(
            "statistics:dashboard",
            async ct =>
            {
                var orders = await orderRepository.GetAllAsync(ct);

                var totalOrders = orders.Count;
                var newOrders = orders.Count(x => x.Status == OrderStatus.New);
                var processingOrders = orders.Count(x => x.Status == OrderStatus.Processing);
                var completedOrders = orders.Count(x => x.Status == OrderStatus.Completed);
                var rejectedOrders = orders.Count(x => x.Status == OrderStatus.Rejected);

                // Thống kê top 5 gói dịch vụ phổ biến
                var popularPlans = orders
                    .Where(x => x.PlanPrice?.Plan != null)
                    .GroupBy(x => new
                    {
                        x.PlanPrice.Plan.Id,
                        x.PlanPrice.Plan.Name,
                        CategoryName = x.PlanPrice.Plan.Category?.Name
                    })
                    .Select(g => new PopularPlanDto(
                        g.Key.Id,
                        g.Key.Name,
                        g.Key.CategoryName,
                        g.Count()
                    ))
                    .OrderByDescending(x => x.OrderCount)
                    .Take(5)
                    .ToList();

                return new DashboardStatisticsDto(
                    totalOrders,
                    newOrders,
                    processingOrders,
                    completedOrders,
                    rejectedOrders,
                    popularPlans
                );
            },
            TimeSpan.FromSeconds(30),
            cancellationToken);
    }
}