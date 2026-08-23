using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Common.Models;
using MediatR;
namespace CloudServices.Application.Features.ServicePlans.Queries;
public sealed class GetServicePlansQueryHandler(IServicePlanRepository repository) : IRequestHandler<GetServicePlansQuery, PagedResult<ServicePlanDto>>
{ public async Task<PagedResult<ServicePlanDto>> Handle(GetServicePlansQuery request, CancellationToken cancellationToken) { var page = Math.Max(1, request.Page); var pageSize = Math.Clamp(request.PageSize, 1, 100); var (items, total) = await repository.GetPagedAsync(request.CategoryId, request.Search, request.Sort, page, pageSize, cancellationToken); return new PagedResult<ServicePlanDto>(items.Select(ServicePlanMapper.ToDto).ToList(), page, pageSize, total); } }
