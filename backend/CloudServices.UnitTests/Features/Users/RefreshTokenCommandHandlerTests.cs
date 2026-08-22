using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Users.Commands.RefreshToken;
using CloudServices.Domain.Entities;
using Moq;
using System;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace CloudServices.UnitTests.Features.Users;

public class RefreshTokenCommandHandlerTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<IJwtTokenGenerator> _jwtTokenGeneratorMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly RefreshTokenCommandHandler _handler;

    public RefreshTokenCommandHandlerTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _jwtTokenGeneratorMock = new Mock<IJwtTokenGenerator>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();

        _handler = new RefreshTokenCommandHandler(
            _userRepositoryMock.Object,
            _jwtTokenGeneratorMock.Object,
            _unitOfWorkMock.Object
        );
    }

    [Fact]
    public async Task Handle_InvalidExpiredAccessToken_ThrowsUnauthorizedException()
    {
        // Arrange
        var command = new RefreshTokenCommand("invalid_expired_token", "some_refresh_token");
        _jwtTokenGeneratorMock.Setup(x => x.GetPrincipalFromExpiredToken(command.ExpiredAccessToken))
            .Throws(new Exception("Invalid token"));

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedException>(() => _handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_ValidCurrentRefreshToken_RotatesTokenAndSetsPreviousRefreshToken()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new AppUser
        {
            Id = userId,
            Username = "testuser",
            RefreshToken = "current_valid_token",
            RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7)
        };

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString())
        };
        var identity = new ClaimsIdentity(claims);
        var principal = new ClaimsPrincipal(identity);

        var command = new RefreshTokenCommand("expired_access_token", "current_valid_token");

        _jwtTokenGeneratorMock.Setup(x => x.GetPrincipalFromExpiredToken(command.ExpiredAccessToken))
            .Returns(principal);

        _userRepositoryMock.Setup(x => x.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        _jwtTokenGeneratorMock.Setup(x => x.GenerateToken(user))
            .Returns("new_access_token");

        _jwtTokenGeneratorMock.Setup(x => x.GenerateRefreshToken())
            .Returns("new_refresh_token");

        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("new_access_token", result.AccessToken);
        Assert.Equal("new_refresh_token", result.RefreshToken);
        Assert.Equal("testuser", result.Username);

        // Verify rotation state on user entity
        Assert.Equal("current_valid_token", user.PreviousRefreshToken);
        Assert.NotNull(user.PreviousRefreshTokenExpiryTime);
        Assert.True(user.PreviousRefreshTokenExpiryTime > DateTime.UtcNow);
        Assert.Equal("new_refresh_token", user.RefreshToken);
        Assert.True(user.RefreshTokenExpiryTime > DateTime.UtcNow);

        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ConcurrentRequestWithPreviousRefreshTokenWithinGracePeriod_SucceedsWithoutCrashing()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new AppUser
        {
            Id = userId,
            Username = "testuser",
            RefreshToken = "active_new_token",
            RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7),
            PreviousRefreshToken = "recently_rotated_old_token",
            PreviousRefreshTokenExpiryTime = DateTime.UtcNow.AddMinutes(1) // Still within grace period
        };

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString())
        };
        var identity = new ClaimsIdentity(claims);
        var principal = new ClaimsPrincipal(identity);

        var command = new RefreshTokenCommand("expired_access_token", "recently_rotated_old_token");

        _jwtTokenGeneratorMock.Setup(x => x.GetPrincipalFromExpiredToken(command.ExpiredAccessToken))
            .Returns(principal);

        _userRepositoryMock.Setup(x => x.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        _jwtTokenGeneratorMock.Setup(x => x.GenerateToken(user))
            .Returns("fresh_access_token");

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("fresh_access_token", result.AccessToken);
        Assert.Equal("active_new_token", result.RefreshToken);
        Assert.Equal("testuser", result.Username);
    }

    [Fact]
    public async Task Handle_ExpiredRefreshToken_ThrowsUnauthorizedException()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new AppUser
        {
            Id = userId,
            Username = "testuser",
            RefreshToken = "expired_token",
            RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(-1), // expired yesterday
            PreviousRefreshToken = "old_expired_previous_token",
            PreviousRefreshTokenExpiryTime = DateTime.UtcNow.AddMinutes(-5)
        };

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString())
        };
        var identity = new ClaimsIdentity(claims);
        var principal = new ClaimsPrincipal(identity);

        var command = new RefreshTokenCommand("expired_access_token", "expired_token");

        _jwtTokenGeneratorMock.Setup(x => x.GetPrincipalFromExpiredToken(command.ExpiredAccessToken))
            .Returns(principal);

        _userRepositoryMock.Setup(x => x.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<UnauthorizedException>(() => _handler.Handle(command, CancellationToken.None));
        Assert.Equal("Refresh Token không hợp lệ hoặc đã hết hạn.", ex.Message);
    }

    [Fact]
    public async Task Handle_MismatchedRefreshToken_ThrowsUnauthorizedException()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new AppUser
        {
            Id = userId,
            Username = "testuser",
            RefreshToken = "actual_token_in_db",
            RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7),
            PreviousRefreshToken = "previous_token_in_db",
            PreviousRefreshTokenExpiryTime = DateTime.UtcNow.AddMinutes(2)
        };

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString())
        };
        var identity = new ClaimsIdentity(claims);
        var principal = new ClaimsPrincipal(identity);

        var command = new RefreshTokenCommand("expired_access_token", "completely_wrong_token");

        _jwtTokenGeneratorMock.Setup(x => x.GetPrincipalFromExpiredToken(command.ExpiredAccessToken))
            .Returns(principal);

        _userRepositoryMock.Setup(x => x.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<UnauthorizedException>(() => _handler.Handle(command, CancellationToken.None));
        Assert.Equal("Refresh Token không hợp lệ hoặc đã hết hạn.", ex.Message);
    }
}
