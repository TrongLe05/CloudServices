using CloudServices.Application.Common.Interfaces;
using CloudServices.Infrastructure.Data;
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

        return services;
    }
}
