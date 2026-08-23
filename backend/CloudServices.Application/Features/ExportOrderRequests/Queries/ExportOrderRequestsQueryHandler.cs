using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using MediatR;

namespace CloudServices.Application.Features.ExportOrderRequests.Queries;

public sealed class ExportOrderRequestsQueryHandler(
    IOrderRequestRepository repository,
    IExcelExporter excelExporter) : IRequestHandler<ExportOrderRequestsQuery, byte[]>
{
    public async Task<byte[]> Handle(ExportOrderRequestsQuery request, CancellationToken cancellationToken)
    {
        // Lấy danh sách Order Requests từ repository (hoặc lọc theo status/search nếu muốn)
        var orders = await repository.GetAllAsync(cancellationToken);

        return excelExporter.ExportOrderRequests(orders);
    }
}
