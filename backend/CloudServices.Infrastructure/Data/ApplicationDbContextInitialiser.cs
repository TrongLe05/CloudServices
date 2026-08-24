using CloudServices.Application.Common.Interfaces;
using CloudServices.Domain.Entities;
using CloudServices.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace CloudServices.Infrastructure.Data;

public class ApplicationDbContextInitialiser
{
    private readonly ILogger<ApplicationDbContextInitialiser> _logger;
    private readonly ApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public ApplicationDbContextInitialiser(
        ILogger<ApplicationDbContextInitialiser> logger,
        ApplicationDbContext context,
        IPasswordHasher passwordHasher)
    {
        _logger = logger;
        _context = context;
        _passwordHasher = passwordHasher;
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
        var adminRole = await _context.Roles.IgnoreQueryFilters().FirstOrDefaultAsync(r => r.Name == "Admin");
        if (adminRole == null)
        {
            adminRole = new Role { Name = "Admin", Description = "Quản trị viên hệ thống", IsActive = true };
            _context.Roles.Add(adminRole);
            await _context.SaveChangesAsync();
        }
        else if (!adminRole.IsActive)
        {
            adminRole.IsActive = true;
            _context.Roles.Update(adminRole);
            await _context.SaveChangesAsync();
        }

        var userRole = await _context.Roles.IgnoreQueryFilters().FirstOrDefaultAsync(r => r.Name == "User");
        if (userRole == null)
        {
            userRole = new Role { Name = "User", Description = "Khách hàng thành viên", IsActive = true };
            _context.Roles.Add(userRole);
            await _context.SaveChangesAsync();
        }
        else if (!userRole.IsActive)
        {
            userRole.IsActive = true;
            _context.Roles.Update(userRole);
            await _context.SaveChangesAsync();
        }

        var editorRole = await _context.Roles.IgnoreQueryFilters().FirstOrDefaultAsync(r => r.Name == "Editor");
        if (editorRole == null)
        {
            editorRole = new Role { Name = "Editor", Description = "Biên tập viên & Quản lý yêu cầu", IsActive = true };
            _context.Roles.Add(editorRole);
            await _context.SaveChangesAsync();
        }
        else if (!editorRole.IsActive)
        {
            editorRole.IsActive = true;
            _context.Roles.Update(editorRole);
            await _context.SaveChangesAsync();
        }

        // 2. Seed AppUsers (Tài khoản Admin)
        var systemAdmin = await _context.AppUsers.IgnoreQueryFilters().FirstOrDefaultAsync(u => u.Username == "admin");
        var adminHash = _passwordHasher.HashPasswords("123123");

        if (systemAdmin == null)
        {
            systemAdmin = new AppUser
            {
                Username = "admin",
                FullName = "Hệ Thống Admin",
                Email = "admin@cloudservice.com",
                PasswordHash = adminHash,
                RoleId = adminRole.Id,
                IsActive = true
            };
            _context.AppUsers.Add(systemAdmin);
            await _context.SaveChangesAsync();
        }
        else
        {
            // Cập nhật lại hash hợp lệ nếu hash cũ bị lỗi
            systemAdmin.PasswordHash = adminHash;
            systemAdmin.IsActive = true;
            _context.AppUsers.Update(systemAdmin);
            await _context.SaveChangesAsync();
        }

        // 3. Seed Service Categories
        var vpsCategory = await _context.ServiceCategories.IgnoreQueryFilters().FirstOrDefaultAsync(c => c.Slug == "vps");
        if (vpsCategory == null)
        {
            vpsCategory = new ServiceCategory { Name = "VPS", Slug = "vps", Description = "Máy chủ ảo đám mây hiệu năng cao", IsActive = true };
            _context.ServiceCategories.Add(vpsCategory);
            await _context.SaveChangesAsync();
        }
        else if (!vpsCategory.IsActive)
        {
            vpsCategory.IsActive = true;
            _context.ServiceCategories.Update(vpsCategory);
            await _context.SaveChangesAsync();
        }

        var hostingCategory = await _context.ServiceCategories.IgnoreQueryFilters().FirstOrDefaultAsync(c => c.Slug == "hosting");
        if (hostingCategory == null)
        {
            hostingCategory = new ServiceCategory { Name = "Hosting", Slug = "hosting", Description = "Lưu trữ website tốc độ cao", IsActive = true };
            _context.ServiceCategories.Add(hostingCategory);
            await _context.SaveChangesAsync();
        }
        else if (!hostingCategory.IsActive)
        {
            hostingCategory.IsActive = true;
            _context.ServiceCategories.Update(hostingCategory);
            await _context.SaveChangesAsync();
        }

        // 4. Seed Promotions
        var grandOpeningPromo = await _context.Promotions.IgnoreQueryFilters().FirstOrDefaultAsync(p => p.Name == "Mừng Khai Trương");
        if (grandOpeningPromo == null)
        {
            grandOpeningPromo = new Promotion
            {
                Name = "Mừng Khai Trương",
                DiscountPercentage = 10,
                StartDate = DateTime.UtcNow.AddDays(-5),
                EndDate = DateTime.UtcNow.AddMonths(1),
                IsActive = true
            };
            _context.Promotions.Add(grandOpeningPromo);
            await _context.SaveChangesAsync();
        }
        else if (!grandOpeningPromo.IsActive)
        {
            grandOpeningPromo.IsActive = true;
            _context.Promotions.Update(grandOpeningPromo);
            await _context.SaveChangesAsync();
        }

        // 5. Seed ServicePlans & PlanPrices
        if (!await _context.ServicePlans.IgnoreQueryFilters().AnyAsync())
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
                QrCodeUrl = "https://images.example.com/qr-vps-starter.png",
                IsActive = true
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
                QrCodeUrl = "https://images.example.com/qr-vps-pro.png",
                IsActive = true
            };

            _context.ServicePlans.AddRange(vpsStarter, vpsPro);
            await _context.SaveChangesAsync();

            _context.PlanPrices.AddRange(
                new PlanPrice { PlanId = vpsStarter.Id, BillingCycle = "Monthly", Price = 150000, PromotionId = grandOpeningPromo.Id, IsActive = true },
                new PlanPrice { PlanId = vpsStarter.Id, BillingCycle = "Yearly", Price = 1500000, PromotionId = null, IsActive = true },
                new PlanPrice { PlanId = vpsPro.Id, BillingCycle = "Monthly", Price = 300000, PromotionId = grandOpeningPromo.Id, IsActive = true },
                new PlanPrice { PlanId = vpsPro.Id, BillingCycle = "Yearly", Price = 3000000, PromotionId = null, IsActive = true }
            );
            await _context.SaveChangesAsync();
        }

        // 6. Seed NewsArticles
        if (!await _context.NewsArticles.IgnoreQueryFilters().AnyAsync())
        {
            _context.NewsArticles.Add(new NewsArticle
            {
                Title = "Giới thiệu dịch vụ Cloud VPS tốc độ cao mới",
                Slug = "gioi-thieu-dich-vu-cloud-vps-moi",
                Content = "<p>Chúng tôi chính thức ra mắt dịch vụ Cloud VPS mới sử dụng ổ cứng NVMe...</p>",
                ThumbnailUrl = "https://images.example.com/vps-launch.png",
                PublishedAt = DateTime.UtcNow,
                AuthorId = systemAdmin.Id,
                IsActive = true
            });
            await _context.SaveChangesAsync();
        }

        // 7. Seed AffiliateApplications
        if (!await _context.AffiliateApplications.IgnoreQueryFilters().AnyAsync())
        {
            _context.AffiliateApplications.Add(new AffiliateApplication
            {
                FullName = "John Doe",
                Email = "john.doe@example.com",
                Phone = "0123456789",
                Status = AffiliateStatus.Pending,
                IsActive = true
            });
            await _context.SaveChangesAsync();
        }
    }
}