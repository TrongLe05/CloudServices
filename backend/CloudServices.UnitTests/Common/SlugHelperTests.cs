using CloudServices.Application.Common.Helpers;
using Xunit;

namespace CloudServices.UnitTests.Common;

public class SlugHelperTests
{
    [Theory]
    [InlineData("Cloud Server Cao Cấp 2026", "cloud-server-cao-cap-2026")]
    [InlineData("Dịch vụ Đám mây & Hosting Giá Rẻ!", "dich-vu-dam-may-hosting-gia-re")]
    [InlineData("  Khoảng   Trắng   Nhiều   ", "khoang-trang-nhieu")]
    [InlineData("Ký tự đặc biệt @#$%^&*()_+", "ky-tu-dac-biet")]
    [InlineData("Tiếng Việt Có Dấu: Ơ, Ư, Đ, Ê, Ô, Â, Ă", "tieng-viet-co-dau-o-u-d-e-o-a-a")]
    [InlineData("SingleWord", "singleword")]
    [InlineData("", "")]
    [InlineData("   ", "")]
    [InlineData(null, "")]
    public void GenerateSlug_VariousInputs_ReturnsExpectedSlug(string? input, string expected)
    {
        // Act
        var result = SlugHelper.GenerateSlug(input!);

        // Assert
        Assert.Equal(expected, result);
    }
}
