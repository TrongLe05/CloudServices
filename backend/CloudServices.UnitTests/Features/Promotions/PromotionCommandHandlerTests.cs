using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Promotions.Commands;
using CloudServices.Domain.Entities;
using Moq;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace CloudServices.UnitTests.Features.Promotions;

public class PromotionCommandHandlerTests
{
    private readonly Mock<IPromotionRepository> _repositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;

    public PromotionCommandHandlerTests()
    {
        _repositoryMock = new Mock<IPromotionRepository>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
    }

    [Fact]
    public async Task CreatePromotion_ValidRequest_CreatesAndSaves()
    {
        // Arrange
        var handler = new CreatePromotionCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object);
        var start = DateTime.UtcNow.AddDays(-1);
        var end = DateTime.UtcNow.AddDays(1);
        var command = new CreatePromotionCommand("Black Friday", 20, start, end);

        _repositoryMock.Setup(repo => repo.AddAsync(It.IsAny<Promotion>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.NotEqual(Guid.Empty, result.Id);
        Assert.Equal("Black Friday", result.Name);
        Assert.Equal(20, result.DiscountPercentage);
        Assert.True(result.IsActive);

        _repositoryMock.Verify(repo => repo.AddAsync(It.Is<Promotion>(p =>
            p.Name == "Black Friday" &&
            p.DiscountPercentage == 20 &&
            p.StartDate == start &&
            p.EndDate == end
        ), It.IsAny<CancellationToken>()), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task DeletePromotion_NotFound_ReturnsFalse()
    {
        // Arrange
        var handler = new DeletePromotionCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object);
        var command = new DeletePromotionCommand(Guid.NewGuid());

        _repositoryMock.Setup(repo => repo.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Promotion?)null);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task DeletePromotion_Found_DeletesAndSaves()
    {
        // Arrange
        var handler = new DeletePromotionCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object);
        var id = Guid.NewGuid();
        var command = new DeletePromotionCommand(id);
        var promotion = new Promotion { Id = id };

        _repositoryMock.Setup(repo => repo.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(promotion);
        _repositoryMock.Setup(repo => repo.Delete(promotion));
        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result);
        _repositoryMock.Verify(repo => repo.Delete(promotion), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UpdatePromotion_NotFound_ReturnsNull()
    {
        // Arrange
        var handler = new UpdatePromotionCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object);
        var command = new UpdatePromotionCommand { Id = Guid.NewGuid(), Name = "Black Friday", DiscountPercentage = 25 };

        _repositoryMock.Setup(repo => repo.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Promotion?)null);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task UpdatePromotion_Found_UpdatesAndSaves()
    {
        // Arrange
        var handler = new UpdatePromotionCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object);
        var id = Guid.NewGuid();
        var start = DateTime.UtcNow.AddDays(-1);
        var end = DateTime.UtcNow.AddDays(1);
        var command = new UpdatePromotionCommand { Id = id, Name = "Black Friday 2", DiscountPercentage = 30, StartDate = start, EndDate = end };
        var promotion = new Promotion { Id = id, Name = "Black Friday", DiscountPercentage = 20 };

        _repositoryMock.Setup(repo => repo.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(promotion);
        _repositoryMock.Setup(repo => repo.Update(promotion));
        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Black Friday 2", promotion.Name);
        Assert.Equal(30, promotion.DiscountPercentage);
        Assert.Equal(start, promotion.StartDate);
        Assert.Equal(end, promotion.EndDate);

        _repositoryMock.Verify(repo => repo.Update(promotion), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
