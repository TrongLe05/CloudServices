using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Common.Models;
using MediatR;

namespace CloudServices.Application.Features.ServicePlans.Queries;

public sealed record GetServicePlansQuery(Guid? CategoryId, string? Search, string? Sort, int Page = 1, int PageSize = 10)
    : IRequest<PagedResult<ServicePlanDto>>;

public sealed class GetServicePlansQueryHandler(IServicePlanRepository repository)
    : IRequestHandler<GetServicePlansQuery, PagedResult<ServicePlanDto>>
{
    public async Task<PagedResult<ServicePlanDto>> Handle(GetServicePlansQuery request, CancellationToken cancellationToken)
    {
        var page = Math.Max(1, request.Page);
        var pageSize = Math.Clamp(request.PageSize, 1, 100);
        var (items, total) = await repository.GetPagedAsync(request.CategoryId, request.Search, request.Sort, page, pageSize, cancellationToken);
        return new PagedResult<ServicePlanDto>(items.Select(Map).ToList(), page, pageSize, total);
    }

    internal static ServicePlanDto Map(Domain.Entities.ServicePlan plan) => new(
        plan.Id, plan.CategoryId, plan.Category?.Name, plan.Name, plan.Description,
        plan.Cpu, plan.Ram, plan.Storage, plan.Bandwidth, plan.QrCodeUrl, plan.CreatedAt);
}
