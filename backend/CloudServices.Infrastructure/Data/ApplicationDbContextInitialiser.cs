using CloudServices.Domain.Entities;
using CloudServices.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CloudServices.Infrastructure.Data;

public class ApplicationDbContextInitialiser
{
    private readonly ILogger<ApplicationDbContextInitialiser> _logger;
    private readonly ApplicationDbContext _context;

    public ApplicationDbContextInitialiser(ILogger<ApplicationDbContextInitialiser> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    public async Task InitialiseAsync()
    {
        try
        {
            if (_context.Database.IsSqlServer())
            {
                await _context.Database.MigrateAsync();
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Đã xảy ra lỗi khi khởi tạo database.");
            throw;
        }
    }

    public async Task SeedAsync()
    {
        try
        {
            await TrySeedAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Đã xảy ra lỗi khi nạp dữ liệu mẫu.");
            throw;
        }
    }

    private async Task TrySeedAsync()
    {
        // 1. Seed Roles
        var adminRole = new Role { Name = "Admin", Description = "Quản trị viên hệ thống" };
        var userRole = new Role { Name = "User", Description = "Khách hàng thành viên" };

        if (!await _context.Roles.AnyAsync())
        {
            _context.Roles.AddRange(adminRole, userRole);
            await _context.SaveChangesAsync();
        }
        else
        {
            adminRole = await _context.Roles.FirstAsync(r => r.Name == "Admin");
        }

        // 2. Seed AppUsers (Tài khoản Admin)
        var systemAdmin = new AppUser
        {
            Username = "admin",
            FullName = "Hệ Thống Admin",
            Email = "admin@cloudservice.com",
            PasswordHash = "admin_hashed_password", // Password mặc định (nên được băm trong thực tế)
            RoleId = adminRole.Id
        };

        if (!await _context.AppUsers.AnyAsync())
        {
            _context.AppUsers.Add(systemAdmin);
            await _context.SaveChangesAsync();
        }
        else
        {
            systemAdmin = await _context.AppUsers.FirstAsync(u => u.Username == "admin");
        }

        // 3. Seed Service Categories
        var vpsCategory = new ServiceCategory { Name = "VPS", Slug = "vps", Description = "Máy chủ ảo đám mây hiệu năng cao" };
        var hostingCategory = new ServiceCategory { Name = "Hosting", Slug = "hosting", Description = "Lưu trữ website tốc độ cao" };

        if (!await _context.ServiceCategories.AnyAsync())
        {
            _context.ServiceCategories.AddRange(vpsCategory, hostingCategory);
            await _context.SaveChangesAsync();
        }
        else
        {
            vpsCategory = await _context.ServiceCategories.FirstAsync(c => c.Slug == "vps");
            hostingCategory = await _context.ServiceCategories.FirstAsync(c => c.Slug == "hosting");
        }

        // 4. Seed Promotions
        var grandOpeningPromo = new Promotion
        {
            Name = "Mừng Khai Trương",
            DiscountPercentage = 10,
            StartDate = DateTime.UtcNow.AddDays(-5),
            EndDate = DateTime.UtcNow.AddMonths(1)
        };

        if (!await _context.Promotions.AnyAsync())
        {
            _context.Promotions.Add(grandOpeningPromo);
            await _context.SaveChangesAsync();
        }
        else
        {
            grandOpeningPromo = await _context.Promotions.FirstAsync(p => p.Name == "Mừng Khai Trương");
        }

        // 5. Seed ServicePlans & PlanPrices
        if (!await _context.ServicePlans.AnyAsync())
        {
            var vpsStarter = new ServicePlan
            {
                CategoryId = vpsCategory.Id,
                Name = "VPS Starter",
                Description = "Phù hợp cho dự án nhỏ hoặc học tập",
                Cpu = "1 vCPU",
                Ram = "2 GB",
                Storage = "30 GB SSD",
                Bandwidth = "100 Mbps",
                QrCodeUrl = "https://images.example.com/qr-vps-starter.png"
            };

            var vpsPro = new ServicePlan
            {
                CategoryId = vpsCategory.Id,
                Name = "VPS Professional",
                Description = "Hiệu năng tối ưu cho doanh nghiệp",
                Cpu = "2 vCPU",
                Ram = "4 GB",
                Storage = "60 GB SSD NVMe",
                Bandwidth = "200 Mbps",
                QrCodeUrl = "https://images.example.com/qr-vps-pro.png"
            };

            _context.ServicePlans.AddRange(vpsStarter, vpsPro);
            await _context.SaveChangesAsync();

            _context.PlanPrices.AddRange(
                new PlanPrice { PlanId = vpsStarter.Id, BillingCycle = "Monthly", Price = 150000, PromotionId = grandOpeningPromo.Id },
                new PlanPrice { PlanId = vpsStarter.Id, BillingCycle = "Annually", Price = 1500000, PromotionId = null },
                new PlanPrice { PlanId = vpsPro.Id, BillingCycle = "Monthly", Price = 300000, PromotionId = grandOpeningPromo.Id },
                new PlanPrice { PlanId = vpsPro.Id, BillingCycle = "Annually", Price = 3000000, PromotionId = null }
            );
            await _context.SaveChangesAsync();
        }

        // 6. Seed NewsArticles
        if (!await _context.NewsArticles.AnyAsync())
        {
            _context.NewsArticles.Add(new NewsArticle
            {
                Title = "Giới thiệu dịch vụ Cloud VPS tốc độ cao mới",
                Slug = "gioi-thieu-dich-vu-cloud-vps-moi",
                Content = "<p>Chúng tôi chính thức ra mắt dịch vụ Cloud VPS mới sử dụng ổ cứng NVMe...</p>",
                ThumbnailUrl = "https://images.example.com/vps-launch.png",
                PublishedAt = DateTime.UtcNow,
                AuthorId = systemAdmin.Id
            });
            await _context.SaveChangesAsync();
        }

        if (!await _context.AffiliateApplications.AnyAsync())
        {
            _context.AffiliateApplications.Add(new AffiliateApplication
            {
                FullName = "John Doe",
                Email = "john.doe@example.com",
                Phone = "0123456789",
                Status = AffiliateStatus.Pending,
            });
            await _context.SaveChangesAsync();
        }
    }
}