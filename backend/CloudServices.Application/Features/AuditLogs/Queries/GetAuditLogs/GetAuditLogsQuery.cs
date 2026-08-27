using CloudServices.Application.Features.AuditLogs.DTOs;
using MediatR;

namespace CloudServices.Application.Features.AuditLogs.Queries.GetAuditLogs;

public sealed record GetAuditLogsQuery(
    string? Category = null,
    string? Search = null,
    string? Action = null,
    string? HttpMethod = null,
    int? StatusCode = null,
    bool? IsSuccess = null,
    string? Username = null,
    DateTime? FromDate = null,
    DateTime? ToDate = null,
    int Page = 1,
    int PageSize = 20
) : IRequest<AuditLogPage>;
