using System.Globalization;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Statistics.DTOs;
using CloudServices.Domain.Enums;
using MediatR;

namespace CloudServices.Application.Features.Statistics.Queries.GetOrderStatistics;

public sealed class GetOrderStatisticsQueryHandler(IOrderRequestRepository orderRepository)
    : IRequestHandler<GetOrderStatisticsQuery, IReadOnlyList<MonthlyOrderStatisticDto>>
{
    public async Task<IReadOnlyList<MonthlyOrderStatisticDto>> Handle(
        GetOrderStatisticsQuery request,
        CancellationToken cancellationToken)
    {
        // 1. Xác định mốc thời gian mặc định (nếu không truyền thì lấy 6 tháng gần nhất)
        var now = DateTime.UtcNow;
        var defaultToDate = new DateTime(now.Year, now.Month, 1);
        var defaultFromDate = defaultToDate.AddMonths(-5); // 6 tháng tính cả tháng hiện tại

        DateTime startMonth = defaultFromDate;
        DateTime endMonth = defaultToDate;

        if (!string.IsNullOrWhiteSpace(request.From) &&
            DateTime.TryParseExact(request.From, "yyyy-MM", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedFrom))
        {
            startMonth = new DateTime(parsedFrom.Year, parsedFrom.Month, 1);
        }

        if (!string.IsNullOrWhiteSpace(request.To) &&
            DateTime.TryParseExact(request.To, "yyyy-MM", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedTo))
        {
            endMonth = new DateTime(parsedTo.Year, parsedTo.Month, 1);
        }

        // Đảm bảo startMonth <= endMonth
        if (startMonth > endMonth)
        {
            (startMonth, endMonth) = (endMonth, startMonth);
        }

        // 2. Tạo danh sách tất cả các tháng liên tục trong khoảng [startMonth, endMonth]
        var allMonths = new List<string>();
        var current = startMonth;
        while (current <= endMonth)
        {
            allMonths.Add(current.ToString("yyyy-MM"));
            current = current.AddMonths(1);
        }

        // 3. Lấy dữ liệu đơn hàng từ repository
        var allOrders = await orderRepository.GetAllAsync(cancellationToken);

        // Lọc các đơn nằm trong khoảng thời gian cần thống kê
        var endOfRange = endMonth.AddMonths(1); // Đầu tháng sau của endMonth
        var filteredOrders = allOrders
            .Where(x => x.CreatedAt >= startMonth && x.CreatedAt < endOfRange)
            .ToList();

        // 4. Nhóm đơn hàng theo "yyyy-MM"
        var groupedOrders = filteredOrders
            .GroupBy(x => x.CreatedAt.ToString("yyyy-MM"))
            .ToDictionary(g => g.Key, g => g.ToList());

        // 5. Kết hợp danh sách tháng với dữ liệu thống kê (Điền 0 cho tháng không có đơn)
        var result = allMonths.Select(monthKey =>
        {
            if (groupedOrders.TryGetValue(monthKey, out var ordersInMonth))
            {
                return new MonthlyOrderStatisticDto(
                    Month: monthKey,
                    TotalOrders: ordersInMonth.Count,
                    NewOrders: ordersInMonth.Count(x => x.Status == OrderStatus.New),
                    ProcessingOrders: ordersInMonth.Count(x => x.Status == OrderStatus.Processing),
                    CompletedOrders: ordersInMonth.Count(x => x.Status == OrderStatus.Completed),
                    RejectedOrders: ordersInMonth.Count(x => x.Status == OrderStatus.Rejected)
                );
            }

            // Tháng không có đơn hàng nào
            return new MonthlyOrderStatisticDto(
                Month: monthKey,
                TotalOrders: 0,
                NewOrders: 0,
                ProcessingOrders: 0,
                CompletedOrders: 0,
                RejectedOrders: 0
            );
        }).ToList();

        return result;
    }
}