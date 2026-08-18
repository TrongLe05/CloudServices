using CloudServices.Domain.Entities;

namespace CloudServices.Application.Common.Interfaces;

public interface IUserRepository
{
    Task<bool> UsernameExistsAsync(string username, CancellationToken cancellationToken = default);
    Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default);
    Task<Role?> GetRoleByNameAsync(string roleName, CancellationToken cancellationToken = default);
    Task AddAsync(AppUser user, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<AppUser>> GetAllAsync(CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
