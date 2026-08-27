using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Exceptions.BadRequestException;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Users.Commands.ToggleUserStatus;
using CloudServices.Application.Features.Users.Commands.UpdateUser;
using CloudServices.Domain.Entities;
using MediatR;
using Moq;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace CloudServices.UnitTests.Features.Users;

public class UserManagementCommandHandlerTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<IRoleRepository> _roleRepositoryMock;
    private readonly Mock<ICurrentUserService> _currentUserServiceMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;

    public UserManagementCommandHandlerTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _roleRepositoryMock = new Mock<IRoleRepository>();
        _currentUserServiceMock = new Mock<ICurrentUserService>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
    }

    #region UpdateUserCommandHandler Tests

    [Fact]
    public async Task UpdateUser_UserNotFound_ThrowsNotFoundException()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var handler = new UpdateUserCommandHandler(
            _userRepositoryMock.Object,
            _roleRepositoryMock.Object,
            _currentUserServiceMock.Object,
            _unitOfWorkMock.Object
        );

        _userRepositoryMock.Setup(r => r.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((AppUser?)null);

        var command = new UpdateUserCommand(userId, "John Doe", "john@example.com", Guid.NewGuid());

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task UpdateUser_RoleNotFound_ThrowsNotFoundException()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var roleId = Guid.NewGuid();
        var user = new AppUser { Id = userId, Username = "user1" };

        var handler = new UpdateUserCommandHandler(
            _userRepositoryMock.Object,
            _roleRepositoryMock.Object,
            _currentUserServiceMock.Object,
            _unitOfWorkMock.Object
        );

        _userRepositoryMock.Setup(r => r.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _roleRepositoryMock.Setup(r => r.GetByIdAsync(roleId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Role?)null);

        var command = new UpdateUserCommand(userId, "John Doe", "john@example.com", roleId);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task UpdateUser_SelfChangeRole_ThrowsBadRequestException()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var oldRoleId = Guid.NewGuid();
        var newRoleId = Guid.NewGuid();
        var user = new AppUser { Id = userId, Username = "manager", RoleId = oldRoleId };
        var newRole = new Role { Id = newRoleId, Name = "User" };

        var handler = new UpdateUserCommandHandler(
            _userRepositoryMock.Object,
            _roleRepositoryMock.Object,
            _currentUserServiceMock.Object,
            _unitOfWorkMock.Object
        );

        _currentUserServiceMock.Setup(c => c.UserId).Returns(userId); // Self
        _userRepositoryMock.Setup(r => r.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _roleRepositoryMock.Setup(r => r.GetByIdAsync(newRoleId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(newRole);

        var command = new UpdateUserCommand(userId, "Manager", "m@example.com", newRoleId);

        // Act & Assert
        await Assert.ThrowsAsync<BadRequestException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task UpdateUser_SelfDeactivate_ThrowsBadRequestException()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var roleId = Guid.NewGuid();
        var user = new AppUser { Id = userId, Username = "manager", RoleId = roleId };
        var role = new Role { Id = roleId, Name = "Manager" };

        var handler = new UpdateUserCommandHandler(
            _userRepositoryMock.Object,
            _roleRepositoryMock.Object,
            _currentUserServiceMock.Object,
            _unitOfWorkMock.Object
        );

        _currentUserServiceMock.Setup(c => c.UserId).Returns(userId); // Self
        _userRepositoryMock.Setup(r => r.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _roleRepositoryMock.Setup(r => r.GetByIdAsync(roleId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(role);

        var command = new UpdateUserCommand(userId, "Manager", "m@example.com", roleId, IsActive: false);

        // Act & Assert
        await Assert.ThrowsAsync<BadRequestException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task UpdateUser_SystemAdminDemoteOrDeactivate_ThrowsBadRequestException()
    {
        // Arrange
        var adminId = Guid.NewGuid();
        var adminRoleId = Guid.NewGuid();
        var userRoleId = Guid.NewGuid();
        var user = new AppUser { Id = adminId, Username = "admin", RoleId = adminRoleId };
        var userRole = new Role { Id = userRoleId, Name = "User" };

        var handler = new UpdateUserCommandHandler(
            _userRepositoryMock.Object,
            _roleRepositoryMock.Object,
            _currentUserServiceMock.Object,
            _unitOfWorkMock.Object
        );

        _currentUserServiceMock.Setup(c => c.UserId).Returns(Guid.NewGuid()); // Another admin
        _userRepositoryMock.Setup(r => r.GetByIdAsync(adminId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _roleRepositoryMock.Setup(r => r.GetByIdAsync(userRoleId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(userRole);

        var demoteCommand = new UpdateUserCommand(adminId, "Admin", "admin@cloud.vn", userRoleId, IsActive: true);

        // Act & Assert
        await Assert.ThrowsAsync<BadRequestException>(() => handler.Handle(demoteCommand, CancellationToken.None));
    }

    [Fact]
    public async Task UpdateUser_ValidAdminAndTargetUser_UpdatesSuccessfully()
    {
        // Arrange
        var targetUserId = Guid.NewGuid();
        var targetRoleId = Guid.NewGuid();
        var user = new AppUser
        {
            Id = targetUserId,
            Username = "employee1",
            FullName = "Old Name",
            Email = "old@cloud.vn",
            RoleId = targetRoleId,
            IsActive = true
        };
        var role = new Role { Id = targetRoleId, Name = "Editor" };

        var handler = new UpdateUserCommandHandler(
            _userRepositoryMock.Object,
            _roleRepositoryMock.Object,
            _currentUserServiceMock.Object,
            _unitOfWorkMock.Object
        );

        _currentUserServiceMock.Setup(c => c.UserId).Returns(Guid.NewGuid()); // Other user
        _userRepositoryMock.Setup(r => r.GetByIdAsync(targetUserId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _roleRepositoryMock.Setup(r => r.GetByIdAsync(targetRoleId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(role);

        var command = new UpdateUserCommand(targetUserId, "New Name ", "NEW@CLOUD.VN ", targetRoleId, IsActive: true, AvatarUrl: "https://avatar.png ");

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.Equal(Unit.Value, result);
        Assert.Equal("New Name", user.FullName);
        Assert.Equal("new@cloud.vn", user.Email);
        Assert.Equal("https://avatar.png", user.AvatarUrl);
        _userRepositoryMock.Verify(r => r.Update(user), Times.Once);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    #endregion

    #region ToggleUserStatusCommandHandler Tests

    [Fact]
    public async Task ToggleUserStatus_UserNotFound_ThrowsNotFoundException()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var handler = new ToggleUserStatusCommandHandler(
            _userRepositoryMock.Object,
            _currentUserServiceMock.Object,
            _unitOfWorkMock.Object
        );

        _userRepositoryMock.Setup(r => r.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((AppUser?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(new ToggleUserStatusCommand(userId), CancellationToken.None));
    }

    [Fact]
    public async Task ToggleUserStatus_SelfDeactivate_ThrowsBadRequestException()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new AppUser { Id = userId, Username = "self_user", IsActive = true };

        var handler = new ToggleUserStatusCommandHandler(
            _userRepositoryMock.Object,
            _currentUserServiceMock.Object,
            _unitOfWorkMock.Object
        );

        _currentUserServiceMock.Setup(c => c.UserId).Returns(userId);
        _userRepositoryMock.Setup(r => r.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        // Act & Assert
        await Assert.ThrowsAsync<BadRequestException>(() => handler.Handle(new ToggleUserStatusCommand(userId), CancellationToken.None));
    }

    [Fact]
    public async Task ToggleUserStatus_SystemAdmin_ThrowsBadRequestException()
    {
        // Arrange
        var adminId = Guid.NewGuid();
        var user = new AppUser { Id = adminId, Username = "admin", IsActive = true };

        var handler = new ToggleUserStatusCommandHandler(
            _userRepositoryMock.Object,
            _currentUserServiceMock.Object,
            _unitOfWorkMock.Object
        );

        _currentUserServiceMock.Setup(c => c.UserId).Returns(Guid.NewGuid());
        _userRepositoryMock.Setup(r => r.GetByIdAsync(adminId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        // Act & Assert
        await Assert.ThrowsAsync<BadRequestException>(() => handler.Handle(new ToggleUserStatusCommand(adminId), CancellationToken.None));
    }

    [Fact]
    public async Task ToggleUserStatus_DeactivateUser_RevokesRefreshTokensAndSaves()
    {
        // Arrange
        var targetId = Guid.NewGuid();
        var user = new AppUser
        {
            Id = targetId,
            Username = "user_to_block",
            IsActive = true,
            RefreshToken = "some_token",
            RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7),
            PreviousRefreshToken = "prev_token",
            PreviousRefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7)
        };

        var handler = new ToggleUserStatusCommandHandler(
            _userRepositoryMock.Object,
            _currentUserServiceMock.Object,
            _unitOfWorkMock.Object
        );

        _currentUserServiceMock.Setup(c => c.UserId).Returns(Guid.NewGuid());
        _userRepositoryMock.Setup(r => r.GetByIdAsync(targetId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        // Act
        var result = await handler.Handle(new ToggleUserStatusCommand(targetId, IsActive: false), CancellationToken.None);

        // Assert
        Assert.False(result);
        Assert.False(user.IsActive);
        Assert.Null(user.RefreshToken);
        Assert.Null(user.RefreshTokenExpiryTime);
        Assert.Null(user.PreviousRefreshToken);
        Assert.Null(user.PreviousRefreshTokenExpiryTime);
        _userRepositoryMock.Verify(r => r.Update(user), Times.Once);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ToggleUserStatus_ActivateUser_TogglesStatusCorrectly()
    {
        // Arrange
        var targetId = Guid.NewGuid();
        var user = new AppUser
        {
            Id = targetId,
            Username = "user_to_activate",
            IsActive = false
        };

        var handler = new ToggleUserStatusCommandHandler(
            _userRepositoryMock.Object,
            _currentUserServiceMock.Object,
            _unitOfWorkMock.Object
        );

        _currentUserServiceMock.Setup(c => c.UserId).Returns(Guid.NewGuid());
        _userRepositoryMock.Setup(r => r.GetByIdAsync(targetId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        // Act (without explicit boolean, toggle !IsActive)
        var result = await handler.Handle(new ToggleUserStatusCommand(targetId), CancellationToken.None);

        // Assert
        Assert.True(result);
        Assert.True(user.IsActive);
        _userRepositoryMock.Verify(r => r.Update(user), Times.Once);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    #endregion
}
