using CloudServices.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CloudServices.Infrastructure.Configurations;

public class ServicePlanConfiguration : IEntityTypeConfiguration<ServicePlan>
{
    public void Configure(EntityTypeBuilder<ServicePlan> builder)
    {
        builder.ToTable("ServicePlans");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.CategoryId)
            .IsRequired();

        builder.Property(p => p.Name)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(p => p.Description)
            .HasColumnType("nvarchar(max)");

        builder.Property(p => p.Cpu)
            .HasMaxLength(50);

        builder.Property(p => p.Ram)
            .HasMaxLength(50);

        builder.Property(p => p.Storage)
            .HasMaxLength(50);

        builder.Property(p => p.Bandwidth)
            .HasMaxLength(50);

        builder.Property(p => p.QrCodeUrl)
            .HasColumnType("varchar(255)");
    }
}
