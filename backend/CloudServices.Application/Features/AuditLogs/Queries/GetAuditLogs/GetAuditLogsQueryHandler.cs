using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.AuditLogs.DTOs;
using MediatR;

namespace CloudServices.Application.Features.AuditLogs.Queries.GetAuditLogs;

public sealed class GetAuditLogsQueryHandler(IAuditLogRepository repository)
    : IRequestHandler<GetAuditLogsQuery, AuditLogPage>
{
    public async Task<AuditLogPage> Handle(GetAuditLogsQuery request, CancellationToken cancellationToken)
    {
        var page = Math.Max(request.Page, 1);
        var pageSize = Math.Clamp(request.PageSize, 1, 100);

        var (items, total) = await repository.GetPagedAsync(
            request.Category,
            request.Search,
            request.Action,
            request.HttpMethod,
            request.StatusCode,
            request.IsSuccess,
            request.Username,
            request.FromDate,
            request.ToDate,
            page,
            pageSize,
            cancellationToken);

        return new AuditLogPage(
            items.Select(AuditLogMapper.ToDto).ToList(),
            page,
            pageSize,
            total
        );
    }
}
