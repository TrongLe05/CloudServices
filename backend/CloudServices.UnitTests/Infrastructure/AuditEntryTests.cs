using CloudServices.Domain.Entities;
using CloudServices.Domain.Enums;
using CloudServices.Infrastructure.Data;
using CloudServices.Infrastructure.Interceptors;
using Microsoft.EntityFrameworkCore;
using System;
using Xunit;

namespace CloudServices.UnitTests.Infrastructure;

public class AuditEntryTests
{
    private ApplicationDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }

    [Theory]
    [InlineData("Password", true)]
    [InlineData("passwordhash", true)]
    [InlineData("RefreshToken", true)]
    [InlineData("SecretKey", true)]
    [InlineData("ApiKey", true)]
    [InlineData("Username", false)]
    [InlineData("Email", false)]
    [InlineData("CustomerName", false)]
    public void IsSensitive_PropertyNames_CorrectlyIdentifiesSensitiveFields(string propertyName, bool expectedSensitive)
    {
        // Act
        var result = AuditEntry.IsSensitive(null, propertyName);

        // Assert
        Assert.Equal(expectedSensitive, result);
    }

    [Fact]
    public void ShouldIgnoreEntity_AuditLogType_ReturnsTrue()
    {
        // Act
        var result = AuditEntry.ShouldIgnoreEntity(typeof(AuditLog));

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void ShouldIgnoreEntity_AppUserType_ReturnsFalse()
    {
        // Act
        var result = AuditEntry.ShouldIgnoreEntity(typeof(AppUser));

        // Assert
        Assert.False(result);
    }

    [Theory]
    [InlineData(typeof(AppUser), "Người Dùng & Quyền")]
    [InlineData(typeof(Role), "Người Dùng & Quyền")]
    [InlineData(typeof(ServicePlan), "Gói Dịch Vụ & Giá")]
    [InlineData(typeof(PlanPrice), "Gói Dịch Vụ & Giá")]
    [InlineData(typeof(ServiceCategory), "Gói Dịch Vụ & Giá")]
    [InlineData(typeof(Promotion), "Gói Dịch Vụ & Giá")]
    [InlineData(typeof(OrderRequest), "Đơn Hàng & CTV")]
    [InlineData(typeof(AffiliateApplication), "Đơn Hàng & CTV")]
    [InlineData(typeof(NewsArticle), "Nội Dung & Tin Tức")]
    [InlineData(typeof(Testimonial), "Nội Dung & Tin Tức")]
    public void ToAuditLog_VariousEntities_ResolvesCorrectCategoryAndMethod(Type entityType, string expectedCategory)
    {
        // Arrange
        using var context = CreateDbContext();
        var entity = Activator.CreateInstance(entityType)!;
        var entry = context.Entry(entity);

        var auditEntry = new AuditEntry(entry)
        {
            EntityName = entityType.Name,
            Action = AuditActions.Create,
            UserId = Guid.NewGuid(),
            Username = "admin_tester",
            UserRole = "Admin",
            IpAddress = "127.0.0.1"
        };
        auditEntry.KeyValues.Add("Id", Guid.NewGuid());
        auditEntry.NewValues.Add("Name", "Sample Name");

        // Act
        var auditLog = auditEntry.ToAuditLog();

        // Assert
        Assert.NotNull(auditLog);
        Assert.Equal(expectedCategory, auditLog.Category);
        Assert.Equal("POST", auditLog.HttpMethod);
        Assert.Equal(auditEntry.Username, auditLog.Username);
        Assert.Equal("127.0.0.1", auditLog.IpAddress);
    }

    [Theory]
    [InlineData(AuditActions.Create, "POST")]
    [InlineData(AuditActions.Update, "PUT")]
    [InlineData(AuditActions.Delete, "DELETE")]
    [InlineData("UNKNOWN_ACTION", "SYSTEM")]
    public void ToAuditLog_VariousActions_ResolvesCorrectHttpMethod(string action, string expectedHttpMethod)
    {
        // Arrange
        using var context = CreateDbContext();
        var entity = new ServiceCategory();
        var entry = context.Entry(entity);

        var auditEntry = new AuditEntry(entry)
        {
            EntityName = nameof(ServiceCategory),
            Action = action,
            Username = "system_user"
        };

        // Act
        var auditLog = auditEntry.ToAuditLog();

        // Assert
        Assert.Equal(expectedHttpMethod, auditLog.HttpMethod);
    }
}
