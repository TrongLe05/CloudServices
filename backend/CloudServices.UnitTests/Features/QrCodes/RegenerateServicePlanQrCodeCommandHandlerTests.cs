using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.QrCodes.Commands;
using CloudServices.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Moq;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace CloudServices.UnitTests.Features.QrCodes;

public class RegenerateServicePlanQrCodeCommandHandlerTests
{
    private readonly Mock<IServicePlanRepository> _repositoryMock;
    private readonly Mock<IQrCodeGenerator> _qrGeneratorMock;
    private readonly Mock<IConfiguration> _configurationMock;

    public RegenerateServicePlanQrCodeCommandHandlerTests()
    {
        _repositoryMock = new Mock<IServicePlanRepository>();
        _qrGeneratorMock = new Mock<IQrCodeGenerator>();
        _configurationMock = new Mock<IConfiguration>();
    }

    [Fact]
    public async Task Handle_PlanNotFound_ReturnsNull()
    {
        // Arrange
        var handler = new RegenerateServicePlanQrCodeCommandHandler(_repositoryMock.Object, _qrGeneratorMock.Object, _configurationMock.Object);
        var command = new RegenerateServicePlanQrCodeCommand(Guid.NewGuid());

        _repositoryMock.Setup(repo => repo.GetByIdAsync(command.ServicePlanId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((ServicePlan?)null);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task Handle_PlanFound_GeneratesQrCodeAndReturnsDto()
    {
        // Arrange
        var handler = new RegenerateServicePlanQrCodeCommandHandler(_repositoryMock.Object, _qrGeneratorMock.Object, _configurationMock.Object);
        var planId = Guid.NewGuid();
        var command = new RegenerateServicePlanQrCodeCommand(planId);
        var plan = new ServicePlan { Id = planId };
        var fakeQrBytes = new byte[] { 1, 2, 3, 4 };

        _repositoryMock.Setup(repo => repo.GetByIdAsync(planId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(plan);

        _qrGeneratorMock.Setup(g => g.GenerateQrCode(It.IsAny<string>()))
            .Returns(fakeQrBytes);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(planId, result.ServicePlanId);
        Assert.Contains("data:image/png;base64,", result.QrCodeBase64);
        Assert.Equal($"data:image/png;base64,{Convert.ToBase64String(fakeQrBytes)}", result.QrCodeBase64);

        _qrGeneratorMock.Verify(g => g.GenerateQrCode(It.IsAny<string>()), Times.Once);
    }
}
