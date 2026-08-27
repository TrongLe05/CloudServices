using CloudServices.Domain.Common;
using CloudServices.Domain.Entities;
using CloudServices.Domain.Enums;
using System;
using System.Collections.Generic;
using Xunit;

namespace CloudServices.UnitTests.Domain;

public class DomainEntityTests
{
    [Fact]
    public void BaseEntity_Initialization_SetsNewGuidAndUtcTimestamp()
    {
        // Act
        var user = new AppUser();

        // Assert
        Assert.NotEqual(Guid.Empty, user.Id);
        Assert.True(user.CreatedAt <= DateTime.UtcNow);
        Assert.Null(user.LastModifiedAt);
    }

    [Fact]
    public void OrderRequest_Defaults_HasCorrectInitialValues()
    {
        // Act
        var order = new OrderRequest
        {
            CustomerName = "Nguyen Van A",
            CustomerEmail = "a@cloud.vn",
            CustomerPhone = "0987654321"
        };

        // Assert
        Assert.Equal(OrderStatus.New, order.Status);
        Assert.Equal("Nguyen Van A", order.CustomerName);
        Assert.Equal("a@cloud.vn", order.CustomerEmail);
        Assert.Equal("0987654321", order.CustomerPhone);
        Assert.Null(order.CompanyName);
        Assert.Null(order.Notes);
    }

    [Fact]
    public void OrderRequest_StatusTransition_UpdatesProperly()
    {
        // Arrange
        var order = new OrderRequest();
        Assert.Equal(OrderStatus.New, order.Status);

        // Act & Assert
        order.Status = OrderStatus.Processing;
        Assert.Equal(OrderStatus.Processing, order.Status);

        order.Status = OrderStatus.Completed;
        Assert.Equal(OrderStatus.Completed, order.Status);

        order.Status = OrderStatus.Rejected;
        Assert.Equal(OrderStatus.Rejected, order.Status);
    }

    [Fact]
    public void Promotion_PropertiesAndDiscount_CalculatesCorrectly()
    {
        // Arrange
        var promo = new Promotion
        {
            Name = "Khuyen mai He 2026",
            DiscountPercentage = 25,
            StartDate = DateTime.UtcNow.AddDays(-1),
            EndDate = DateTime.UtcNow.AddDays(30)
        };

        decimal originalPrice = 2000000m;

        // Act
        bool isActive = promo.StartDate <= DateTime.UtcNow && promo.EndDate >= DateTime.UtcNow;
        decimal discountedPrice = isActive 
            ? originalPrice * (100 - promo.DiscountPercentage) / 100m 
            : originalPrice;

        // Assert
        Assert.True(isActive);
        Assert.Equal(1500000m, discountedPrice);
        Assert.Equal("Khuyen mai He 2026", promo.Name);
        Assert.Equal(25, promo.DiscountPercentage);
    }

    [Fact]
    public void AppUser_Properties_SetAndGetCorrectly()
    {
        // Arrange
        var role = new Role { Id = Guid.NewGuid(), Name = "Admin", Description = "Administrator" };
        var user = new AppUser
        {
            Username = "admin_user",
            Email = "admin@cloudservices.vn",
            FullName = "Admin Master",
            PasswordHash = "$2a$11$hashstring",
            RoleId = role.Id,
            Role = role
        };

        // Assert
        Assert.Equal("admin_user", user.Username);
        Assert.Equal("admin@cloudservices.vn", user.Email);
        Assert.Equal("Admin Master", user.FullName);
        Assert.Equal("Admin", user.Role?.Name);
        Assert.Equal(role.Id, user.RoleId);
    }

    [Fact]
    public void ServicePlan_WithPricesAndCategory_MaintainsRelationships()
    {
        // Arrange
        var category = new ServiceCategory
        {
            Id = Guid.NewGuid(),
            Name = "Cloud VPS",
            Slug = "cloud-vps"
        };

        var plan = new ServicePlan
        {
            Id = Guid.NewGuid(),
            CategoryId = category.Id,
            Category = category,
            Name = "VPS SSD 2GB",
            Cpu = "2 vCPU",
            Ram = "2 GB",
            Storage = "50 GB NVMe",
            Bandwidth = "Unlimited",
            PlanPrices = new List<PlanPrice>()
        };

        var priceMonthly = new PlanPrice
        {
            Id = Guid.NewGuid(),
            PlanId = plan.Id,
            Plan = plan,
            BillingCycle = "Monthly",
            Price = 250000m
        };

        var priceYearly = new PlanPrice
        {
            Id = Guid.NewGuid(),
            PlanId = plan.Id,
            Plan = plan,
            BillingCycle = "Yearly",
            Price = 2500000m
        };

        plan.PlanPrices.Add(priceMonthly);
        plan.PlanPrices.Add(priceYearly);

        // Assert
        Assert.Equal("Cloud VPS", plan.Category.Name);
        Assert.Equal(2, plan.PlanPrices.Count);
        Assert.Contains(plan.PlanPrices, p => p.Price == 250000m);
        Assert.Contains(plan.PlanPrices, p => p.Price == 2500000m);
        Assert.Equal("2 vCPU", plan.Cpu);
    }

    [Fact]
    public void AffiliateApplication_StatusTransitions_HandledCorrectly()
    {
        // Arrange
        var app = new AffiliateApplication
        {
            FullName = "Doi Tac A",
            Email = "doitac@gmail.com",
            Phone = "0912345678",
            Status = AffiliateStatus.New
        };

        // Assert
        Assert.Equal(AffiliateStatus.New, app.Status);

        app.Status = AffiliateStatus.Approved;
        Assert.Equal(AffiliateStatus.Approved, app.Status);

        app.Status = AffiliateStatus.Rejected;
        Assert.Equal(AffiliateStatus.Rejected, app.Status);
    }
}
