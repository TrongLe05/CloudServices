using System;
using CloudServices.Domain.Common;

namespace CloudServices.Domain.Entities;

public class AuditLog : BaseEntity
{
    public Guid? UserId { get; set; }
    public string Username { get; set; } = "Anonymous";
    public string? UserRole { get; set; }
    public string Action { get; set; } = string.Empty;
    public string? EntityName { get; set; }
    public string? EntityId { get; set; }
    public string? OldValues { get; set; }
    public string? NewValues { get; set; }
    public string HttpMethod { get; set; } = "GET";
    public string Path { get; set; } = string.Empty;
    public int StatusCode { get; set; } = 200;
    public bool IsSuccess { get; set; } = true;
    public long ExecutionDurationMs { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? Payload { get; set; }
    public string? ErrorMessage { get; set; }
    public string Category { get; set; } = "Hệ Thống";
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    // Navigation property
    public virtual AppUser? User { get; set; }
}
