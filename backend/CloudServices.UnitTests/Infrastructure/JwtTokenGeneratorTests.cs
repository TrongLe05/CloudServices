using CloudServices.Domain.Entities;
using CloudServices.Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using Xunit;

namespace CloudServices.UnitTests.Infrastructure;

public class JwtTokenGeneratorTests
{
    private readonly IConfiguration _configuration;

    public JwtTokenGeneratorTests()
    {
        var inMemorySettings = new Dictionary<string, string?>
        {
            {"JwtSettings:Secret", "SuperSecretKeyForTestingJwtTokenGeneratorWithSufficientLength123456!"},
            {"JwtSettings:Issuer", "CloudServicesIssuer"},
            {"JwtSettings:Audience", "CloudServicesAudience"},
            {"JwtSettings:ExpiryMinutes", "30"}
        };

        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();
    }

    [Fact]
    public void GenerateToken_ValidUser_GeneratesValidJwtString()
    {
        // Arrange
        var generator = new JwtTokenGenerator(_configuration);
        var user = new AppUser
        {
            Id = Guid.NewGuid(),
            Username = "test_user",
            Email = "test@cloudservices.vn",
            Role = new Role { Name = "Admin" }
        };

        // Act
        var token = generator.GenerateToken(user);

        // Assert
        Assert.False(string.IsNullOrWhiteSpace(token));
        Assert.Contains(".", token);
    }

    [Fact]
    public void GenerateRefreshToken_ReturnsNonEmptyBase64String()
    {
        // Arrange
        var generator = new JwtTokenGenerator(_configuration);

        // Act
        var refreshToken = generator.GenerateRefreshToken();

        // Assert
        Assert.False(string.IsNullOrWhiteSpace(refreshToken));
        Assert.True(refreshToken.Length >= 32);
    }

    [Fact]
    public void GetPrincipalFromExpiredToken_ValidToken_ReturnsClaimsPrincipal()
    {
        // Arrange
        var generator = new JwtTokenGenerator(_configuration);
        var user = new AppUser
        {
            Id = Guid.NewGuid(),
            Username = "expired_user",
            Email = "expired@cloudservices.vn",
            Role = new Role { Name = "Editor" }
        };
        var token = generator.GenerateToken(user);

        // Act
        var principal = generator.GetPrincipalFromExpiredToken(token);

        // Assert
        Assert.NotNull(principal);
        Assert.Equal("expired_user", principal.Identity?.Name);
    }
}
