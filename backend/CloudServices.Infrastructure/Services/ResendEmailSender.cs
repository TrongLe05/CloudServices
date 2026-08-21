using CloudServices.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace CloudServices.Infrastructure.Services;

public sealed class ResendEmailSender(HttpClient http, IConfiguration configuration) : IEmailSender
{
    public async Task SendEmailAsync(string email, string subject, string htmlContent)
    {
        var apiKey = configuration["Resend:ApiKey"];
        var sender = configuration["Resend:Sender"];

        var payload = new
        {
            from = $"CloudServices <{sender}>",
            to = new[] { email },
            subject = subject,
            html = htmlContent
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.resend.com/emails");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

        var jsonPayload = JsonSerializer.Serialize(payload);
        request.Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

        // 3. Thực hiện gửi và kiểm tra phản hồi
        var response = await http.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new Exception($"Gửi mail qua Resend thất bại: {response.StatusCode} - {errorContent}");
        }

    }
}
