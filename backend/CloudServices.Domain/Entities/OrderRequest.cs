using System;
using CloudServices.Domain.Common;
using CloudServices.Domain.Enums;

namespace CloudServices.Domain.Entities;

public class OrderRequest : BaseEntity
{
    public Guid PlanPriceId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string? CompanyName { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.New;
    public string? Notes { get; set; }

    // Navigation properties
    public virtual PlanPrice PlanPrice { get; set; } = null!;
}
