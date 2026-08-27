using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
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

public class AffiliateCommandAndQueryHandlerTests
{
    private readonly Mock<IAffiliateApplicationRepository> _repositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;

    public AffiliateCommandAndQueryHandlerTests()
    {
        _repositoryMock = new Mock<IAffiliateApplicationRepository>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
    }

    [Fact]
    public async Task CreateAffiliate_NewEmail_CreatesAndReturnsId()
    {
        // Arrange
        var handler = new CreateAffiliateCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object);
        var command = new CreateAffiliateCommand("Nguyen Van Affiliate ", "new@affiliate.vn ", "0901234567 ", "https://blog.vn ", "Promotion ");

        _repositoryMock.Setup(repo => repo.GetByEmailAsync("new@affiliate.vn", It.IsAny<CancellationToken>()))
            .ReturnsAsync((AffiliateApplication?)null);

        _repositoryMock.Setup(repo => repo.AddAsync(It.IsAny<AffiliateApplication>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotEqual(Guid.Empty, result);
        _repositoryMock.Verify(repo => repo.AddAsync(It.Is<AffiliateApplication>(a =>
            a.FullName == "Nguyen Van Affiliate" &&
            a.Email == "new@affiliate.vn" &&
            a.Phone == "0901234567" &&
            a.WebsiteUrl == "https://blog.vn" &&
            a.Motivation == "Promotion" &&
            a.Status == AffiliateStatus.New
        ), It.IsAny<CancellationToken>()), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task CreateAffiliate_ExistingEmail_UpdatesExistingAndResetsToNew()
    {
        // Arrange
        var handler = new CreateAffiliateCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object);
        var existingId = Guid.NewGuid();
        var existing = new AffiliateApplication
        {
            Id = existingId,
            FullName = "Old Name",
            Email = "existing@affiliate.vn",
            Phone = "0900000000",
            Status = AffiliateStatus.Rejected
        };

        var command = new CreateAffiliateCommand("Updated Name", "existing@affiliate.vn", "0911111111", "https://new.vn", "New Motivation");

        _repositoryMock.Setup(repo => repo.GetByEmailAsync("existing@affiliate.vn", It.IsAny<CancellationToken>()))
            .ReturnsAsync(existing);

        _repositoryMock.Setup(repo => repo.Update(existing));
        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.Equal(existingId, result);
        Assert.Equal("Updated Name", existing.FullName);
        Assert.Equal("0911111111", existing.Phone);
        Assert.Equal("https://new.vn", existing.WebsiteUrl);
        Assert.Equal("New Motivation", existing.Motivation);
        Assert.Equal(AffiliateStatus.New, existing.Status);

        _repositoryMock.Verify(repo => repo.Update(existing), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task DeleteAffiliate_NotFound_ThrowsNotFoundException()
    {
        // Arrange
        var handler = new DeleteAffiliateCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object);
        var id = Guid.NewGuid();
        var command = new DeleteAffiliateCommand(id);

        _repositoryMock.Setup(repo => repo.GetByIdAsync(id, It.IsAny<CancellationToken>()))
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
        var affiliate = new AffiliateApplication { Id = id, FullName = "To Delete" };

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
}
