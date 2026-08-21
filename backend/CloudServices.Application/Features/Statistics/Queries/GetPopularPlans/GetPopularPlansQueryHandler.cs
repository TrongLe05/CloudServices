using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Statistics.DTOs;
using MediatR;

namespace CloudServices.Application.Features.Statistics.Queries.GetPopularPlans;

public sealed class GetPopularPlansQueryHandler(IOrderRequestRepository orderRepository)
    : IRequestHandler<GetPopularPlansQuery, IReadOnlyList<PopularPlanDto>>
{
    public async Task<IReadOnlyList<PopularPlanDto>> Handle(GetPopularPlansQuery request, CancellationToken cancellationToken)
    {
        var orders = await orderRepository.GetAllAsync(cancellationToken);
        var takeCount = request.Top <= 0 ? 5 : request.Top;

        return orders
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
            .Take(takeCount)
            .ToList();
    }
}