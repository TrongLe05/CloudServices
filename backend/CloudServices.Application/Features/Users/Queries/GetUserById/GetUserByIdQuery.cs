using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Users.DTOs;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CloudServices.Application.Features.Users.Queries.GetUserById;

public sealed record GetUserByIdQuery(Guid Id) : IRequest<UserDto>;

public sealed class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, UserDto>
{
    private readonly IUserRepository _userRepository;

    public GetUserByIdQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserDto> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.Id, cancellationToken);
        if (user == null)
        {
            throw new NotFoundException("Người dùng", request.Id);
        }

        return new UserDto(
            user.Id,
            user.Username,
            user.FullName,
            user.Email,
            user.AvatarUrl,
            user.RoleId,
            user.Role?.Name ?? "User",
            user.IsActive,
            user.CreatedAt,
            user.LastModifiedAt
        );
    }
}
