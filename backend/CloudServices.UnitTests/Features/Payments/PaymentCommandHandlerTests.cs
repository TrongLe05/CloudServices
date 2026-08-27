using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Exceptions.BadRequestException;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Payments.Commands.CreatePayOSLink;
using CloudServices.Application.Features.Payments.Commands.ProcessPayOSWebhook;
using CloudServices.Domain.Entities;
using CloudServices.Domain.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace CloudServices.UnitTests.Features.Payments;

public class PaymentCommandHandlerTests
{
    private readonly Mock<IOrderRequestRepository> _orderRepositoryMock;
    private readonly Mock<IPaymentGateway> _paymentGatewayMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IConfiguration> _configurationMock;
    private readonly Mock<ICacheService> _cacheMock;
    private readonly Mock<IEmailSender> _emailSenderMock;
    private readonly Mock<IEmailTemplateService> _emailTemplateServiceMock;
    private readonly Mock<ILogger<ProcessPayOSWebhookCommandHandler>> _loggerMock;

    public PaymentCommandHandlerTests()
    {
        _orderRepositoryMock = new Mock<IOrderRequestRepository>();
        _paymentGatewayMock = new Mock<IPaymentGateway>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _configurationMock = new Mock<IConfiguration>();
        _cacheMock = new Mock<ICacheService>();
        _emailSenderMock = new Mock<IEmailSender>();
        _emailTemplateServiceMock = new Mock<IEmailTemplateService>();
        _loggerMock = new Mock<ILogger<ProcessPayOSWebhookCommandHandler>>();

        _configurationMock.Setup(c => c["AppSettings:FrontendUrl"]).Returns("http://localhost:3000");
    }

    #region CreatePayOSLinkCommandHandler Tests

    [Fact]
    public async Task CreatePayOSLink_WhenCachedResponseExists_ReturnsCachedResponseWithoutCallingGatewayOrDB()
    {
        // Arrange
        var orderId = Guid.NewGuid();
        var cached = new CreatePayOSLinkResponse(
            "https://pay.payos.vn/web/123",
            123456789,
            500000,
            "DH123456",
            "qr-string",
            "987654321",
            "CONG TY CLOUD SERVICES",
            "970422",
            "https://img.vietqr.io/123"
        );

        _cacheMock.Setup(c => c.GetAsync<CreatePayOSLinkResponse>($"payos_link_{orderId}", It.IsAny<CancellationToken>()))
            .ReturnsAsync(cached);

        var handler = new CreatePayOSLinkCommandHandler(
            _orderRepositoryMock.Object,
            _paymentGatewayMock.Object,
            _unitOfWorkMock.Object,
            _configurationMock.Object,
            _cacheMock.Object
        );

        // Act
        var result = await handler.Handle(new CreatePayOSLinkCommand(orderId), CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(cached.CheckoutUrl, result.CheckoutUrl);
        Assert.Equal(cached.OrderCode, result.OrderCode);
        _orderRepositoryMock.Verify(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()), Times.Never);
        _paymentGatewayMock.Verify(g => g.CreatePaymentLinkAsync(
            It.IsAny<long>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task CreatePayOSLink_OrderNotFound_ThrowsNotFoundException()
    {
        // Arrange
        var orderId = Guid.NewGuid();
        _cacheMock.Setup(c => c.GetAsync<CreatePayOSLinkResponse>(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((CreatePayOSLinkResponse?)null);
        _orderRepositoryMock.Setup(r => r.GetByIdAsync(orderId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((OrderRequest?)null);

        var handler = new CreatePayOSLinkCommandHandler(
            _orderRepositoryMock.Object,
            _paymentGatewayMock.Object,
            _unitOfWorkMock.Object,
            _configurationMock.Object,
            _cacheMock.Object
        );

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(new CreatePayOSLinkCommand(orderId), CancellationToken.None));
    }

    [Fact]
    public async Task CreatePayOSLink_OrderStatusNotNew_ThrowsBadRequestException()
    {
        // Arrange
        var orderId = Guid.NewGuid();
        var order = new OrderRequest
        {
            Id = orderId,
            Status = OrderStatus.Processing
        };

        _cacheMock.Setup(c => c.GetAsync<CreatePayOSLinkResponse>(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((CreatePayOSLinkResponse?)null);
        _orderRepositoryMock.Setup(r => r.GetByIdAsync(orderId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(order);

        var handler = new CreatePayOSLinkCommandHandler(
            _orderRepositoryMock.Object,
            _paymentGatewayMock.Object,
            _unitOfWorkMock.Object,
            _configurationMock.Object,
            _cacheMock.Object
        );

        // Act & Assert
        await Assert.ThrowsAsync<BadRequestException>(() => handler.Handle(new CreatePayOSLinkCommand(orderId), CancellationToken.None));
    }

    [Fact]
    public async Task CreatePayOSLink_AmountZeroOrLess_ThrowsBadRequestException()
    {
        // Arrange
        var orderId = Guid.NewGuid();
        var order = new OrderRequest
        {
            Id = orderId,
            Status = OrderStatus.New,
            PlanPrice = new PlanPrice { Price = 0 }
        };

        _cacheMock.Setup(c => c.GetAsync<CreatePayOSLinkResponse>(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((CreatePayOSLinkResponse?)null);
        _orderRepositoryMock.Setup(r => r.GetByIdAsync(orderId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(order);

        var handler = new CreatePayOSLinkCommandHandler(
            _orderRepositoryMock.Object,
            _paymentGatewayMock.Object,
            _unitOfWorkMock.Object,
            _configurationMock.Object,
            _cacheMock.Object
        );

        // Act & Assert
        await Assert.ThrowsAsync<BadRequestException>(() => handler.Handle(new CreatePayOSLinkCommand(orderId), CancellationToken.None));
    }

    [Fact]
    public async Task CreatePayOSLink_ValidOrderWithDiscount_CallsGatewayAndSavesOrderAndCaches()
    {
        // Arrange
        var orderId = Guid.NewGuid();
        var order = new OrderRequest
        {
            Id = orderId,
            Status = OrderStatus.New,
            CustomerName = "Le Minh Trong",
            CustomerEmail = "trong@example.com",
            PlanPrice = new PlanPrice
            {
                Price = 1000000m,
                Plan = new ServicePlan { Name = "Cloud Server Pro" },
                Promotion = new Promotion
                {
                    IsActive = true,
                    DiscountPercentage = 20
                }
            }
        };

        _cacheMock.Setup(c => c.GetAsync<CreatePayOSLinkResponse>(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((CreatePayOSLinkResponse?)null);
        _orderRepositoryMock.Setup(r => r.GetByIdAsync(orderId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(order);

        var paymentLinkDto = new PaymentLinkDto(
            CheckoutUrl: "https://pay.payos.vn/web/test-checkout",
            OrderCode: 999888777,
            QrCode: "00020101021238540010A000000727...",
            AccountNumber: "1029384756",
            AccountName: "CONG TY CLOUD SERVICES",
            Bin: "970422"
        );

        _paymentGatewayMock.Setup(g => g.CreatePaymentLinkAsync(
            It.IsAny<long>(),
            800000, // 1,000,000 - 20% = 800,000
            It.IsAny<string>(),
            "Cloud Server Pro",
            It.IsAny<string>(),
            It.IsAny<string>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(paymentLinkDto);

        var handler = new CreatePayOSLinkCommandHandler(
            _orderRepositoryMock.Object,
            _paymentGatewayMock.Object,
            _unitOfWorkMock.Object,
            _configurationMock.Object,
            _cacheMock.Object
        );

        // Act
        var result = await handler.Handle(new CreatePayOSLinkCommand(orderId), CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(800000, result.Amount);
        Assert.Equal("https://pay.payos.vn/web/test-checkout", result.CheckoutUrl);
        Assert.Contains("PayOS:", order.Notes);
        _orderRepositoryMock.Verify(r => r.Update(order), Times.Once);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        _cacheMock.Verify(c => c.GetOrCreateAsync(
            $"payos_link_{orderId}",
            It.IsAny<Func<CancellationToken, Task<CreatePayOSLinkResponse>>>(),
            It.IsAny<TimeSpan?>(),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    #endregion

    #region ProcessPayOSWebhookCommandHandler Tests

    [Fact]
    public async Task ProcessPayOSWebhook_InvalidChecksum_ReturnsFalse()
    {
        // Arrange
        _paymentGatewayMock.Setup(g => g.VerifyWebhook(It.IsAny<object>()))
            .Returns(new WebhookVerificationResult(false, 0, string.Empty));

        var handler = new ProcessPayOSWebhookCommandHandler(
            _paymentGatewayMock.Object,
            _orderRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _emailSenderMock.Object,
            _emailTemplateServiceMock.Object,
            _configurationMock.Object,
            _cacheMock.Object,
            _loggerMock.Object
        );

        // Act
        var result = await handler.Handle(new ProcessPayOSWebhookCommand(new { }), CancellationToken.None);

        // Assert
        Assert.False(result);
        _orderRepositoryMock.Verify(r => r.GetByPayOsOrderCodeAsync(It.IsAny<long>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task ProcessPayOSWebhook_ValidPaymentSuccess_UpdatesOrderStatusToProcessingAndClearsCache()
    {
        // Arrange
        long orderCode = 123456789;
        var orderId = Guid.NewGuid();
        var order = new OrderRequest
        {
            Id = orderId,
            Status = OrderStatus.New,
            CustomerName = "Nguyen Van A",
            CustomerEmail = "a@example.com",
            PlanPrice = new PlanPrice
            {
                Price = 500000,
                BillingCycle = "Monthly",
                Plan = new ServicePlan { Name = "Cloud VPS 1" }
            }
        };

        _paymentGatewayMock.Setup(g => g.VerifyWebhook(It.IsAny<object>()))
            .Returns(new WebhookVerificationResult(true, orderCode, "00"));

        _orderRepositoryMock.Setup(r => r.GetByPayOsOrderCodeAsync(orderCode, It.IsAny<CancellationToken>()))
            .ReturnsAsync(order);

        _emailTemplateServiceMock.Setup(s => s.GeneratePaymentSuccessEmail(
            It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<decimal>(), It.IsAny<string?>(), It.IsAny<string>()))
            .Returns("<html>Email Content</html>");

        var handler = new ProcessPayOSWebhookCommandHandler(
            _paymentGatewayMock.Object,
            _orderRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _emailSenderMock.Object,
            _emailTemplateServiceMock.Object,
            _configurationMock.Object,
            _cacheMock.Object,
            _loggerMock.Object
        );

        // Act
        var result = await handler.Handle(new ProcessPayOSWebhookCommand(new { }), CancellationToken.None);

        // Assert
        Assert.True(result);
        Assert.Equal(OrderStatus.Processing, order.Status);
        _orderRepositoryMock.Verify(r => r.Update(order), Times.Once);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        _cacheMock.Verify(c => c.Remove($"payos_link_{orderId}"), Times.Once);
        _emailSenderMock.Verify(e => e.SendEmailAsync(order.CustomerEmail, It.IsAny<string>(), It.IsAny<string>()), Times.Once);
    }

    [Fact]
    public async Task ProcessPayOSWebhook_CodeNotSuccess_DoesNotUpdateOrder()
    {
        // Arrange
        _paymentGatewayMock.Setup(g => g.VerifyWebhook(It.IsAny<object>()))
            .Returns(new WebhookVerificationResult(true, 123456789, "01")); // Non-00 code

        var handler = new ProcessPayOSWebhookCommandHandler(
            _paymentGatewayMock.Object,
            _orderRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _emailSenderMock.Object,
            _emailTemplateServiceMock.Object,
            _configurationMock.Object,
            _cacheMock.Object,
            _loggerMock.Object
        );

        // Act
        var result = await handler.Handle(new ProcessPayOSWebhookCommand(new { }), CancellationToken.None);

        // Assert
        Assert.True(result); // Webhook checksum is valid so handler acknowledges receipt
        _orderRepositoryMock.Verify(r => r.GetByPayOsOrderCodeAsync(It.IsAny<long>(), It.IsAny<CancellationToken>()), Times.Never);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    #endregion
}
