using CloudServices.Domain.Entities;
using CloudServices.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CloudServices.Infrastructure.Configurations;

public class AffiliateApplicationConfiguration : IEntityTypeConfiguration<AffiliateApplication>
{
    public void Configure(EntityTypeBuilder<AffiliateApplication> builder)
    {
        builder.ToTable("AffiliateApplications");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.FullName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(a => a.Email)
            .HasColumnType("varchar(100)")
            .IsRequired();

        builder.HasIndex(a => a.Email)
            .IsUnique();

        builder.Property(a => a.Phone)
            .HasColumnType("varchar(20)")
            .IsRequired();

        builder.Property(a => a.WebsiteUrl)
            .HasColumnType("varchar(255)");

        builder.Property(a => a.Motivation)
            .HasColumnType("nvarchar(max)");

        builder.Property(a => a.Status)
            .HasConversion<int>()
            .HasDefaultValue(AffiliateStatus.New)
            .IsRequired();
    }
}
