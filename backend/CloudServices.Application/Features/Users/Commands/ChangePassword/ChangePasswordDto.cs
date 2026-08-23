namespace CloudServices.Application.Features.Users.Commands.ChangePassword;

public record ForgotPasswordDto(string Email);
public record VerifyOtpDto(string Email, string Otp);
public record ResetPasswordDto(string ResetToken, string NewPassword);
