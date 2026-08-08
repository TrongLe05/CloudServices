using CloudServices.Application.Common.Interfaces;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CloudServices.Application.Features.Users.Queries.GetUsers;

public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, List<UserDto>>
{
    private readonly IApplicationDbContext _context;
    public GetUsersQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<List<UserDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        return await _context.AppUsers
            .Include(u => u.Role)
            .ProjectToType<UserDto>()
            .ToListAsync(cancellationToken);
    }
}
