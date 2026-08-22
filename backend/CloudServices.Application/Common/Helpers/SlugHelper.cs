using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace CloudServices.Application.Common.Helpers;

public static class SlugHelper
{
    public static string GenerateSlug(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return string.Empty;

        // 1. Lowercase
        var str = text.ToLowerInvariant();

        // 2. Thay chữ đ -> d
        str = str.Replace("đ", "d").Replace("Đ", "d");

        // 3. Chuẩn hóa NFD để loại bỏ dấu tiếng Việt
        var normalizedString = str.Normalize(NormalizationForm.FormD);
        var stringBuilder = new StringBuilder();

        foreach (var c in normalizedString)
        {
            var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
            if (unicodeCategory != UnicodeCategory.NonSpacingMark)
            {
                stringBuilder.Append(c);
            }
        }

        str = stringBuilder.ToString().Normalize(NormalizationForm.FormC);

        // 4. Thay thế khoảng trắng và ký tự không phải chữ/số thành dấu gạch ngang
        str = Regex.Replace(str, @"\s+", "-");
        str = Regex.Replace(str, @"[^a-z0-9\-]", "");
        str = Regex.Replace(str, @"-+", "-");

        return str.Trim('-');
    }
}
