using CloudServices.Application.Features.Statistics.DTOs;
using MediatR;

namespace CloudServices.Application.Features.Statistics.Queries.GetPopularPlans;

public record GetPopularPlansQuery(int Top = 5) : IRequest<IReadOnlyList<PopularPlanDto>>;