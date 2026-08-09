using CloudServices.Domain.Entities;

namespace CloudServices.Application.Common.Interfaces.Repositories;

public interface IRoleRepository
{
    Task<Role?> GetByNameAsync(string name, CancellationToken cancellationToken);
}
