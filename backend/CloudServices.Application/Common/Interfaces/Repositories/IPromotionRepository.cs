using CloudServices.Domain.Entities;

namespace CloudServices.Application.Common.Interfaces.Repositories;

public interface IPromotionRepository
{
    Task<List<Promotion>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Promotion?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(Promotion promotion, CancellationToken cancellationToken = default);
    void Update(Promotion promotion);
    void Delete(Promotion promotion);
}