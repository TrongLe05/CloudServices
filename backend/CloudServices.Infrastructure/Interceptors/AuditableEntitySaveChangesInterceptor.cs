using CloudServices.Application.Common.Interfaces;
using CloudServices.Domain.Common;
using CloudServices.Domain.Entities;
using CloudServices.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace CloudServices.Infrastructure.Interceptors;

public sealed class AuditableEntitySaveChangesInterceptor(
    ICurrentUserService currentUserService
) : SaveChangesInterceptor
{
    private List<AuditEntry>? _auditEntries;

    public override InterceptionResult<int> SavingChanges(
        DbContextEventData eventData,
        InterceptionResult<int> result)
    {
        if (eventData.Context is not null)
        {
            UpdateBaseEntityAuditFields(eventData.Context);
            _auditEntries = OnBeforeSaveChanges(eventData.Context);
        }

        return base.SavingChanges(eventData, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        if (eventData.Context is not null)
        {
            UpdateBaseEntityAuditFields(eventData.Context);
            _auditEntries = OnBeforeSaveChanges(eventData.Context);
        }

        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    public override int SavedChanges(
        SaveChangesCompletedEventData eventData,
        int result)
    {
        if (eventData.Context is not null && _auditEntries != null && _auditEntries.Any(e => e.HasTemporaryProperties))
        {
            OnAfterSaveChanges(eventData.Context, _auditEntries);
        }

        _auditEntries = null;
        return base.SavedChanges(eventData, result);
    }

    public override async ValueTask<int> SavedChangesAsync(
        SaveChangesCompletedEventData eventData,
        int result,
        CancellationToken cancellationToken = default)
    {
        if (eventData.Context is not null && _auditEntries != null && _auditEntries.Any(e => e.HasTemporaryProperties))
        {
            await OnAfterSaveChangesAsync(eventData.Context, _auditEntries, cancellationToken);
        }

        _auditEntries = null;
        return await base.SavedChangesAsync(eventData, result, cancellationToken);
    }

    private static void UpdateBaseEntityAuditFields(DbContext context)
    {
        var entries = context.ChangeTracker.Entries<BaseEntity>();

        foreach (var entry in entries)
        {
            if (entry.Entity is AuditLog)
                continue;

            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = DateTime.UtcNow;
                entry.Entity.IsActive = true;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.LastModifiedAt = DateTime.UtcNow;
            }
            else if (entry.State == EntityState.Deleted)
            {
                // Soft delete handling
                entry.State = EntityState.Modified;
                entry.Entity.IsActive = false;
                entry.Entity.LastModifiedAt = DateTime.UtcNow;
            }
        }
    }

    private List<AuditEntry> OnBeforeSaveChanges(DbContext context)
    {
        context.ChangeTracker.DetectChanges();
        var auditEntries = new List<AuditEntry>();

        var userId = currentUserService.UserId;
        var username = currentUserService.Username ?? "Anonymous";
        var userRole = currentUserService.UserRole;
        var ipAddress = currentUserService.IpAddress;
        var userAgent = currentUserService.UserAgent;

        foreach (var entry in context.ChangeTracker.Entries())
        {
            var entityType = entry.Entity.GetType();

            if (AuditEntry.ShouldIgnoreEntity(entityType))
                continue;

            if (entry.State is EntityState.Detached or EntityState.Unchanged)
                continue;

            var auditEntry = new AuditEntry(entry)
            {
                EntityName = entityType.Name,
                UserId = userId,
                Username = username,
                UserRole = userRole,
                IpAddress = ipAddress,
                UserAgent = userAgent
            };

            foreach (var property in entry.Properties)
            {
                var propertyName = property.Metadata.Name;
                var clrProperty = entityType.GetProperty(propertyName);

                if (AuditEntry.IsSensitive(clrProperty, propertyName))
                    continue;

                if (property.Metadata.IsPrimaryKey())
                {
                    if (property.IsTemporary)
                    {
                        auditEntry.TemporaryProperties.Add(property);
                    }
                    else
                    {
                        auditEntry.KeyValues[propertyName] = property.CurrentValue;
                    }
                    continue;
                }

                switch (entry.State)
                {
                    case EntityState.Added:
                        auditEntry.Action = AuditActions.Create;
                        auditEntry.NewValues[propertyName] = property.CurrentValue;
                        break;

                    case EntityState.Deleted:
                        auditEntry.Action = AuditActions.Delete;
                        auditEntry.OldValues[propertyName] = property.OriginalValue;
                        break;

                    case EntityState.Modified:
                        // Check if this entity was soft-deleted (IsActive changed from true to false)
                        if (propertyName == nameof(BaseEntity.IsActive) 
                            && Equals(property.OriginalValue, true) 
                            && Equals(property.CurrentValue, false))
                        {
                            auditEntry.Action = AuditActions.Delete;
                            auditEntry.OldValues[propertyName] = property.OriginalValue;
                            auditEntry.NewValues[propertyName] = property.CurrentValue;
                            auditEntry.ChangedColumns.Add(propertyName);
                        }
                        else if (property.IsModified)
                        {
                            if (!Equals(property.OriginalValue, property.CurrentValue))
                            {
                                auditEntry.Action = auditEntry.Action == AuditActions.Delete ? AuditActions.Delete : AuditActions.Update;
                                auditEntry.OldValues[propertyName] = property.OriginalValue;
                                auditEntry.NewValues[propertyName] = property.CurrentValue;
                                auditEntry.ChangedColumns.Add(propertyName);
                            }
                        }
                        break;
                }
            }

            // Skip empty updates (where only technical properties like LastModifiedAt might have changed without business data)
            if (entry.State == EntityState.Modified 
                && auditEntry.Action == AuditActions.Update 
                && auditEntry.ChangedColumns.Count == 0)
            {
                continue;
            }

            auditEntries.Add(auditEntry);
        }

        // Add non-temporary audit logs to DbContext
        foreach (var auditEntry in auditEntries.Where(e => !e.HasTemporaryProperties))
        {
            context.Set<AuditLog>().Add(auditEntry.ToAuditLog());
        }

        return auditEntries;
    }

    private static void OnAfterSaveChanges(DbContext context, List<AuditEntry> auditEntries)
    {
        var logsToSave = new List<AuditLog>();

        foreach (var auditEntry in auditEntries.Where(e => e.HasTemporaryProperties))
        {
            foreach (var prop in auditEntry.TemporaryProperties)
            {
                if (prop.Metadata.IsPrimaryKey())
                {
                    auditEntry.KeyValues[prop.Metadata.Name] = prop.CurrentValue;
                }
                else
                {
                    auditEntry.NewValues[prop.Metadata.Name] = prop.CurrentValue;
                }
            }

            logsToSave.Add(auditEntry.ToAuditLog());
        }

        if (logsToSave.Count > 0)
        {
            context.Set<AuditLog>().AddRange(logsToSave);
            context.SaveChanges();
        }
    }

    private static async Task OnAfterSaveChangesAsync(
        DbContext context,
        List<AuditEntry> auditEntries,
        CancellationToken cancellationToken)
    {
        var logsToSave = new List<AuditLog>();

        foreach (var auditEntry in auditEntries.Where(e => e.HasTemporaryProperties))
        {
            foreach (var prop in auditEntry.TemporaryProperties)
            {
                if (prop.Metadata.IsPrimaryKey())
                {
                    auditEntry.KeyValues[prop.Metadata.Name] = prop.CurrentValue;
                }
                else
                {
                    auditEntry.NewValues[prop.Metadata.Name] = prop.CurrentValue;
                }
            }

            logsToSave.Add(auditEntry.ToAuditLog());
        }

        if (logsToSave.Count > 0)
        {
            context.Set<AuditLog>().AddRange(logsToSave);
            await context.SaveChangesAsync(cancellationToken);
        }
    }
}
