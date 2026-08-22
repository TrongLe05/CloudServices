using CloudServices.Application.Features.Statistics.Queries.GetDashboardStatistics;
using CloudServices.Application.Features.Statistics.Queries.GetOrderStatistics;
using CloudServices.Application.Features.Statistics.Queries.GetPopularPlans;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudServices.API.Controllers;

[Authorize(Roles = "Admin")]
public class StatisticsController : ApiControllerBase
{
    /// <summary>
    /// Thống kê tổng hợp cho Dashboard quản trị
    /// </summary>
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardStatistics(CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(new GetDashboardStatisticsQuery(), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Thống kê số lượng đơn đặt hàng theo tháng
    /// </summary>
    [HttpGet("orders")]
    public async Task<IActionResult> GetOrderStatistics(
        [FromQuery] string? from,
        [FromQuery] string? to,
        CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(new GetOrderStatisticsQuery(from, to), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Thống kê danh sách các gói dịch vụ được quan tâm nhất
    /// </summary>
    [HttpGet("popular-plans")]
    public async Task<IActionResult> GetPopularPlans(
        [FromQuery] int top = 5,
        CancellationToken cancellationToken = default)
    {
        var result = await Mediator.Send(new GetPopularPlansQuery(top), cancellationToken);
        return Ok(result);
    }
}