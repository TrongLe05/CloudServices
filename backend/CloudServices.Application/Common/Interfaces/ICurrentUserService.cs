namespace CloudServices.Application.Common.Interfaces;

public interface ICurrentUserService
{
    Guid? UserId { get; }
    string? Username { get; }
    string? UserRole { get; }
    string? IpAddress { get; }
    string? UserAgent { get; }
}
