using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Infrastructure.Data;
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

        // 2. Đăng ký Interface IApplicationDbContext trỏ tới ApplicationDbContext
        services.AddScoped<IApplicationDbContext>(provider =>
            provider.GetRequiredService<ApplicationDbContext>());

        // 3. Đăng ký ApplicationDbContextInitialiser để chạy Migration & Seeding khi khởi tạo
        services.AddScoped<ApplicationDbContextInitialiser>();

        // Đăng ký các Repositories và UnitOfWork
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<IServicePlanRepository, ServicePlanRepository>();
        services.AddScoped<INewsRepository, NewsRepository>();
        services.AddScoped<IPlanPriceRepository, PlanPriceRepository>();

        // Đăng ký Bcrypt để hash password
        services.AddSingleton<IPasswordHasher, BCryptPasswordHasher>();

        // Đăng ký JWT Token Generator
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

        // Đăng ký QR Code Generator
        services.AddSingleton<IQrCodeGenerator, QrCodeGenerator>();

        return services;
    }
}