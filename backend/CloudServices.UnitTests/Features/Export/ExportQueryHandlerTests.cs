using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.ExportAffiliates;
using CloudServices.Application.Features.ExportOrderRequests.Queries;
using CloudServices.Domain.Entities;
using CloudServices.Domain.Enums;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace CloudServices.UnitTests.Features.Export;

public class ExportQueryHandlerTests
{
    private readonly Mock<IAffiliateApplicationRepository> _affiliateRepoMock;
    private readonly Mock<IOrderRequestRepository> _orderRepoMock;
    private readonly Mock<IExcelExporter> _excelExporterMock;

    public ExportQueryHandlerTests()
    {
        _affiliateRepoMock = new Mock<IAffiliateApplicationRepository>();
        _orderRepoMock = new Mock<IOrderRequestRepository>();
        _excelExporterMock = new Mock<IExcelExporter>();
    }

    [Fact]
    public async Task ExportAffiliates_QueriesRepositoryAndReturnsExcelBytes()
    {
        // Arrange
        var handler = new ExportAffiliatesQueryHandler(_affiliateRepoMock.Object, _excelExporterMock.Object);
        var query = new ExportAffiliatesQuery(null, null);
        var affiliates = new List<AffiliateApplication>
        {
            new() { Id = Guid.NewGuid(), FullName = "CTV A", Email = "a@affiliate.vn", Phone = "0901234567", Status = AffiliateStatus.Approved }
        };
        var expectedBytes = new byte[] { 0x50, 0x4B, 0x03, 0x04 }; // Mock ZIP/XLSX header

        _affiliateRepoMock.Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(affiliates);

        _excelExporterMock.Setup(e => e.ExportAffiliateApplications(affiliates))
            .Returns(expectedBytes);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(expectedBytes, result);
        _affiliateRepoMock.Verify(r => r.GetAllAsync(It.IsAny<CancellationToken>()), Times.Once);
        _excelExporterMock.Verify(e => e.ExportAffiliateApplications(affiliates), Times.Once);
    }

    [Fact]
    public async Task ExportOrderRequests_QueriesRepositoryAndReturnsExcelBytes()
    {
        // Arrange
        var handler = new ExportOrderRequestsQueryHandler(_orderRepoMock.Object, _excelExporterMock.Object);
        var query = new ExportOrderRequestsQuery(null, null);
        var orders = new List<OrderRequest>
        {
            new() { Id = Guid.NewGuid(), CustomerName = "Khach Hang B", CustomerEmail = "b@customer.vn", CustomerPhone = "0912345678", Status = OrderStatus.New }
        };
        var expectedBytes = new byte[] { 0x50, 0x4B, 0x03, 0x04 };

        _orderRepoMock.Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(orders);

        _excelExporterMock.Setup(e => e.ExportOrderRequests(orders))
            .Returns(expectedBytes);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(expectedBytes, result);
        _orderRepoMock.Verify(r => r.GetAllAsync(It.IsAny<CancellationToken>()), Times.Once);
        _excelExporterMock.Verify(e => e.ExportOrderRequests(orders), Times.Once);
    }
}
