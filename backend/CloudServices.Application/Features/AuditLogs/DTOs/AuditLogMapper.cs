using CloudServices.Application.Features.AuditLogs.DTOs;
using CloudServices.Domain.Entities;

namespace CloudServices.Application.Features.AuditLogs.DTOs;

public static class AuditLogMapper
{
    public static AuditLogDto ToDto(AuditLog log) => new(
        log.Id,
        log.UserId,
        log.Username,
        log.UserRole,
        log.Action,
        log.EntityName,
        log.EntityId,
        log.OldValues,
        log.NewValues,
        log.HttpMethod,
        log.Path,
        log.StatusCode,
        log.IsSuccess,
        log.ExecutionDurationMs,
        log.IpAddress,
        log.UserAgent,
        log.Payload,
        log.ErrorMessage,
        log.Category,
        log.Timestamp,
        log.CreatedAt
    );
}
