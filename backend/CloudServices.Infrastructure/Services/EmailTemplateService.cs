using System.Globalization;
using CloudServices.Application.Common.Interfaces;

namespace CloudServices.Infrastructure.Services;

public class EmailTemplateService : IEmailTemplateService
{
    private const string BrandLogoSvg = @"
        <svg width=""36"" height=""36"" viewBox=""0 0 24 24"" fill=""none"" stroke=""#ffffff"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round"" style=""vertical-align: middle;"">
            <path d=""M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z""/>
        </svg>";

    public string GenerateOtpEmail(string otpCode)
    {
        return $@"
<!DOCTYPE html>
<html lang=""vi"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Mã xác thực OTP - CloudServices</title>
</head>
<body style=""margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #1e293b;"">
    <table width=""100%"" cellpadding=""0"" cellspacing=""0"" border=""0"" style=""background-color: #f1f5f9; padding: 40px 16px;"">
        <tr>
            <td align=""center"">
                <!-- Main Container -->
                <table width=""100%"" cellpadding=""0"" cellspacing=""0"" border=""0"" style=""max-width: 540px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e2e8f0;"">
                    
                    <!-- Header -->
                    <tr>
                        <td style=""background: linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%); padding: 32px 24px; text-align: center;"">
                            <div style=""display: inline-block; margin-bottom: 8px;"">
                                {BrandLogoSvg}
                            </div>
                            <h1 style=""color: #ffffff; margin: 4px 0 0 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;"">CloudServices</h1>
                            <p style=""color: #bfdbfe; margin: 4px 0 0 0; font-size: 13px; font-weight: 500;"">Nền tảng Dịch vụ Điện toán Đám mây Hàng đầu</p>
                        </td>
                    </tr>
                    
                    <!-- Body Content -->
                    <tr>
                        <td style=""padding: 36px 28px;"">
                            <div style=""display: inline-block; padding: 6px 12px; background-color: #eff6ff; border: 1px solid #dbeafe; border-radius: 9999px; color: #2563eb; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;"">
                                Xác thực tài khoản
                            </div>
                            <h2 style=""margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #0f172a;"">Yêu Cầu Đặt Lại Mật Khẩu</h2>
                            <p style=""margin: 0 0 20px 0; font-size: 15px; color: #475569; line-height: 1.6;"">
                                Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã xác thực (OTP) an toàn dưới đây để hoàn tất:
                            </p>
                            
                            <!-- OTP Box -->
                            <div style=""text-align: center; margin: 28px 0; background: #f8fafc; border: 2px dashed #93c5fd; border-radius: 12px; padding: 24px 16px;"">
                                <span style=""display: inline-block; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1d4ed8; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;"">
                                    {otpCode}
                                </span>
                                <div style=""margin-top: 8px; font-size: 13px; color: #64748b;"">
                                    ⏱️ Mã có hiệu lực trong vòng <strong>5 phút</strong>
                                </div>
                            </div>
                            
                            <!-- Security Warning -->
                            <div style=""background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 12px 16px; margin: 24px 0 0 0;"">
                                <p style=""margin: 0; font-size: 13px; color: #92400e; line-height: 1.5;"">
                                    <strong>Lưu ý bảo mật:</strong> Tuyệt đối không chia sẻ mã này cho bất kỳ ai. Đội ngũ CloudServices sẽ không bao giờ yêu cầu cung cấp mã OTP của bạn.
                                </p>
                            </div>

                            <p style=""margin: 20px 0 0 0; font-size: 13px; color: #94a3b8; line-height: 1.5;"">
                                Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email hoặc liên hệ với bộ phận hỗ trợ của chúng tôi để được trợ giúp.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style=""background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #f1f5f9;"">
                            <p style=""margin: 0 0 6px 0; font-size: 13px; font-weight: 600; color: #475569;"">
                                CloudServices - Hạ Tầng Đám Mây Tốc Độ Cao
                            </p>
                            <p style=""margin: 0; font-size: 12px; color: #94a3b8;"">
                                &copy; {DateTime.UtcNow.Year} CloudServices Inc. Mọi quyền được bảo lưu.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>";
    }

    public string GeneratePaymentSuccessEmail(
        string customerName,
        string orderCode,
        string planName,
        string billingCycle,
        decimal amount,
        string? notes = null,
        string? frontendUrl = null)
    {
        var formattedAmount = amount.ToString("N0", new CultureInfo("vi-VN")) + " VNĐ";
        var redirectUrl = !string.IsNullOrEmpty(frontendUrl) ? $"{frontendUrl}/don-hang" : "https://cloudservices.vn/don-hang";

        return $@"
<!DOCTYPE html>
<html lang=""vi"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Thanh Toán Thành Công - CloudServices</title>
</head>
<body style=""margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #1e293b;"">
    <table width=""100%"" cellpadding=""0"" cellspacing=""0"" border=""0"" style=""background-color: #f1f5f9; padding: 40px 16px;"">
        <tr>
            <td align=""center"">
                <!-- Main Container -->
                <table width=""100%"" cellpadding=""0"" cellspacing=""0"" border=""0"" style=""max-width: 580px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e2e8f0;"">
                    
                    <!-- Header -->
                    <tr>
                        <td style=""background: linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%); padding: 32px 24px; text-align: center;"">
                            <div style=""display: inline-block; margin-bottom: 8px;"">
                                {BrandLogoSvg}
                            </div>
                            <h1 style=""color: #ffffff; margin: 4px 0 0 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;"">CloudServices</h1>
                            <p style=""color: #bfdbfe; margin: 4px 0 0 0; font-size: 13px; font-weight: 500;"">Hệ Thống Điện Toán Đám Mây & Máy Chủ Tốc Độ Cao</p>
                        </td>
                    </tr>
                    
                    <!-- Body Content -->
                    <tr>
                        <td style=""padding: 36px 28px;"">
                            
                            <!-- Success Badge -->
                            <div style=""text-align: center; margin-bottom: 24px;"">
                                <div style=""display: inline-flex; align-items: center; padding: 8px 18px; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 9999px; color: #059669; font-size: 14px; font-weight: 700;"">
                                    <span style=""font-size: 18px; margin-right: 6px;"">✓</span> Thanh toán thành công
                                </div>
                                <h2 style=""margin: 14px 0 6px 0; font-size: 22px; font-weight: 800; color: #0f172a;"">
                                    Đơn Hàng Đang Được Triển Khai!
                                </h2>
                                <p style=""margin: 0; font-size: 14px; color: #64748b;"">
                                    Mã giao dịch: <strong style=""color: #1e293b;"">#{orderCode}</strong>
                                </p>
                            </div>

                            <p style=""margin: 0 0 20px 0; font-size: 15px; color: #334155; line-height: 1.6;"">
                                Kính gửi <strong>{customerName}</strong>,<br>
                                Cảm ơn Quý khách đã tin tưởng và sử dụng dịch vụ tại <strong>CloudServices</strong>. Chúng tôi đã nhận được thanh toán đầy đủ cho đơn hàng của Quý khách. Đội ngũ kỹ thuật đang tự động khởi tạo hạ tầng và chuẩn bị bàn giao dịch vụ.
                            </p>

                            <!-- Order Details Box -->
                            <table width=""100%"" cellpadding=""0"" cellspacing=""0"" border=""0"" style=""background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin: 24px 0; overflow: hidden;"">
                                <tr>
                                    <td colspan=""2"" style=""background-color: #f1f5f9; padding: 12px 18px; font-weight: 700; font-size: 13px; color: #334155; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0;"">
                                        Chi tiết đơn hàng
                                    </td>
                                </tr>
                                <tr>
                                    <td style=""padding: 12px 18px; font-size: 14px; color: #64748b; border-bottom: 1px solid #f1f5f9;"">Gói dịch vụ:</td>
                                    <td style=""padding: 12px 18px; font-size: 14px; font-weight: 700; color: #0f172a; text-align: right; border-bottom: 1px solid #f1f5f9;"">{planName}</td>
                                </tr>
                                <tr>
                                    <td style=""padding: 12px 18px; font-size: 14px; color: #64748b; border-bottom: 1px solid #f1f5f9;"">Chu kỳ sử dụng:</td>
                                    <td style=""padding: 12px 18px; font-size: 14px; font-weight: 600; color: #0f172a; text-align: right; border-bottom: 1px solid #f1f5f9;"">{billingCycle}</td>
                                </tr>
                                <tr>
                                    <td style=""padding: 12px 18px; font-size: 14px; color: #64748b; border-bottom: 1px solid #f1f5f9;"">Số tiền thanh toán:</td>
                                    <td style=""padding: 12px 18px; font-size: 16px; font-weight: 800; color: #059669; text-align: right; border-bottom: 1px solid #f1f5f9;"">{formattedAmount}</td>
                                </tr>
                                <tr>
                                    <td style=""padding: 12px 18px; font-size: 14px; color: #64748b;"">Trạng thái:</td>
                                    <td style=""padding: 12px 18px; font-size: 14px; font-weight: 700; color: #2563eb; text-align: right;"">Đang khởi tạo (Processing)</td>
                                </tr>
                            </table>

                            <!-- Next Steps Guide -->
                            <div style=""background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 6px; padding: 14px 16px; margin-bottom: 28px;"">
                                <h4 style=""margin: 0 0 6px 0; font-size: 14px; color: #1e40af; font-weight: 700;"">📌 Các bước tiếp theo:</h4>
                                <p style=""margin: 0; font-size: 13px; color: #1e3a8a; line-height: 1.5;"">
                                    Hệ thống đang thiết lập môi trường máy chủ. Thông tin kết nối / IP truy cập sẽ được hiển thị trực tiếp trong trang quản lý đơn hàng của bạn ngay khi quá trình hoàn tất.
                                </p>
                            </div>

                            <!-- CTA Button -->
                            <div style=""text-align: center; margin: 30px 0 10px 0;"">
                                <a href=""{redirectUrl}"" style=""display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);"">
                                    Xem Lịch Sử Đơn Hàng →
                                </a>
                            </div>

                            <p style=""margin: 24px 0 0 0; font-size: 13px; color: #94a3b8; line-height: 1.5; text-align: center;"">
                                Cần hỗ trợ khẩn cấp? Liên hệ hotline kỹ thuật 24/7 hoặc phản hồi trực tiếp email này.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style=""background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #f1f5f9;"">
                            <p style=""margin: 0 0 6px 0; font-size: 13px; font-weight: 600; color: #475569;"">
                                CloudServices - Đơn Vị Cung Cấp Hạ Tầng Cloud Đáng Tin Cậy
                            </p>
                            <p style=""margin: 0; font-size: 12px; color: #94a3b8;"">
                                &copy; {DateTime.UtcNow.Year} CloudServices Inc. Mọi quyền được bảo lưu.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>";
    }
}
