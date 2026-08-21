using CloudServices.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CloudServices.Infrastructure.Data.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Role> Roles { get; }
    DbSet<AppUser> AppUsers { get; }
    DbSet<ServiceCategory> ServiceCategories { get; }
    DbSet<ServicePlan> ServicePlans { get; }
    DbSet<Promotion> Promotions { get; }
    DbSet<PlanPrice> PlanPrices { get; }
    DbSet<OrderRequest> OrderRequests { get; }
    DbSet<AffiliateApplication> AffiliateApplications { get; }
    DbSet<AuditLog> AuditLogs { get; }
    DbSet<NewsArticle> NewsArticles { get; }
    DbSet<Testimonial> Testimonials { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    int SaveChanges();
}
