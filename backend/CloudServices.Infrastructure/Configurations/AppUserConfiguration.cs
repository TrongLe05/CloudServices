using CloudServices.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CloudServices.Infrastructure.Configurations;

public class AppUserConfiguration : IEntityTypeConfiguration<AppUser>
{
    public void Configure(EntityTypeBuilder<AppUser> builder)
    {
        builder.ToTable("AppUsers");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.Username)
            .HasColumnType("varchar(50)")
            .IsRequired();

        builder.HasIndex(u => u.Username)
            .IsUnique();

        builder.Property(u => u.PasswordHash)
            .HasColumnType("varchar(255)")
            .IsRequired();

        builder.Property(u => u.FullName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(u => u.Email)
            .HasColumnType("varchar(100)")
            .IsRequired();

        builder.HasIndex(u => u.Email)
            .IsUnique();

        builder.Property(u => u.RefreshToken)
            .HasColumnType("varchar(255)");

        builder.Property(u => u.RefreshTokenExpiryTime);

        builder.Property(u => u.PreviousRefreshToken)
            .HasColumnType("varchar(255)");

        builder.Property(u => u.PreviousRefreshTokenExpiryTime);
    }
}
