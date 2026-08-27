using ClosedXML.Excel;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Domain.Entities;

namespace CloudServices.Infrastructure.Services;

public class ExcelExporter : IExcelExporter
{
    public byte[] ExportOrderRequests(IEnumerable<OrderRequest> orderRequests)
    {
        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("DanhSachYeuCauDatHang");

        // 1. Tạo Header
        var headers = new[]
        {
                "STT", "Mã Đơn", "Tên Khách Hàng", "Email", "Số Điện Thoại",
                "Công Ty", "Gói Dịch Vụ", "Trạng Thái", "Ngày Tạo", "Ghi Chú"
            };

        for (int i = 0; i < headers.Length; i++)
        {
            var cell = worksheet.Cell(1, i + 1);
            cell.Value = headers[i];
            cell.Style.Font.Bold = true;
            cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#2563EB"); // Màu Primary Blue
            cell.Style.Font.FontColor = XLColor.White;
            cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        }

        // 2. Đổ dữ liệu
        int row = 2;
        int index = 1;
        foreach (var order in orderRequests)
        {
            worksheet.Cell(row, 1).Value = index++;
            worksheet.Cell(row, 2).Value = order.Id.ToString();
            worksheet.Cell(row, 3).Value = order.CustomerName;
            worksheet.Cell(row, 4).Value = order.CustomerEmail;
            worksheet.Cell(row, 5).Value = order.CustomerPhone;
            worksheet.Cell(row, 6).Value = order.CompanyName ?? "N/A";
            worksheet.Cell(row, 7).Value = order.PlanPrice?.Plan?.Name ?? "N/A";
            worksheet.Cell(row, 8).Value = order.Status.ToString();
            worksheet.Cell(row, 9).Value = order.CreatedAt.ToString("dd/MM/yyyy HH:mm");
            worksheet.Cell(row, 10).Value = order.Notes ?? "";

            row++;
        }

        // Tự động giãn độ rộng cột & đóng khung border
        worksheet.Columns().AdjustToContents();
        worksheet.RangeUsed()?.Style.Border.SetOutsideBorder(XLBorderStyleValues.Thin);
        worksheet.RangeUsed()?.Style.Border.SetInsideBorder(XLBorderStyleValues.Thin);

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }

    public byte[] ExportAffiliateApplications(IEnumerable<AffiliateApplication> affiliates)
    {
        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("DanhSachCongTacVien");

        // 1. Tạo Header
        var headers = new[]
        {
                "STT", "Mã Đăng Ký", "Họ Và Tên", "Email", "Số Điện Thoại",
                "Website / Kênh", "Trạng Thái", "Ngày Đăng Ký", "Động Lực / Giới Thiệu"
            };

        for (int i = 0; i < headers.Length; i++)
        {
            var cell = worksheet.Cell(1, i + 1);
            cell.Value = headers[i];
            cell.Style.Font.Bold = true;
            cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#0D9488"); // Màu Teal/Green
            cell.Style.Font.FontColor = XLColor.White;
            cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        }

        // 2. Đổ dữ liệu
        int row = 2;
        int index = 1;
        foreach (var item in affiliates)
        {
            worksheet.Cell(row, 1).Value = index++;
            worksheet.Cell(row, 2).Value = item.Id.ToString();
            worksheet.Cell(row, 3).Value = item.FullName;
            worksheet.Cell(row, 4).Value = item.Email;
            worksheet.Cell(row, 5).Value = item.Phone;
            worksheet.Cell(row, 6).Value = item.WebsiteUrl ?? "N/A";
            worksheet.Cell(row, 7).Value = item.Status.ToString();
            worksheet.Cell(row, 8).Value = item.CreatedAt.ToString("dd/MM/yyyy HH:mm");
            worksheet.Cell(row, 9).Value = item.Motivation ?? "";

            row++;
        }

        worksheet.Columns().AdjustToContents();
        worksheet.RangeUsed()?.Style.Border.SetOutsideBorder(XLBorderStyleValues.Thin);
        worksheet.RangeUsed()?.Style.Border.SetInsideBorder(XLBorderStyleValues.Thin);

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }
}