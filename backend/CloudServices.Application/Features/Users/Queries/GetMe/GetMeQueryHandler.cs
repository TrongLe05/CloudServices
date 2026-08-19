using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces.Repositories;
using MediatR;

namespace CloudServices.Application.Features.Users.Queries.GetMe;

public sealed class GetMeQueryHandler(IUserRepository userRepository) : IRequestHandler<GetMeQuery, GetMeResponse>
{
    public async Task<GetMeResponse> Handle(GetMeQuery request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByIdAsync(request.userId, cancellationToken)
             ?? throw new NotFoundException("Người dùng không tồn tại");

        return new GetMeResponse(
             user.Id,
            user.Username,
            user.Email,
            user.FullName,
            user.AvatarUrl,
            user.Role.Name,
            user.IsActive
            );
    }
}
