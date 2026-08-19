using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Users.Commands.Login;
using CloudServices.Domain.Entities;
using Moq;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace CloudServices.UnitTests.Features.Users;

public class LoginCommandHandlerTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<IPasswordHasher> _passwordHasherMock;
    private readonly Mock<IJwtTokenGenerator> _jwtTokenGeneratorMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly LoginCommandHandler _handler;

    public LoginCommandHandlerTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _passwordHasherMock = new Mock<IPasswordHasher>();
        _jwtTokenGeneratorMock = new Mock<IJwtTokenGenerator>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();

        _handler = new LoginCommandHandler(
            _userRepositoryMock.Object,
            _passwordHasherMock.Object,
            _jwtTokenGeneratorMock.Object,
            _unitOfWorkMock.Object
        );
    }

    [Fact]
    public async Task Handle_UserDoesNotExist_ThrowsUnauthorizedException()
    {
        // Arrange
        var command = new LoginCommand { Username = "nonexistent", Password = "password123" };
        _userRepositoryMock.Setup(repo => repo.GetByUsernameAsync(command.Username, It.IsAny<CancellationToken>()))
            .ReturnsAsync((AppUser?)null);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedException>(() => _handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_PasswordIncorrect_ThrowsUnauthorizedException()
    {
        // Arrange
        var command = new LoginCommand { Username = "testuser", Password = "wrongpassword" };
        var user = new AppUser { Username = "testuser", PasswordHash = "hashedpassword" };

        _userRepositoryMock.Setup(repo => repo.GetByUsernameAsync(command.Username, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        _passwordHasherMock.Setup(hasher => hasher.VerifyPassword(command.Password, user.PasswordHash))
            .Returns(false);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedException>(() => _handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_ValidCredentials_ReturnsTokensAndSavesChanges()
    {
        // Arrange
        var command = new LoginCommand { Username = "testuser", Password = "correctpassword" };
        var user = new AppUser { Username = "testuser", PasswordHash = "hashedpassword" };

        _userRepositoryMock.Setup(repo => repo.GetByUsernameAsync(command.Username, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        _passwordHasherMock.Setup(hasher => hasher.VerifyPassword(command.Password, user.PasswordHash))
            .Returns(true);

        _jwtTokenGeneratorMock.Setup(generator => generator.GenerateToken(user))
            .Returns("access_token");

        _jwtTokenGeneratorMock.Setup(generator => generator.GenerateRefreshToken())
            .Returns("refresh_token");

        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("access_token", result.AccessToken);
        Assert.Equal("refresh_token", result.RefreshToken);
        Assert.Equal("testuser", result.Username);

        Assert.Equal("refresh_token", user.RefreshToken);
        Assert.NotNull(user.RefreshTokenExpiryTime);
        Assert.True(user.RefreshTokenExpiryTime > DateTime.UtcNow);

        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
