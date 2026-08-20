using CloudServices.Application.Features.Statistics.DTOs;
using MediatR;

namespace CloudServices.Application.Features.Statistics.Queries.GetDashboardStatistics;

public record GetDashboardStatisticsQuery : IRequest<DashboardStatisticsDto>;