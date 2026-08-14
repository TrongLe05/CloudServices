namespace CloudServices.Application.Features.Users.Commands.ChangePassword;

public record ChangePasswordDto(string OldPassword, string NewPassword);
