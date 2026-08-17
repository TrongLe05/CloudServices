namespace CloudServices.Application.Features.Testimonials.DTOs;

public class TestimonialDto
{
    public Guid Id { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string? Company { get; set; }
    public string? Position { get; set; }
    public string Content { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? CompanyLogoUrl { get; set; }
    public int Rating { get; set; }
    public bool IsActive { get; set; }
    public int DisplayOrder { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateTestimonialDto
{
    public string ClientName { get; set; } = string.Empty;
    public string? Company { get; set; }
    public string? Position { get; set; }
    public string Content { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? CompanyLogoUrl { get; set; }
    public int Rating { get; set; } = 5;
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; } = 0;
}

public class UpdateTestimonialDto : CreateTestimonialDto
{
}