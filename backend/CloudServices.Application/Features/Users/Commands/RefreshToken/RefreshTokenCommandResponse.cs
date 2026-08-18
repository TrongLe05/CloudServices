namespace CloudServices.Application.Features.Users.Commands.RefreshToken;

public record RefreshTokenCommandResponse(string AccessToken, string RefreshToken, string Username);