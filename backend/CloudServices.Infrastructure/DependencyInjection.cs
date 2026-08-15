using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Infrastructure.Data;
using CloudServices.Infrastructure.Data.Interfaces;
using CloudServices.Infrastructure.Repositories;
using CloudServices.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CloudServices.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        // 1. Đăng ký ApplicationDbContext với SqlServer provider
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"),
                builder => builder.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

        // 2. Đăng ký Interface IApplicationDbContext
        services.AddScoped<IApplicationDbContext>(provider =>
            provider.GetRequiredService<ApplicationDbContext>());

        // 3. Đăng ký ApplicationDbContextInitialiser
        services.AddScoped<ApplicationDbContextInitialiser>();

        // 4. Đăng ký Repositories & UnitOfWork
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<IPromotionRepository, PromotionRepository>(); // <-- Đã thêm ở đây
        services.AddScoped<IServicePlanRepository, ServicePlanRepository>();
        services.AddScoped<IPlanPriceRepository, PlanPriceRepository>();
        services.AddScoped<ITestimonialRepository, TestimonialRepository>();

        // 5. Hash & JWT
        services.AddSingleton<IPasswordHasher, BCryptPasswordHasher>();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

        // Đăng ký QR Code Generator
        services.AddSingleton<IQrCodeGenerator, QrCodeGenerator>();

        return services;
    }
}
