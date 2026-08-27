using CloudServices.Domain.Entities;
using CloudServices.Domain.Enums;
using CloudServices.Infrastructure.Services;
using System;
using System.Collections.Generic;
using Xunit;

namespace CloudServices.UnitTests.Infrastructure;

public class ExcelExporterTests
{
    [Fact]
    public void ExportOrderRequests_WithData_ReturnsNonEmptyByteArray()
    {
        // Arrange
        var exporter = new ExcelExporter();
        var orders = new List<OrderRequest>
        {
            new OrderRequest
            {
                Id = Guid.NewGuid(),
                CustomerName = "Nguyen Van A",
                CustomerEmail = "a@cloud.vn",
                CustomerPhone = "0912345678",
                CompanyName = "ABC Corp",
                Status = OrderStatus.New,
                CreatedAt = DateTime.UtcNow,
                Notes = "PayOS:123456",
                PlanPrice = new PlanPrice
                {
                    Plan = new ServicePlan { Name = "VPS SSD 1" }
                }
            }
        };

        // Act
        var result = exporter.ExportOrderRequests(orders);

        // Assert
        Assert.NotNull(result);
        Assert.True(result.Length > 0);
    }

    [Fact]
    public void ExportAffiliateApplications_WithData_ReturnsNonEmptyByteArray()
    {
        // Arrange
        var exporter = new ExcelExporter();
        var affiliates = new List<AffiliateApplication>
        {
            new AffiliateApplication
            {
                Id = Guid.NewGuid(),
                FullName = "Doi Tac 1",
                Email = "doitac@gmail.com",
                Phone = "0987654321",
                WebsiteUrl = "https://doitac.vn",
                Motivation = "Muon hop tac quang ba",
                Status = AffiliateStatus.Approved,
                CreatedAt = DateTime.UtcNow
            }
        };

        // Act
        var result = exporter.ExportAffiliateApplications(affiliates);

        // Assert
        Assert.NotNull(result);
        Assert.True(result.Length > 0);
    }
}
