namespace CloudServices.Domain.Entities;

public class Testimonial
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string ClientName { get; set; } = string.Empty;
    public string? Company { get; set; }
    public string? Position { get; set; }
    public string Content { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? CompanyLogoUrl { get; set; }
    public int Rating { get; set; } = 5; // Đánh giá 1 - 5 sao
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}