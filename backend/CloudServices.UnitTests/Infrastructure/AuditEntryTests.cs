using CloudServices.Domain.Entities;
using CloudServices.Domain.Enums;
using CloudServices.Infrastructure.Interceptors;
using System;
using Xunit;

namespace CloudServices.UnitTests.Infrastructure;

public class AuditEntryTests
{
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
}
