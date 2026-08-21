using CloudServices.Application.Common.Interfaces;
using CloudServices.Infrastructure.Data.Interfaces;

namespace CloudServices.Infrastructure.Repositories;

public sealed class UnitOfWork(IApplicationDbContext context) : IUnitOfWork
{
    public Task<int> SaveChangesAsync(CancellationToken cancellationToken)
    {
        return context.SaveChangesAsync(cancellationToken);
    }
}
