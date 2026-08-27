using CloudServices.Infrastructure.Services;
using Microsoft.AspNetCore.Http;
using Moq;
using System;
using System.Collections.Generic;
using System.Net;
using System.Security.Claims;
using Xunit;

namespace CloudServices.UnitTests.Infrastructure;

public class CurrentUserServiceTests
{
    private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;

    public CurrentUserServiceTests()
    {
        _httpContextAccessorMock = new Mock<IHttpContextAccessor>();
    }

    [Fact]
    public void Properties_WhenHttpContextIsNull_ReturnsDefaults()
    {
        // Arrange
        _httpContextAccessorMock.Setup(a => a.HttpContext).Returns((HttpContext?)null);
        var service = new CurrentUserService(_httpContextAccessorMock.Object);

        // Act & Assert
        Assert.Null(service.UserId);
        Assert.Equal("Anonymous", service.Username);
        Assert.Null(service.UserRole);
        Assert.Null(service.IpAddress);
    }

    [Fact]
    public void Properties_WhenAuthenticatedWithClaims_ReturnsExpectedValues()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Name, "cloud_admin"),
            new Claim(ClaimTypes.Role, "Admin")
        };
        var identity = new ClaimsIdentity(claims, "TestAuthType");
        var principal = new ClaimsPrincipal(identity);

        var context = new DefaultHttpContext { User = principal };
        context.Connection.RemoteIpAddress = IPAddress.Parse("127.0.0.1");

        _httpContextAccessorMock.Setup(a => a.HttpContext).Returns(context);
        var service = new CurrentUserService(_httpContextAccessorMock.Object);

        // Act & Assert
        Assert.Equal(userId, service.UserId);
        Assert.Equal("cloud_admin", service.Username);
        Assert.Equal("Admin", service.UserRole);
        Assert.Equal("127.0.0.1", service.IpAddress);
    }

    [Fact]
    public void IpAddress_WhenXForwardedForHeaderPresent_ReturnsFirstClientIp()
    {
        // Arrange
        var context = new DefaultHttpContext();
        context.Request.Headers["X-Forwarded-For"] = "203.0.113.195, 70.41.3.18, 150.172.238.178";

        _httpContextAccessorMock.Setup(a => a.HttpContext).Returns(context);
        var service = new CurrentUserService(_httpContextAccessorMock.Object);

        // Act
        var ip = service.IpAddress;

        // Assert
        Assert.Equal("203.0.113.195", ip);
    }
}
