using CloudServices.Domain.Common;

namespace CloudServices.Domain.Entities;

public class Role : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    // Navigation properties
    public virtual ICollection<AppUser> AppUsers { get; set; } = new List<AppUser>();
}
