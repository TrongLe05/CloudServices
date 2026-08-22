using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Exceptions.BadRequestException;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Affiliates.Commands.ChangeAffiliateStatus;
using CloudServices.Application.Features.Affiliates.Commands.CreateAffiliate;
using CloudServices.Application.Features.Affiliates.Commands.DeleteAffiliate;
using CloudServices.Domain.Entities;
using CloudServices.Domain.Enums;
using Moq;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace CloudServices.UnitTests.Features.Affiliates;

public class AffiliateCommandHandlerTests
{
    private readonly Mock<IAffiliateApplicationRepository> _repositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;

    public AffiliateCommandHandlerTests()
    {
        _repositoryMock = new Mock<IAffiliateApplicationRepository>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
    }

    [Fact]
    public async Task CreateAffiliate_ValidRequest_CreatesAndSaves()
    {
        // Arrange
        var handler = new CreateAffiliateCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object);
        var command = new CreateAffiliateCommand("John Doe", "john@example.com", "123456", "http://web.url", "Motivation");

        _repositoryMock.Setup(repo => repo.AddAsync(It.IsAny<AffiliateApplication>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotEqual(Guid.Empty, result);
        _repositoryMock.Verify(repo => repo.AddAsync(It.Is<AffiliateApplication>(a =>
            a.FullName == "John Doe" &&
            a.Email == "john@example.com" &&
            a.Phone == "123456" &&
            a.WebsiteUrl == "http://web.url" &&
            a.Motivation == "Motivation" &&
            a.Status == AffiliateStatus.New
        ), It.IsAny<CancellationToken>()), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task DeleteAffiliate_NotFound_ThrowsNotFoundException()
    {
        // Arrange
        var handler = new DeleteAffiliateCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object);
        var command = new DeleteAffiliateCommand(Guid.NewGuid());

        _repositoryMock.Setup(repo => repo.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((AffiliateApplication?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task DeleteAffiliate_Found_DeletesAndSaves()
    {
        // Arrange
        var handler = new DeleteAffiliateCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object);
        var id = Guid.NewGuid();
        var command = new DeleteAffiliateCommand(id);
        var affiliate = new AffiliateApplication { Id = id };

        _repositoryMock.Setup(repo => repo.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(affiliate);
        _repositoryMock.Setup(repo => repo.Delete(affiliate));
        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        await handler.Handle(command, CancellationToken.None);

        // Assert
        _repositoryMock.Verify(repo => repo.Delete(affiliate), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ChangeStatus_InvalidStatusString_ThrowsBadRequestException()
    {
        // Arrange
        var handler = new ChangeAffiliateStatusCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object);
        var command = new ChangeAffiliateStatusCommand(Guid.NewGuid(), "InvalidStatusString");

        // Act & Assert
        var exception = await Assert.ThrowsAsync<BadRequestException>(() => handler.Handle(command, CancellationToken.None));
        Assert.Equal("Trạng thái đối tác (Affiliate Status) không hợp lệ.", exception.Message);
    }

    [Fact]
    public async Task ChangeStatus_ApplicationNotFound_ThrowsNotFoundException()
    {
        // Arrange
        var handler = new ChangeAffiliateStatusCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object);
        var command = new ChangeAffiliateStatusCommand(Guid.NewGuid(), "Approved");
        _repositoryMock.Setup(repo => repo.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((AffiliateApplication?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task ChangeStatus_ValidRequest_UpdatesStatusAndSavesChanges()
    {
        // Arrange
        var handler = new ChangeAffiliateStatusCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object);
        var applicationId = Guid.NewGuid();
        var command = new ChangeAffiliateStatusCommand(applicationId, "Approved");
        var application = new AffiliateApplication
        {
            Id = applicationId,
            FullName = "John Doe",
            Status = AffiliateStatus.New
        };

        _repositoryMock.Setup(repo => repo.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);

        _repositoryMock.Setup(repo => repo.Update(application));
        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.Equal(AffiliateStatus.Approved, application.Status);
        _repositoryMock.Verify(repo => repo.Update(application), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
