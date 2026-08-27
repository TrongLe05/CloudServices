using Microsoft.EntityFrameworkCore;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using CloudServices.Infrastructure.Data;

namespace CloudServices.Infrastructure.Repositories;

public class TestimonialRepository : ITestimonialRepository
{
    private readonly ApplicationDbContext _context;

    public TestimonialRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Testimonial>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Testimonials
            .AsNoTracking()
            .OrderBy(x => x.DisplayOrder)
            .ThenByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<Testimonial?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Testimonials
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task AddAsync(Testimonial testimonial, CancellationToken cancellationToken = default)
    {
        await _context.Testimonials.AddAsync(testimonial, cancellationToken);
    }

    public void Update(Testimonial testimonial)
    {
        _context.Testimonials.Update(testimonial);
    }

    public void Delete(Testimonial testimonial)
    {
        _context.Testimonials.Remove(testimonial);
    }
}