using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CloudServices.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IApplicationDbContext _context;
    public UserRepository(IApplicationDbContext context)
    {
        _context = context;
    }
    public async Task AddAsync(AppUser user, CancellationToken cancellationToken)
    {
        await _context.AppUsers.AddAsync(user, cancellationToken);
    }
    public async Task<AppUser?> GetByIdAsync(Guid Id, CancellationToken cancellationToken)
    {
        return await _context.AppUsers.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == Id, cancellationToken);
    }
    public async Task<AppUser?> GetByEmailAsync(string email, CancellationToken cancellationToken)
    {
        return await _context.AppUsers.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
    }
    public async Task<AppUser?> GetByUsernameAsync(string username, CancellationToken cancellationToken)
    {
        return await _context.AppUsers.Include(u => u.Role).FirstOrDefaultAsync(u => u.Username == username, cancellationToken);
    }
}
