using System;
using CloudServices.Domain.Common;

namespace CloudServices.Domain.Entities;

public class NewsArticle : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public DateTime? PublishedAt { get; set; }
    public Guid? AuthorId { get; set; }

    // Navigation properties
    public virtual AppUser? Author { get; set; }
}
