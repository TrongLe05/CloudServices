using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Common.Models;
using MediatR;

namespace CloudServices.Application.Features.ServicePlans.Queries;

public sealed class GetServicePlansQueryHandler(IServicePlanRepository repository, ICacheService cache)
    : IRequestHandler<GetServicePlansQuery, PagedResult<ServicePlanDto>>
{
    public async Task<PagedResult<ServicePlanDto>> Handle(GetServicePlansQuery request, CancellationToken cancellationToken)
    {
        var page = Math.Max(1, request.Page);
        var pageSize = Math.Clamp(request.PageSize, 1, 100);
        var cacheKey = $"plans:p_{page}_ps_{pageSize}_cat_{request.CategoryId}_s_{request.Search?.Trim().ToLowerInvariant()}_sort_{request.Sort?.Trim().ToLowerInvariant()}";

        return await cache.GetOrCreateAsync(
            cacheKey,
            async ct =>
            {
                var (items, total) = await repository.GetPagedAsync(request.CategoryId, request.Search, request.Sort, page, pageSize, ct);
                return new PagedResult<ServicePlanDto>(items.Select(ServicePlanMapper.ToDto).ToList(), page, pageSize, total);
            },
            TimeSpan.FromMinutes(1),
            cancellationToken);
    }
}
