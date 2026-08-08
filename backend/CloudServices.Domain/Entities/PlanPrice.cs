using System;
using System.Collections.Generic;
using CloudServices.Domain.Common;

namespace CloudServices.Domain.Entities;

public class PlanPrice : BaseEntity
{
    public Guid PlanId { get; set; }
    public string BillingCycle { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public Guid? PromotionId { get; set; }

    // Navigation properties
    public virtual ServicePlan Plan { get; set; } = null!;
    public virtual Promotion? Promotion { get; set; }
    public virtual ICollection<OrderRequest> OrderRequests { get; set; } = new List<OrderRequest>();
}
