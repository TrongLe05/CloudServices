using CloudServices.Infrastructure.Data.Interfaces;
using CloudServices.Application.Common.Interfaces;

namespace CloudServices.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly IApplicationDbContext _context;    
    public UnitOfWork(IApplicationDbContext context)
    {
        _context = context;
    }
    public Task<int> SaveChangesAsync(CancellationToken cancellationToken)
    {
        return _context.SaveChangesAsync(cancellationToken);
    }
}
