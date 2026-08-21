using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Exceptions.BadRequestException;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.OrderRequests.Commands.ChangeOrderStatus;
using CloudServices.Application.Features.OrderRequests.Commands.CreateOrderRequest;
using CloudServices.Application.Features.OrderRequests.Commands.DeleteOrderRequest;
using CloudServices.Domain.Entities;
using CloudServices.Domain.Enums;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace CloudServices.UnitTests.Features.OrderRequests;

public class OrderRequestCommandHandlerTests
{
    private readonly Mock<IPlanPriceRepository> _pricesRepositoryMock;
    private readonly Mock<IOrderRequestRepository> _ordersRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;

    public OrderRequestCommandHandlerTests()
    {
        _pricesRepositoryMock = new Mock<IPlanPriceRepository>();
        _ordersRepositoryMock = new Mock<IOrderRequestRepository>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
    }

    [Fact]
    public async Task CreateOrder_PriceNotFound_ThrowsNotFoundException()
    {
        // Arrange
        var handler = new CreateOrderRequestCommandHandler(_pricesRepositoryMock.Object, _ordersRepositoryMock.Object, _unitOfWorkMock.Object);
        var command = new CreateOrderRequestCommand(Guid.NewGuid(), "Monthly", "John Doe", "john@example.com", "12345678", null);

        _pricesRepositoryMock.Setup(repo => repo.GetByPlanIdAsync(command.ServicePlanId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<PlanPrice>()); // Empty list

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task CreateOrder_PriceFound_CreatesOrderAndSaves()
    {
        // Arrange
        var handler = new CreateOrderRequestCommandHandler(_pricesRepositoryMock.Object, _ordersRepositoryMock.Object, _unitOfWorkMock.Object);
        var planId = Guid.NewGuid();
        var priceId = Guid.NewGuid();
        var command = new CreateOrderRequestCommand(planId, "Monthly", "John Doe ", "john@example.com", "12345678", "Company ");

        var planPrices = new List<PlanPrice>
        {
            new PlanPrice { Id = priceId, PlanId = planId, BillingCycle = "Monthly", Price = 99.99m }
        };

        _pricesRepositoryMock.Setup(repo => repo.GetByPlanIdAsync(planId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(planPrices);

        _ordersRepositoryMock.Setup(repo => repo.AddAsync(It.IsAny<OrderRequest>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotEqual(Guid.Empty, result);
        _ordersRepositoryMock.Verify(repo => repo.AddAsync(It.Is<OrderRequest>(o =>
            o.PlanPriceId == priceId &&
            o.CustomerName == "John Doe" &&
            o.CustomerEmail == "john@example.com" &&
            o.CustomerPhone == "12345678" &&
            o.CompanyName == "Company"
        ), It.IsAny<CancellationToken>()), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task DeleteOrder_OrderNotFound_ThrowsNotFoundException()
    {
        // Arrange
        var handler = new DeleteOrderRequestCommandHandler(_ordersRepositoryMock.Object, _unitOfWorkMock.Object);
        var command = new DeleteOrderRequestCommand(Guid.NewGuid());

        _ordersRepositoryMock.Setup(repo => repo.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((OrderRequest?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task DeleteOrder_OrderFound_DeletesAndSaves()
    {
        // Arrange
        var handler = new DeleteOrderRequestCommandHandler(_ordersRepositoryMock.Object, _unitOfWorkMock.Object);
        var orderId = Guid.NewGuid();
        var command = new DeleteOrderRequestCommand(orderId);
        var order = new OrderRequest { Id = orderId };

        _ordersRepositoryMock.Setup(repo => repo.GetByIdAsync(orderId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(order);

        _ordersRepositoryMock.Setup(repo => repo.Delete(order));
        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        await handler.Handle(command, CancellationToken.None);

        // Assert
        _ordersRepositoryMock.Verify(repo => repo.Delete(order), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ChangeStatus_InvalidStatus_ThrowsBadRequestException()
    {
        // Arrange
        var handler = new ChangeOrderStatusCommandHandler(_ordersRepositoryMock.Object, _unitOfWorkMock.Object);
        var command = new ChangeOrderStatusCommand(Guid.NewGuid(), "InvalidStatus");

        // Act & Assert
        await Assert.ThrowsAsync<BadRequestException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task ChangeStatus_OrderNotFound_ThrowsNotFoundException()
    {
        // Arrange
        var handler = new ChangeOrderStatusCommandHandler(_ordersRepositoryMock.Object, _unitOfWorkMock.Object);
        var command = new ChangeOrderStatusCommand(Guid.NewGuid(), "Completed");

        _ordersRepositoryMock.Setup(repo => repo.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((OrderRequest?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task ChangeStatus_ValidRequest_UpdatesStatusAndSaves()
    {
        // Arrange
        var handler = new ChangeOrderStatusCommandHandler(_ordersRepositoryMock.Object, _unitOfWorkMock.Object);
        var orderId = Guid.NewGuid();
        var command = new ChangeOrderStatusCommand(orderId, "Completed");
        var order = new OrderRequest { Id = orderId, Status = OrderStatus.New };

        _ordersRepositoryMock.Setup(repo => repo.GetByIdAsync(orderId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(order);

        _ordersRepositoryMock.Setup(repo => repo.Update(order));
        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.Equal(OrderStatus.Completed, order.Status);
        _ordersRepositoryMock.Verify(repo => repo.Update(order), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
