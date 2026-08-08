using CloudServices.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CloudServices.Infrastructure.Configurations;

public class NewsArticleConfiguration : IEntityTypeConfiguration<NewsArticle>
{
    public void Configure(EntityTypeBuilder<NewsArticle> builder)
    {
        builder.ToTable("NewsArticles");

        builder.HasKey(n => n.Id);

        builder.Property(n => n.Title)
            .HasMaxLength(250)
            .IsRequired();

        builder.Property(n => n.Slug)
            .HasColumnType("varchar(250)")
            .IsRequired();

        builder.HasIndex(n => n.Slug)
            .IsUnique();

        builder.Property(n => n.Content)
            .HasColumnType("nvarchar(max)")
            .IsRequired();

        builder.Property(n => n.ThumbnailUrl)
            .HasColumnType("varchar(500)");

        builder.Property(n => n.PublishedAt);

        builder.HasOne(n => n.Author)
            .WithMany(u => u.NewsArticles)
            .HasForeignKey(n => n.AuthorId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
