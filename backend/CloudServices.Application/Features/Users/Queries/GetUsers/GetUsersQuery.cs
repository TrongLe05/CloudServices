using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Users.DTOs;
using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CloudServices.Application.Features.Users.Queries.GetUsers;

public sealed record GetUsersQuery(
    string? Search = null,
    Guid? RoleId = null,
    int Page = 1,
    int PageSize = 10
) : IRequest<UserPageDto>;

public sealed class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, UserPageDto>
{
    private readonly IUserRepository _userRepository;

    public GetUsersQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserPageDto> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var page = request.Page > 0 ? request.Page : 1;
        var pageSize = request.PageSize > 0 ? request.PageSize : 10;

        var (items, totalItems) = await _userRepository.GetPagedUsersAsync(
            request.Search,
            request.RoleId,
            page,
            pageSize,
            cancellationToken);

        var userDtos = items.Select(u => new UserDto(
            u.Id,
            u.Username,
            u.FullName,
            u.Email,
            u.AvatarUrl,
            u.RoleId,
            u.Role?.Name ?? "User",
            u.IsActive,
            u.CreatedAt,
            u.LastModifiedAt
        )).ToList();

        var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        return new UserPageDto(userDtos, totalItems, page, pageSize, totalPages);
    }
}
