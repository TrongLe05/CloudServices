using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Users.Commands.RegisterUser;
using CloudServices.Domain.Entities;
using Moq;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace CloudServices.UnitTests.Features.Users;

public class RegisterUserCommandHandlerTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<IRoleRepository> _roleRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IPasswordHasher> _passwordHasherMock;
    private readonly RegisterUserCommandHandler _handler;

    public RegisterUserCommandHandlerTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _roleRepositoryMock = new Mock<IRoleRepository>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _passwordHasherMock = new Mock<IPasswordHasher>();

        _handler = new RegisterUserCommandHandler(
            _userRepositoryMock.Object,
            _roleRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _passwordHasherMock.Object
        );
    }

    [Fact]
    public async Task Handle_DefaultRoleNotFound_ThrowsException()
    {
        // Arrange
        var command = new RegisterUserCommand
        {
            Username = "newuser",
            Email = "newuser@example.com",
            Password = "SecurePassword123!",
            FullName = "New User"
        };

        _roleRepositoryMock.Setup(repo => repo.GetByNameAsync("User", It.IsAny<CancellationToken>()))
            .ReturnsAsync((Role?)null);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _handler.Handle(command, CancellationToken.None));
        Assert.Equal("Hệ thống chưa cấu hình vai trò mặc định.", exception.Message);
    }

    [Fact]
    public async Task Handle_ValidRequest_CreatesUserAndReturnsId()
    {
        // Arrange
        var command = new RegisterUserCommand
        {
            Username = "newuser",
            Email = "newuser@example.com",
            Password = "SecurePassword123!",
            FullName = "New User"
        };

        var roleId = Guid.NewGuid();
        var defaultRole = new Role { Id = roleId, Name = "User" };

        _roleRepositoryMock.Setup(repo => repo.GetByNameAsync("User", It.IsAny<CancellationToken>()))
            .ReturnsAsync(defaultRole);

        _passwordHasherMock.Setup(hasher => hasher.HashPasswords(command.Password))
            .Returns("hashed_secure_password");

        _userRepositoryMock.Setup(repo => repo.AddAsync(It.IsAny<AppUser>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotEqual(Guid.Empty, result);

        _passwordHasherMock.Verify(hasher => hasher.HashPasswords(command.Password), Times.Once);
        _userRepositoryMock.Verify(repo => repo.AddAsync(It.Is<AppUser>(user =>
            user.Username == command.Username &&
            user.Email == command.Email &&
            user.FullName == command.FullName &&
            user.PasswordHash == "hashed_secure_password" &&
            user.RoleId == roleId
        ), It.IsAny<CancellationToken>()), Times.Once);

        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
