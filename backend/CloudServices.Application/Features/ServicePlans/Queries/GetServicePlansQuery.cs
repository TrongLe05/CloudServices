using CloudServices.Application.Common.Models;
using MediatR;

namespace CloudServices.Application.Features.ServicePlans.Queries;

public sealed record GetServicePlansQuery(Guid? CategoryId, string? Search, string? Sort, int Page = 1, int PageSize = 10)
    : IRequest<PagedResult<ServicePlanDto>>;

