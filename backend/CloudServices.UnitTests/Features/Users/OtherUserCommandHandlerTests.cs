using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Users.Commands.CreateUser;
using CloudServices.Application.Features.Users.Commands.Logout;
using CloudServices.Application.Features.Users.Commands.RefreshToken;
using CloudServices.Domain.Entities;
using Moq;
using System;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace CloudServices.UnitTests.Features.Users;

public class OtherUserCommandHandlerTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<IRoleRepository> _roleRepositoryMock;
    private readonly Mock<IPasswordHasher> _passwordHasherMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IJwtTokenGenerator> _jwtGeneratorMock;

    public OtherUserCommandHandlerTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _roleRepositoryMock = new Mock<IRoleRepository>();
        _passwordHasherMock = new Mock<IPasswordHasher>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _jwtGeneratorMock = new Mock<IJwtTokenGenerator>();

        _passwordHasherMock.Setup(h => h.HashPasswords(It.IsAny<string>()))
            .Returns<string>(p => $"hashed_{p}");
    }

    [Fact]
    public async Task CreateUser_RoleNotFound_ThrowsNotFoundException()
    {
        // Arrange
        var handler = new CreateUserCommandHandler(
            _userRepositoryMock.Object,
            _roleRepositoryMock.Object,
            _passwordHasherMock.Object,
            _unitOfWorkMock.Object
        );
        var command = new CreateUserCommand("u", "p", "fn", "e@e.com");

        _roleRepositoryMock.Setup(repo => repo.GetByNameAsync("User", It.IsAny<CancellationToken>()))
            .ReturnsAsync((Role?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task CreateUser_ValidRequest_CreatesUserAndSaves()
    {
        // Arrange
        var handler = new CreateUserCommandHandler(
            _userRepositoryMock.Object,
            _roleRepositoryMock.Object,
            _passwordHasherMock.Object,
            _unitOfWorkMock.Object
        );
        var command = new CreateUserCommand("test", "password", "fn", "e@e.com");
        var role = new Role { Id = Guid.NewGuid(), Name = "User" };

        _roleRepositoryMock.Setup(repo => repo.GetByNameAsync("User", It.IsAny<CancellationToken>()))
            .ReturnsAsync(role);
        _userRepositoryMock.Setup(repo => repo.AddAsync(It.IsAny<AppUser>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotEqual(Guid.Empty, result);
        _userRepositoryMock.Verify(repo => repo.AddAsync(It.Is<AppUser>(u =>
            u.Username == "test" &&
            u.FullName == "fn" &&
            u.Email == "e@e.com" &&
            u.RoleId == role.Id
        ), It.IsAny<CancellationToken>()), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Logout_UserNotFound_DoesNothing()
    {
        // Arrange
        var handler = new LogoutCommandHandler(_userRepositoryMock.Object, _unitOfWorkMock.Object);
        var command = new LogoutCommand(Guid.NewGuid());

        _userRepositoryMock.Setup(repo => repo.GetByIdAsync(command.UserId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((AppUser?)null);

        // Act
        await handler.Handle(command, CancellationToken.None);

        // Assert
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Logout_UserFound_ClearsTokenAndSaves()
    {
        // Arrange
        var handler = new LogoutCommandHandler(_userRepositoryMock.Object, _unitOfWorkMock.Object);
        var userId = Guid.NewGuid();
        var command = new LogoutCommand(userId);
        var user = new AppUser { Id = userId, RefreshToken = "token", RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(1) };

        _userRepositoryMock.Setup(repo => repo.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.Null(user.RefreshToken);
        Assert.Null(user.RefreshTokenExpiryTime);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task RefreshToken_InvalidExpiredAccessToken_ThrowsUnauthorizedException()
    {
        // Arrange
        var handler = new RefreshTokenCommandHandler(_userRepositoryMock.Object, _jwtGeneratorMock.Object, _unitOfWorkMock.Object);
        var command = new RefreshTokenCommand("expired_token", "refresh_token");

        _jwtGeneratorMock.Setup(g => g.GetPrincipalFromExpiredToken("expired_token"))
            .Throws(new Exception("Invalid token"));

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task RefreshToken_TokenHasNoValidUserId_ThrowsUnauthorizedException()
    {
        // Arrange
        var handler = new RefreshTokenCommandHandler(_userRepositoryMock.Object, _jwtGeneratorMock.Object, _unitOfWorkMock.Object);
        var command = new RefreshTokenCommand("expired_token", "refresh_token");
        var principal = new ClaimsPrincipal(new ClaimsIdentity()); // Empty principal

        _jwtGeneratorMock.Setup(g => g.GetPrincipalFromExpiredToken("expired_token"))
            .Returns(principal);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task RefreshToken_UserNotFound_ThrowsUnauthorizedException()
    {
        // Arrange
        var handler = new RefreshTokenCommandHandler(_userRepositoryMock.Object, _jwtGeneratorMock.Object, _unitOfWorkMock.Object);
        var command = new RefreshTokenCommand("expired_token", "refresh_token");
        var userId = Guid.NewGuid();
        var principal = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, userId.ToString()) }));

        _jwtGeneratorMock.Setup(g => g.GetPrincipalFromExpiredToken("expired_token"))
            .Returns(principal);
        _userRepositoryMock.Setup(repo => repo.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((AppUser?)null);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task RefreshToken_TokenMismatchOrExpired_ThrowsUnauthorizedException()
    {
        // Arrange
        var handler = new RefreshTokenCommandHandler(_userRepositoryMock.Object, _jwtGeneratorMock.Object, _unitOfWorkMock.Object);
        var command = new RefreshTokenCommand("expired_token", "wrong_refresh_token");
        var userId = Guid.NewGuid();
        var principal = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim("sub", userId.ToString()) }));
        var user = new AppUser { Id = userId, RefreshToken = "stored_refresh_token", RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(1) };

        _jwtGeneratorMock.Setup(g => g.GetPrincipalFromExpiredToken("expired_token"))
            .Returns(principal);
        _userRepositoryMock.Setup(repo => repo.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task RefreshToken_ValidTokens_GeneratesNewTokensAndSaves()
    {
        // Arrange
        var handler = new RefreshTokenCommandHandler(_userRepositoryMock.Object, _jwtGeneratorMock.Object, _unitOfWorkMock.Object);
        var command = new RefreshTokenCommand("expired_token", "valid_refresh_token");
        var userId = Guid.NewGuid();
        var principal = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim("sub", userId.ToString()) }));
        var user = new AppUser { Id = userId, RefreshToken = "valid_refresh_token", RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(1), Username = "user" };

        _jwtGeneratorMock.Setup(g => g.GetPrincipalFromExpiredToken("expired_token"))
            .Returns(principal);
        _userRepositoryMock.Setup(repo => repo.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _jwtGeneratorMock.Setup(g => g.GenerateToken(user))
            .Returns("new_access_token");
        _jwtGeneratorMock.Setup(g => g.GenerateRefreshToken())
            .Returns("new_refresh_token");
        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("new_access_token", result.AccessToken);
        Assert.Equal("new_refresh_token", result.RefreshToken);
        Assert.Equal("user", result.Username);

        Assert.Equal("new_refresh_token", user.RefreshToken);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
