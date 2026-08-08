using System;
using System.Collections.Generic;
using CloudServices.Domain.Common;

namespace CloudServices.Domain.Entities;

public class ServicePlan : BaseEntity
{
    public Guid CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Cpu { get; set; }
    public string? Ram { get; set; }
    public string? Storage { get; set; }
    public string? Bandwidth { get; set; }
    public string? QrCodeUrl { get; set; }

    // Navigation properties
    public virtual ServiceCategory Category { get; set; } = null!;
    public virtual ICollection<PlanPrice> PlanPrices { get; set; } = new List<PlanPrice>();
}
