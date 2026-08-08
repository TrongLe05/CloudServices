namespace CloudServices.Application.Features.Users.Queries.GetUsers;

public class UserDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    // Thuộc tính này sẽ tự động map với Role.Name của Entity nhờ cơ chế của Mapster
    public string RoleName { get; set; } = string.Empty;
}
