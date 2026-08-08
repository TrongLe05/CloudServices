using CloudServices.Domain.Entities;
using CloudServices.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CloudServices.Infrastructure.Configurations;

public class OrderRequestConfiguration : IEntityTypeConfiguration<OrderRequest>
{
    public void Configure(EntityTypeBuilder<OrderRequest> builder)
    {
        builder.ToTable("OrderRequests");

        builder.HasKey(o => o.Id);

        builder.Property(o => o.CustomerName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(o => o.CustomerEmail)
            .HasColumnType("varchar(100)")
            .IsRequired();

        builder.Property(o => o.CustomerPhone)
            .HasColumnType("varchar(20)")
            .IsRequired();

        builder.Property(o => o.CompanyName)
            .HasMaxLength(150);

        builder.Property(o => o.Notes)
            .HasMaxLength(500);

        builder.Property(o => o.Status)
            .HasConversion<int>()
            .HasDefaultValue(OrderStatus.New)
            .IsRequired();

        builder.HasOne(o => o.PlanPrice)
            .WithMany(p => p.OrderRequests)
            .HasForeignKey(o => o.PlanPriceId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
