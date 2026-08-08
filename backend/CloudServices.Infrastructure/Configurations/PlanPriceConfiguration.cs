using CloudServices.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CloudServices.Infrastructure.Configurations;

public class PlanPriceConfiguration : IEntityTypeConfiguration<PlanPrice>
{
    public void Configure(EntityTypeBuilder<PlanPrice> builder)
    {
        builder.ToTable("PlanPrices");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.BillingCycle)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(p => p.Price)
            .HasPrecision(18, 2)
            .IsRequired();

        builder.HasOne(p => p.Plan)
            .WithMany(pl => pl.PlanPrices)
            .HasForeignKey(p => p.PlanId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(p => p.Promotion)
            .WithMany(pr => pr.PlanPrices)
            .HasForeignKey(p => p.PromotionId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
