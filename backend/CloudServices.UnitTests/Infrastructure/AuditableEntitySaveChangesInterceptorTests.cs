using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Domain.Entities;
using CloudServices.Domain.Enums;
using CloudServices.Infrastructure.Data;
using CloudServices.Infrastructure.Interceptors;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace CloudServices.UnitTests.Infrastructure;

public class AuditableEntitySaveChangesInterceptorTests
{
    private readonly Mock<ICurrentUserService> _currentUserServiceMock;
    private readonly Guid _testUserId = Guid.NewGuid();
    private readonly string _testUsername = "testadmin@cloudservices.com";
    private readonly string _testIpAddress = "192.168.1.100";
    private readonly string _testUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";

    public AuditableEntitySaveChangesInterceptorTests()
    {
        _currentUserServiceMock = new Mock<ICurrentUserService>();
        _currentUserServiceMock.Setup(s => s.UserId).Returns(_testUserId);
        _currentUserServiceMock.Setup(s => s.Username).Returns(_testUsername);
        _currentUserServiceMock.Setup(s => s.UserRole).Returns("Admin");
        _currentUserServiceMock.Setup(s => s.IpAddress).Returns(_testIpAddress);
        _currentUserServiceMock.Setup(s => s.UserAgent).Returns(_testUserAgent);
    }

    private ApplicationDbContext CreateDbContext(string dbName)
    {
        var interceptor = new AuditableEntitySaveChangesInterceptor(_currentUserServiceMock.Object);

        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .AddInterceptors(interceptor)
            .Options;

        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task SaveChangesAsync_WhenEntityCreated_ShouldCreateAuditLogWithActionCreate()
    {
        // Arrange
        var dbName = Guid.NewGuid().ToString();
        using var context = CreateDbContext(dbName);

        var category = new ServiceCategory
        {
            Id = Guid.NewGuid(),
            Name = "Cloud Storage",
            Slug = "cloud-storage",
            Description = "Dịch vụ lưu trữ đám mây"
        };

        // Act
        context.ServiceCategories.Add(category);
        await context.SaveChangesAsync();

        // Assert
        var auditLog = await context.AuditLogs.FirstOrDefaultAsync(x => x.EntityName == nameof(ServiceCategory) && x.EntityId == category.Id.ToString());
        Assert.NotNull(auditLog);
        Assert.Equal(AuditActions.Create, auditLog.Action);
        Assert.Equal(_testUserId, auditLog.UserId);
        Assert.Equal(_testUsername, auditLog.Username);
        Assert.Equal(_testIpAddress, auditLog.IpAddress);
        Assert.Equal(_testUserAgent, auditLog.UserAgent);
        Assert.Null(auditLog.OldValues);
        Assert.NotNull(auditLog.NewValues);

        var newValues = JsonDocument.Parse(auditLog.NewValues).RootElement;
        Assert.Equal("Cloud Storage", newValues.GetProperty("Name").GetString());
        Assert.Equal("cloud-storage", newValues.GetProperty("Slug").GetString());
    }

    [Fact]
    public async Task SaveChangesAsync_WhenEntityUpdated_ShouldCreateAuditLogWithActionUpdateAndOnlyChangedProperties()
    {
        // Arrange
        var dbName = Guid.NewGuid().ToString();
        using var context = CreateDbContext(dbName);

        var category = new ServiceCategory
        {
            Id = Guid.NewGuid(),
            Name = "Original Name",
            Slug = "original-slug",
            Description = "Original Description"
        };
        context.ServiceCategories.Add(category);
        await context.SaveChangesAsync();

        // Act - Update entity
        category.Name = "Updated Name";
        await context.SaveChangesAsync();

        // Assert
        var auditLogs = await context.AuditLogs
            .Where(x => x.EntityName == nameof(ServiceCategory) && x.EntityId == category.Id.ToString())
            .OrderBy(x => x.CreatedAt)
            .ToListAsync();

        Assert.Equal(2, auditLogs.Count);

        var updateLog = auditLogs.Last();
        Assert.Equal(AuditActions.Update, updateLog.Action);
        Assert.NotNull(updateLog.OldValues);
        Assert.NotNull(updateLog.NewValues);

        var oldValues = JsonDocument.Parse(updateLog.OldValues).RootElement;
        var newValues = JsonDocument.Parse(updateLog.NewValues).RootElement;

        Assert.Equal("Original Name", oldValues.GetProperty("Name").GetString());
        Assert.Equal("Updated Name", newValues.GetProperty("Name").GetString());

        // Description was unchanged, so it should not be present in oldValues/newValues
        Assert.False(oldValues.TryGetProperty("Description", out _));
    }

    [Fact]
    public async Task SaveChangesAsync_WhenEntityDeleted_ShouldCreateAuditLogWithActionDelete()
    {
        // Arrange
        var dbName = Guid.NewGuid().ToString();
        using var context = CreateDbContext(dbName);

        var category = new ServiceCategory
        {
            Id = Guid.NewGuid(),
            Name = "To Be Deleted",
            Slug = "to-be-deleted",
            Description = "Will be deleted"
        };
        context.ServiceCategories.Add(category);
        await context.SaveChangesAsync();

        // Act - Delete entity
        context.ServiceCategories.Remove(category);
        await context.SaveChangesAsync();

        // Assert
        var deleteLog = await context.AuditLogs
            .Where(x => x.EntityName == nameof(ServiceCategory) && x.EntityId == category.Id.ToString() && x.Action == AuditActions.Delete)
            .FirstOrDefaultAsync();

        Assert.NotNull(deleteLog);
        Assert.Equal(AuditActions.Delete, deleteLog.Action);
        Assert.NotNull(deleteLog.OldValues);
    }

    [Fact]
    public async Task SaveChangesAsync_WhenSensitivePropertiesExist_ShouldNeverIncludeInAuditLog()
    {
        // Arrange
        var dbName = Guid.NewGuid().ToString();
        using var context = CreateDbContext(dbName);

        var role = new Role { Id = Guid.NewGuid(), Name = "Customer", Description = "Customer Role" };
        context.Roles.Add(role);

        var user = new AppUser
        {
            Id = Guid.NewGuid(),
            Username = "user1",
            PasswordHash = "$2a$11$SECRET_HASH_THAT_SHOULD_NEVER_BE_AUDITED",
            RefreshToken = "SECRET_REFRESH_TOKEN_12345",
            FullName = "Nguyen Van A",
            Email = "user1@example.com",
            RoleId = role.Id
        };

        // Act
        context.AppUsers.Add(user);
        await context.SaveChangesAsync();

        // Assert
        var auditLog = await context.AuditLogs.FirstOrDefaultAsync(x => x.EntityName == nameof(AppUser) && x.EntityId == user.Id.ToString());
        Assert.NotNull(auditLog);
        Assert.NotNull(auditLog.NewValues);

        var newValues = JsonDocument.Parse(auditLog.NewValues).RootElement;
        Assert.Equal("user1", newValues.GetProperty("Username").GetString());
        Assert.Equal("Nguyen Van A", newValues.GetProperty("FullName").GetString());

        // Sensitive properties MUST NOT be present
        Assert.False(newValues.TryGetProperty("PasswordHash", out _));
        Assert.False(newValues.TryGetProperty("RefreshToken", out _));
        Assert.DoesNotContain("SECRET_HASH", auditLog.NewValues);
        Assert.DoesNotContain("SECRET_REFRESH_TOKEN", auditLog.NewValues);
    }

    [Fact]
    public async Task SaveChangesAsync_WhenUnauthenticated_ShouldSetUserIdNullAndUsernameAnonymous()
    {
        // Arrange
        var unauthenticatedUserService = new Mock<ICurrentUserService>();
        unauthenticatedUserService.Setup(s => s.UserId).Returns((Guid?)null);
        unauthenticatedUserService.Setup(s => s.Username).Returns((string?)null);
        unauthenticatedUserService.Setup(s => s.UserRole).Returns((string?)null);
        unauthenticatedUserService.Setup(s => s.IpAddress).Returns("127.0.0.1");
        unauthenticatedUserService.Setup(s => s.UserAgent).Returns("PostmanRuntime/7.36.0");

        var interceptor = new AuditableEntitySaveChangesInterceptor(unauthenticatedUserService.Object);
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .AddInterceptors(interceptor)
            .Options;

        using var context = new ApplicationDbContext(options);

        var category = new ServiceCategory
        {
            Id = Guid.NewGuid(),
            Name = "Public Category",
            Slug = "public-category",
            Description = "Created anonymously"
        };

        // Act
        context.ServiceCategories.Add(category);
        await context.SaveChangesAsync();

        // Assert
        var auditLog = await context.AuditLogs.FirstOrDefaultAsync(x => x.EntityName == nameof(ServiceCategory) && x.EntityId == category.Id.ToString());
        Assert.NotNull(auditLog);
        Assert.Null(auditLog.UserId);
        Assert.Equal("Anonymous", auditLog.Username);
        Assert.Equal("127.0.0.1", auditLog.IpAddress);
        Assert.Equal("PostmanRuntime/7.36.0", auditLog.UserAgent);
    }
}
