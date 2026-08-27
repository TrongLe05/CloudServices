using CloudServices.Domain.Entities;
using CloudServices.Infrastructure.Data;
using CloudServices.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace CloudServices.UnitTests.Infrastructure;

public class AuditLogRepositoryTests
{
    private ApplicationDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task GetByIdAsync_WhenExists_ReturnsAuditLog()
    {
        // Arrange
        using var context = CreateDbContext();
        var id = Guid.NewGuid();
        var log = new AuditLog
        {
            Id = id,
            Action = "CREATE",
            EntityName = "ServicePlan",
            Username = "admin",
            Timestamp = DateTime.UtcNow
        };
        context.AuditLogs.Add(log);
        await context.SaveChangesAsync();

        var repo = new AuditLogRepository(context);

        // Act
        var result = await repo.GetByIdAsync(id, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(id, result.Id);
        Assert.Equal("CREATE", result.Action);
    }

    [Fact]
    public async Task GetPagedAsync_WithFilters_ReturnsFilteredItemsAndTotalCount()
    {
        // Arrange
        using var context = CreateDbContext();
        var log1 = new AuditLog
        {
            Id = Guid.NewGuid(),
            Category = "Người Dùng & Quyền",
            Action = "CREATE",
            Username = "john_doe",
            HttpMethod = "POST",
            StatusCode = 200,
            IsSuccess = true,
            Timestamp = DateTime.UtcNow.AddMinutes(-10)
        };
        var log2 = new AuditLog
        {
            Id = Guid.NewGuid(),
            Category = "Gói Dịch Vụ & Giá",
            Action = "UPDATE",
            Username = "admin_master",
            HttpMethod = "PUT",
            StatusCode = 500,
            IsSuccess = false,
            Timestamp = DateTime.UtcNow.AddMinutes(-5)
        };

        context.AuditLogs.AddRange(log1, log2);
        await context.SaveChangesAsync();

        var repo = new AuditLogRepository(context);

        // Act 1: Filter by category
        var (items1, count1) = await repo.GetPagedAsync(
            category: "Người Dùng & Quyền",
            search: null,
            action: null,
            httpMethod: null,
            statusCode: null,
            isSuccess: null,
            username: null,
            fromDate: null,
            toDate: null,
            page: 1,
            pageSize: 10,
            CancellationToken.None
        );

        // Act 2: Search keyword
        var (items2, count2) = await repo.GetPagedAsync(
            category: null,
            search: "admin_master",
            action: null,
            httpMethod: null,
            statusCode: null,
            isSuccess: null,
            username: null,
            fromDate: null,
            toDate: null,
            page: 1,
            pageSize: 10,
            CancellationToken.None
        );

        // Assert
        Assert.Equal(1, count1);
        Assert.Equal("john_doe", items1[0].Username);

        Assert.Equal(1, count2);
        Assert.Equal("admin_master", items2[0].Username);
    }
}
