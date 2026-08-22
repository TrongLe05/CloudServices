using System;
using System.Collections.Generic;

namespace CloudServices.Application.Features.AuditLogs.DTOs;

public sealed record AuditLogDto(
    Guid Id,
    Guid? UserId,
    string Username,
    string? UserRole,
    string Action,
    string? EntityName,
    string? EntityId,
    string? OldValues,
    string? NewValues,
    string HttpMethod,
    string Path,
    int StatusCode,
    bool IsSuccess,
    long ExecutionDurationMs,
    string? IpAddress,
    string? UserAgent,
    string? Payload,
    string? ErrorMessage,
    string Category,
    DateTime Timestamp,
    DateTime CreatedAt
);

public sealed record AuditLogPage(
    IReadOnlyList<AuditLogDto> Items,
    int Page,
    int PageSize,
    int TotalCount
);
