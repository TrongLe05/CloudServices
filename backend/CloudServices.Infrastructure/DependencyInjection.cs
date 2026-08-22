using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Infrastructure.Data;
using CloudServices.Infrastructure.Data.Interfaces;
using CloudServices.Infrastructure.Interceptors;
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
        // 0. Đăng ký Current User Service & HttpContextAccessor
        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUserService, CurrentUserService>();

        // 1. Đăng ký SaveChangesInterceptor cho Entity Audit Logging
        services.AddScoped<AuditableEntitySaveChangesInterceptor>();

        // 2. Đăng ký ApplicationDbContext với SqlServer provider và Interceptors
        services.AddDbContext<ApplicationDbContext>((sp, options) =>
        {
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"),
                builder => builder.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName));

            options.AddInterceptors(sp.GetRequiredService<AuditableEntitySaveChangesInterceptor>());

            options.ConfigureWarnings(warnings =>
                warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
        });

        // 3. Đăng ký Interface IApplicationDbContext
        services.AddScoped<IApplicationDbContext>(provider =>
            provider.GetRequiredService<ApplicationDbContext>());

        // 4. Đăng ký ApplicationDbContextInitialiser
        services.AddScoped<ApplicationDbContextInitialiser>();

        // 5. Đăng ký Repositories & UnitOfWork
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IServiceCategoryRepository, ServiceCategoryRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<IPromotionRepository, PromotionRepository>();
        services.AddScoped<IServicePlanRepository, ServicePlanRepository>();
        services.AddScoped<IPlanPriceRepository, PlanPriceRepository>();
        services.AddScoped<ITestimonialRepository, TestimonialRepository>();
        services.AddScoped<IOrderRequestRepository, OrderRequestRepository>();
        services.AddScoped<INewsRepository, NewsRepository>();
        services.AddScoped<IAffiliateApplicationRepository, AffiliateApplicationRepository>();
        services.AddScoped<IAuditLogRepository, AuditLogRepository>();

        // 6. Hash & JWT
        services.AddSingleton<IPasswordHasher, BCryptPasswordHasher>();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

        // Đăng ký QR Code Generator & Excel Exporter
        services.AddSingleton<IQrCodeGenerator, QrCodeGenerator>();
        services.AddTransient<IExcelExporter, ExcelExporter>();

        // Đăng ký PayOS Payment Gateway
        services.AddScoped<IPaymentGateway, PayOSPaymentGateway>();

        return services;
    }
}
