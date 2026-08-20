using CloudServices.Application.Features.Statistics.DTOs;
using MediatR;

namespace CloudServices.Application.Features.Statistics.Queries.GetOrderStatistics;

public record GetOrderStatisticsQuery(string? From, string? To) : IRequest<IReadOnlyList<MonthlyOrderStatisticDto>>;