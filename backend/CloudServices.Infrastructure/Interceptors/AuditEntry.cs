using System.Reflection;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;
using CloudServices.Domain.Common;
using CloudServices.Domain.Entities;
using CloudServices.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace CloudServices.Infrastructure.Interceptors;

public sealed class AuditEntry
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
        WriteIndented = false,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        ReferenceHandler = ReferenceHandler.IgnoreCycles
    };

    private static readonly HashSet<string> SensitivePropertyNames = new(StringComparer.OrdinalIgnoreCase)
    {
        "Password",
        "PasswordHash",
        "ConfirmPassword",
        "RefreshToken",
        "AccessToken",
        "Token",
        "Secret",
        "SecretKey",
        "ChecksumKey",
        "ApiKey",
        "SecurityStamp",
        "ConcurrencyStamp"
    };

    public EntityEntry Entry { get; }
    public string EntityName { get; set; } = string.Empty;
    public string Action { get; set; } = AuditActions.Create;
    public Guid? UserId { get; set; }
    public string Username { get; set; } = "Anonymous";
    public string? UserRole { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public Dictionary<string, object?> KeyValues { get; } = new();
    public Dictionary<string, object?> OldValues { get; } = new();
    public Dictionary<string, object?> NewValues { get; } = new();
    public List<PropertyEntry> TemporaryProperties { get; } = new();
    public List<string> ChangedColumns { get; } = new();

    public bool HasTemporaryProperties => TemporaryProperties.Count > 0;

    public AuditEntry(EntityEntry entry)
    {
        Entry = entry;
    }

    public static bool IsSensitive(PropertyInfo? propertyInfo, string propertyName)
    {
        if (SensitivePropertyNames.Contains(propertyName))
            return true;

        if (propertyInfo != null && propertyInfo.GetCustomAttribute<SensitiveAuditDataAttribute>() != null)
            return true;

        return false;
    }

    public static bool ShouldIgnoreEntity(Type entityType)
    {
        if (entityType == typeof(AuditLog))
            return true;

        if (entityType.GetCustomAttribute<IgnoreAuditAttribute>() != null)
            return true;

        return false;
    }

    public AuditLog ToAuditLog()
    {
        var primaryKey = KeyValues.Count > 0
            ? (KeyValues.Count == 1 ? KeyValues.Values.First()?.ToString() : JsonSerializer.Serialize(KeyValues, JsonOptions))
            : null;

        var category = ResolveEntityCategory(EntityName);

        var auditLog = new AuditLog
        {
            Id = Guid.NewGuid(),
            UserId = UserId,
            Username = string.IsNullOrWhiteSpace(Username) ? "Anonymous" : Username,
            UserRole = UserRole,
            Action = Action,
            EntityName = EntityName,
            EntityId = primaryKey,
            OldValues = OldValues.Count == 0 ? null : JsonSerializer.Serialize(OldValues, JsonOptions),
            NewValues = NewValues.Count == 0 ? null : JsonSerializer.Serialize(NewValues, JsonOptions),
            IpAddress = IpAddress,
            UserAgent = UserAgent,
            Category = category,
            HttpMethod = ResolveActionHttpMethod(Action),
            Path = $"[Entity] {EntityName}",
            StatusCode = 200,
            IsSuccess = true,
            CreatedAt = DateTime.UtcNow,
            Timestamp = DateTime.UtcNow
        };

        return auditLog;
    }

    private static string ResolveActionHttpMethod(string action) => action switch
    {
        AuditActions.Create => "POST",
        AuditActions.Update => "PUT",
        AuditActions.Delete => "DELETE",
        _ => "SYSTEM"
    };

    private static string ResolveEntityCategory(string entityName) => entityName switch
    {
        nameof(AppUser) or nameof(Role) => "Người Dùng & Quyền",
        nameof(ServicePlan) or nameof(PlanPrice) or nameof(ServiceCategory) or nameof(Promotion) => "Gói Dịch Vụ & Giá",
        nameof(OrderRequest) or nameof(AffiliateApplication) => "Đơn Hàng & CTV",
        nameof(NewsArticle) or nameof(Testimonial) => "Nội Dung & Tin Tức",
        _ => "Dữ Liệu Hệ Thống"
    };
}
