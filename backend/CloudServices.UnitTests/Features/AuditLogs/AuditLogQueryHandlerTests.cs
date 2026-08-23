using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.AuditLogs.DTOs;
using CloudServices.Application.Features.AuditLogs.Queries.GetAuditLogById;
using CloudServices.Application.Features.AuditLogs.Queries.GetAuditLogs;
using CloudServices.Domain.Entities;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace CloudServices.UnitTests.Features.AuditLogs;

public class AuditLogQueryHandlerTests
{
    private readonly Mock<IAuditLogRepository> _repositoryMock;

    public AuditLogQueryHandlerTests()
    {
        _repositoryMock = new Mock<IAuditLogRepository>();
    }

    [Fact]
    public async Task GetAuditLogs_ValidQuery_ReturnsPagedResult()
    {
        // Arrange
        var handler = new GetAuditLogsQueryHandler(_repositoryMock.Object);
        var query = new GetAuditLogsQuery("Auth", "login", "POST", "POST", 200, true, "admin", null, null, 1, 10);

        var logItems = new List<AuditLog>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Category = "Auth",
                Action = "Login",
                HttpMethod = "POST",
                StatusCode = 200,
                IsSuccess = true,
                Username = "admin",
                IpAddress = "127.0.0.1",
                UserAgent = "Mozilla/5.0",
                Timestamp = DateTime.UtcNow
            }
        };

        _repositoryMock.Setup(repo => repo.GetPagedAsync(
            query.Category,
            query.Search,
            query.Action,
            query.HttpMethod,
            query.StatusCode,
            query.IsSuccess,
            query.Username,
            query.FromDate,
            query.ToDate,
            query.Page,
            query.PageSize,
            It.IsAny<CancellationToken>()))
            .ReturnsAsync((logItems, 1));

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.TotalCount);
        Assert.Equal(1, result.Page);
        Assert.Equal(10, result.PageSize);
        Assert.Single(result.Items);
        Assert.Equal("admin", result.Items[0].Username);
        _repositoryMock.Verify(repo => repo.GetPagedAsync(
            It.IsAny<string?>(),
            It.IsAny<string?>(),
            It.IsAny<string?>(),
            It.IsAny<string?>(),
            It.IsAny<int?>(),
            It.IsAny<bool?>(),
            It.IsAny<string?>(),
            It.IsAny<DateTime?>(),
            It.IsAny<DateTime?>(),
            1,
            10,
            It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task GetAuditLogById_ExistingId_ReturnsDto()
    {
        // Arrange
        var handler = new GetAuditLogByIdQueryHandler(_repositoryMock.Object);
        var logId = Guid.NewGuid();
        var query = new GetAuditLogByIdQuery(logId);
        var log = new AuditLog
        {
            Id = logId,
            Category = "Security",
            Action = "ChangePassword",
            HttpMethod = "PUT",
            StatusCode = 200,
            IsSuccess = true,
            Username = "editor_user",
            Timestamp = DateTime.UtcNow
        };

        _repositoryMock.Setup(repo => repo.GetByIdAsync(logId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(log);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(logId, result.Id);
        Assert.Equal("Security", result.Category);
        Assert.Equal("editor_user", result.Username);
    }

    [Fact]
    public async Task GetAuditLogById_NonExistingId_ReturnsNull()
    {
        // Arrange
        var handler = new GetAuditLogByIdQueryHandler(_repositoryMock.Object);
        var logId = Guid.NewGuid();
        var query = new GetAuditLogByIdQuery(logId);

        _repositoryMock.Setup(repo => repo.GetByIdAsync(logId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((AuditLog?)null);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.Null(result);
    }
}
