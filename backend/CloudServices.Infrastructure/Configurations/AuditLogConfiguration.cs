using CloudServices.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CloudServices.Infrastructure.Configurations;

public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.ToTable("AuditLogs");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.Username)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(a => a.UserRole)
            .HasMaxLength(50);

        builder.Property(a => a.Action)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(a => a.EntityName)
            .HasMaxLength(150);

        builder.Property(a => a.EntityId)
            .HasMaxLength(100);

        builder.Property(a => a.OldValues)
            .HasColumnType("nvarchar(max)");

        builder.Property(a => a.NewValues)
            .HasColumnType("nvarchar(max)");

        builder.Property(a => a.HttpMethod)
            .HasMaxLength(10)
            .IsRequired();

        builder.Property(a => a.Path)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(a => a.StatusCode)
            .IsRequired();

        builder.Property(a => a.IsSuccess)
            .IsRequired();

        builder.Property(a => a.ExecutionDurationMs)
            .IsRequired();

        builder.Property(a => a.IpAddress)
            .HasMaxLength(100);

        builder.Property(a => a.UserAgent)
            .HasMaxLength(500);

        builder.Property(a => a.Payload)
            .HasColumnType("nvarchar(max)");

        builder.Property(a => a.ErrorMessage)
            .HasColumnType("nvarchar(max)");

        builder.Property(a => a.Category)
            .HasMaxLength(50)
            .HasDefaultValue("Hệ Thống")
            .IsRequired();

        builder.Property(a => a.Timestamp)
            .IsRequired();

        builder.Property(a => a.CreatedAt)
            .IsRequired();

        builder.HasOne(a => a.User)
            .WithMany(u => u.AuditLogs)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        // Indices for high performance querying
        builder.HasIndex(a => a.UserId);
        builder.HasIndex(a => a.EntityName);
        builder.HasIndex(a => a.EntityId);
        builder.HasIndex(a => a.CreatedAt);
        builder.HasIndex(a => a.Timestamp);
        builder.HasIndex(a => a.Action);
        builder.HasIndex(a => a.Category);
        builder.HasIndex(a => a.Username);
        builder.HasIndex(a => a.Path);
    }
}
