using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.ServicePlans.Commands;
using CloudServices.Domain.Entities;
using Moq;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace CloudServices.UnitTests.Features.ServicePlans;

public class ServicePlanCommandHandlerTests
{
    private readonly Mock<IServicePlanRepository> _repositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ICacheService> _cacheMock;

    public ServicePlanCommandHandlerTests()
    {
        _repositoryMock = new Mock<IServicePlanRepository>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _cacheMock = new Mock<ICacheService>();
    }

    [Fact]
    public async Task CreateServicePlan_ValidRequest_CreatesAndSaves()
    {
        // Arrange
        var handler = new CreateServicePlanCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object, _cacheMock.Object);
        var catId = Guid.NewGuid();
        var command = new CreateServicePlanCommand(catId, "Cloud VPS 1 ", "Desc", "2 cores", "4GB", "50GB SSD", "100Mbps");

        _repositoryMock.Setup(repo => repo.AddAsync(It.IsAny<ServicePlan>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotEqual(Guid.Empty, result);
        _repositoryMock.Verify(repo => repo.AddAsync(It.Is<ServicePlan>(p =>
            p.CategoryId == catId &&
            p.Name == "Cloud VPS 1" &&
            p.Description == "Desc" &&
            p.Cpu == "2 cores" &&
            p.Ram == "4GB" &&
            p.Storage == "50GB SSD" &&
            p.Bandwidth == "100Mbps"
        ), It.IsAny<CancellationToken>()), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task DeleteServicePlan_NotFound_ThrowsNotFoundException()
    {
        // Arrange
        var handler = new DeleteServicePlanCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object, _cacheMock.Object);
        var command = new DeleteServicePlanCommand(Guid.NewGuid());

        _repositoryMock.Setup(repo => repo.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((ServicePlan?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task DeleteServicePlan_Found_DeletesAndSaves()
    {
        // Arrange
        var handler = new DeleteServicePlanCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object, _cacheMock.Object);
        var id = Guid.NewGuid();
        var command = new DeleteServicePlanCommand(id);
        var plan = new ServicePlan { Id = id };

        _repositoryMock.Setup(repo => repo.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(plan);
        _repositoryMock.Setup(repo => repo.Delete(plan));
        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        await handler.Handle(command, CancellationToken.None);

        // Assert
        _repositoryMock.Verify(repo => repo.Delete(plan), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UpdateServicePlan_NotFound_ThrowsNotFoundException()
    {
        // Arrange
        var handler = new UpdateServicePlanCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object, _cacheMock.Object);
        var command = new UpdateServicePlanCommand(Guid.NewGuid(), Guid.NewGuid(), "VPS", null, null, null, null, null);

        _repositoryMock.Setup(repo => repo.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((ServicePlan?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task UpdateServicePlan_Found_UpdatesAndSaves()
    {
        // Arrange
        var handler = new UpdateServicePlanCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object, _cacheMock.Object);
        var id = Guid.NewGuid();
        var catId = Guid.NewGuid();
        var command = new UpdateServicePlanCommand(id, catId, "VPS Pro ", "New Desc", "4 cores", "8GB", "100GB SSD", "1Gbps");
        var plan = new ServicePlan { Id = id, CategoryId = Guid.NewGuid(), Name = "VPS Basic" };

        _repositoryMock.Setup(repo => repo.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(plan);
        _repositoryMock.Setup(repo => repo.Update(plan));
        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.Equal(catId, plan.CategoryId);
        Assert.Equal("VPS Pro", plan.Name);
        Assert.Equal("New Desc", plan.Description);
        Assert.Equal("4 cores", plan.Cpu);
        Assert.Equal("8GB", plan.Ram);
        Assert.Equal("100GB SSD", plan.Storage);
        Assert.Equal("1Gbps", plan.Bandwidth);

        _repositoryMock.Verify(repo => repo.Update(plan), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
