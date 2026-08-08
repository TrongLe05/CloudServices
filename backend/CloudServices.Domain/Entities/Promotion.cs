using CloudServices.Domain.Common;

namespace CloudServices.Domain.Entities;

public class Promotion : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public int DiscountPercentage { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    // Navigation properties
    public virtual ICollection<PlanPrice> PlanPrices { get; set; } = new List<PlanPrice>();
}
