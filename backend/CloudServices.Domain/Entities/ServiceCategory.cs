using CloudServices.Domain.Common;

namespace CloudServices.Domain.Entities;

public class ServiceCategory : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }

    // Navigation properties
    public virtual ICollection<ServicePlan> ServicePlans { get; set; } = new List<ServicePlan>();
}
