using CloudServices.Domain.Entities;

namespace CloudServices.Application.Common.Interfaces.Repositories;

public interface ITestimonialRepository
{
    Task<List<Testimonial>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Testimonial?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(Testimonial testimonial, CancellationToken cancellationToken = default);
    void Update(Testimonial testimonial);
    void Delete(Testimonial testimonial);
}