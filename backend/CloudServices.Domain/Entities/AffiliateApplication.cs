using CloudServices.Domain.Common;
using CloudServices.Domain.Enums;

namespace CloudServices.Domain.Entities;

public class AffiliateApplication : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? WebsiteUrl { get; set; }
    public string? Motivation { get; set; }
    public AffiliateStatus Status { get; set; } = AffiliateStatus.New;
}
