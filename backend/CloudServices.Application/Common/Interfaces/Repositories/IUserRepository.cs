using CloudServices.Domain.Entities;

namespace CloudServices.Application.Common.Interfaces.Repositories;

public interface IUserRepository
{
    Task<AppUser?> GetByUsernameAsync(string username, CancellationToken cancellationToken);
    Task<AppUser?> GetByEmailAsync(string email, CancellationToken cancellationToken);
    Task<AppUser?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task AddAsync(AppUser user, CancellationToken cancellationToken);
    void Update(AppUser user);
    void Delete(AppUser user);
    Task<List<AppUser>> GetWithAllRolesAsync(CancellationToken cancellationToken);
    Task<bool> AnyAsync(string username, CancellationToken cancellationToken);
    Task<bool> AnyEmailAsync(string email, Guid? excludeUserId, CancellationToken cancellationToken);
    Task<bool> AnyUsernameAsync(string username, Guid? excludeUserId, CancellationToken cancellationToken);
    Task<(List<AppUser> Items, int TotalItems)> GetPagedUsersAsync(string? search, Guid? roleId, int page, int pageSize, CancellationToken cancellationToken);
}
