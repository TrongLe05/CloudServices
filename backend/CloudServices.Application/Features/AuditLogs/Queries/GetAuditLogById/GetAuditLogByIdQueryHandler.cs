using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.AuditLogs.DTOs;
using MediatR;

namespace CloudServices.Application.Features.AuditLogs.Queries.GetAuditLogById;

public sealed class GetAuditLogByIdQueryHandler(IAuditLogRepository repository)
    : IRequestHandler<GetAuditLogByIdQuery, AuditLogDto?>
{
    public async Task<AuditLogDto?> Handle(GetAuditLogByIdQuery request, CancellationToken cancellationToken)
    {
        var log = await repository.GetByIdAsync(request.Id, cancellationToken);
        return log is null ? null : AuditLogMapper.ToDto(log);
    }
}
