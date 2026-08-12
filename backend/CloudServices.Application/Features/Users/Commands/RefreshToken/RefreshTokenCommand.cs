using MediatR;

namespace CloudServices.Application.Features.Users.Commands.RefreshToken;

public record RefreshTokenCommand(string ExpiredAccessToken, string RefreshToken) : IRequest<RefreshTokenCommandResponse>;
