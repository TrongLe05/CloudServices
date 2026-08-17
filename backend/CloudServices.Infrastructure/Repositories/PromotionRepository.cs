using Microsoft.EntityFrameworkCore;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using CloudServices.Infrastructure.Data;

namespace CloudServices.Infrastructure.Repositories;

public class PromotionRepository : IPromotionRepository
{
    private readonly ApplicationDbContext _context;

    public PromotionRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Promotion>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Promotions.ToListAsync(cancellationToken);
    }

    public async Task<Promotion?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Promotions.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public async Task AddAsync(Promotion promotion, CancellationToken cancellationToken = default)
    {
        await _context.Promotions.AddAsync(promotion, cancellationToken);
    }

    public void Update(Promotion promotion)
    {
        _context.Promotions.Update(promotion);
    }

    public void Delete(Promotion promotion)
    {
        _context.Promotions.Remove(promotion);
    }
}