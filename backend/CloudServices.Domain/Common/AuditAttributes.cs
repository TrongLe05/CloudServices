using System;

namespace CloudServices.Domain.Common;

/// <summary>
/// Đánh dấu Entity hoặc Property không ghi nhận vào Audit Log.
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Property)]
public sealed class IgnoreAuditAttribute : Attribute
{
}

/// <summary>
/// Đánh dấu Property chứa dữ liệu nhạy cảm (mật khẩu, khóa bảo mật, mã bí mật) cần được ẩn/loại bỏ khỏi Audit Log.
/// </summary>
[AttributeUsage(AttributeTargets.Property)]
public sealed class SensitiveAuditDataAttribute : Attribute
{
}
