using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.PlanPrices.Commands;
using CloudServices.Domain.Entities;
using Moq;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace CloudServices.UnitTests.Features.PlanPrices;

public class PlanPriceCommandHandlerTests
{
    private readonly Mock<IPlanPriceRepository> _repositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;

    public PlanPriceCommandHandlerTests()
    {
        _repositoryMock = new Mock<IPlanPriceRepository>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
    }

    [Fact]
    public async Task CreatePlanPrice_ValidRequest_CreatesAndSaves()
    {
        // Arrange
        var handler = new CreatePlanPriceCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object);
        var planId = Guid.NewGuid();
        var promoId = Guid.NewGuid();
        var command = new CreatePlanPriceCommand(planId, "Annually", 599.99m, promoId);

        _repositoryMock.Setup(repo => repo.AddAsync(It.IsAny<PlanPrice>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotEqual(Guid.Empty, result);
        _repositoryMock.Verify(repo => repo.AddAsync(It.Is<PlanPrice>(p =>
            p.PlanId == planId &&
            p.BillingCycle == "Annually" &&
            p.Price == 599.99m &&
            p.PromotionId == promoId
        ), It.IsAny<CancellationToken>()), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task DeletePlanPrice_NotFoundOrMismatch_ReturnsFalse()
    {
        // Arrange
        var handler = new DeletePlanPriceCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object);
        var planId = Guid.NewGuid();
        var priceId = Guid.NewGuid();
        var command = new DeletePlanPriceCommand(planId, priceId);

        // Setup NotFound
        _repositoryMock.Setup(repo => repo.GetByIdAsync(priceId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((PlanPrice?)null);

        // Act
        var resultNotFound = await handler.Handle(command, CancellationToken.None);

        // Setup Mismatch PlanId
        var planPriceMismatch = new PlanPrice { Id = priceId, PlanId = Guid.NewGuid() };
        _repositoryMock.Setup(repo => repo.GetByIdAsync(priceId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(planPriceMismatch);

        var resultMismatch = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.False(resultNotFound);
        Assert.False(resultMismatch);
    }

    [Fact]
    public async Task DeletePlanPrice_FoundAndMatches_DeletesAndSaves()
    {
        // Arrange
        var handler = new DeletePlanPriceCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object);
        var planId = Guid.NewGuid();
        var priceId = Guid.NewGuid();
        var command = new DeletePlanPriceCommand(planId, priceId);
        var planPrice = new PlanPrice { Id = priceId, PlanId = planId };

        _repositoryMock.Setup(repo => repo.GetByIdAsync(priceId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(planPrice);
        _repositoryMock.Setup(repo => repo.Delete(planPrice));
        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result);
        _repositoryMock.Verify(repo => repo.Delete(planPrice), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UpdatePlanPrice_NotFoundOrMismatch_ReturnsFalse()
    {
        // Arrange
        var handler = new UpdatePlanPriceCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object);
        var planId = Guid.NewGuid();
        var priceId = Guid.NewGuid();
        var command = new UpdatePlanPriceCommand(planId, priceId, "Monthly", 100m, null);

        _repositoryMock.Setup(repo => repo.GetByIdAsync(priceId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((PlanPrice?)null);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task UpdatePlanPrice_FoundAndMatches_UpdatesAndSaves()
    {
        // Arrange
        var handler = new UpdatePlanPriceCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object);
        var planId = Guid.NewGuid();
        var priceId = Guid.NewGuid();
        var command = new UpdatePlanPriceCommand(planId, priceId, "Quarterly", 250m, null);
        var planPrice = new PlanPrice { Id = priceId, PlanId = planId, BillingCycle = "Monthly", Price = 100m };

        _repositoryMock.Setup(repo => repo.GetByIdAsync(priceId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(planPrice);
        _repositoryMock.Setup(repo => repo.Update(planPrice));
        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result);
        Assert.Equal("Quarterly", planPrice.BillingCycle);
        Assert.Equal(250m, planPrice.Price);
        Assert.Null(planPrice.PromotionId);

        _repositoryMock.Verify(repo => repo.Update(planPrice), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
