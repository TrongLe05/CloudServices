using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Users.DTOs;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CloudServices.Application.Features.Users.Queries.GetRoles;

public sealed record GetRolesQuery : IRequest<List<RoleDto>>;

public sealed class GetRolesQueryHandler : IRequestHandler<GetRolesQuery, List<RoleDto>>
{
    private readonly IRoleRepository _roleRepository;

    public GetRolesQueryHandler(IRoleRepository roleRepository)
    {
        _roleRepository = roleRepository;
    }

    public async Task<List<RoleDto>> Handle(GetRolesQuery request, CancellationToken cancellationToken)
    {
        var roles = await _roleRepository.GetAllAsync(cancellationToken);
        return roles.Select(r => new RoleDto(r.Id, r.Name, r.Description)).ToList();
    }
}
