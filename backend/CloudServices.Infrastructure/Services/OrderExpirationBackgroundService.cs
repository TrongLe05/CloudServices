using CloudServices.Domain.Enums;
using CloudServices.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CloudServices.Infrastructure.Services;

public class OrderExpirationBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<OrderExpirationBackgroundService> _logger;
    private readonly TimeSpan _checkInterval = TimeSpan.FromSeconds(30);
    private readonly TimeSpan _expirationTimeout = TimeSpan.FromMinutes(5);

    public OrderExpirationBackgroundService(
        IServiceProvider serviceProvider,
        ILogger<OrderExpirationBackgroundService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("OrderExpirationBackgroundService đã khởi chạy.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await CheckAndExpireOrdersAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Đã xảy ra lỗi khi kiểm tra đơn hàng hết hạn thanh toán.");
            }

            await Task.Delay(_checkInterval, stoppingToken);
        }
    }

    private async Task CheckAndExpireOrdersAsync(CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var now = DateTime.UtcNow;
        var thresholdTime = now - _expirationTimeout;

        // Truy vấn các đơn hàng New trực tiếp qua DbContext (được Change Tracker theo dõi trực tiếp)
        var pendingOrders = await context.OrderRequests
            .Where(o => o.Status == OrderStatus.New)
            .ToListAsync(cancellationToken);

        var hasChanges = false;

        foreach (var order in pendingOrders)
        {
            var baseTime = order.LastModifiedAt ?? order.CreatedAt;
            if (baseTime < thresholdTime)
            {
                order.Status = OrderStatus.Rejected;
                var note = string.IsNullOrEmpty(order.Notes)
                    ? "[Tự động từ chối do quá hạn thanh toán 5 phút]"
                    : $"{order.Notes} [Hết hạn thanh toán 5p]";
                order.Notes = note;
                hasChanges = true;

                _logger.LogInformation("Đơn hàng {OrderId} ({CustomerName}) đã tự động chuyển sang trạng thái Từ chối do quá 5 phút chưa thanh toán.",
                    order.Id, order.CustomerName);
            }
        }

        if (hasChanges)
        {
            await context.SaveChangesAsync(cancellationToken);
        }
    }
}
