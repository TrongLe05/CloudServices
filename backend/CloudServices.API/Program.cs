using System.Security.Claims;
using System.Text;
using CloudServices.API.Middleware;
using CloudServices.Application;
using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Exceptions.BadRequestException;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Infrastructure;
using CloudServices.Infrastructure.Data;
using CloudServices.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Net.payOS;
using Scalar.AspNetCore;
using Serilog;
using Serilog.Events;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .Enrich.FromLogContext()
    .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}")
    .WriteTo.File(
        path: "logs/app-.log",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30,
        outputTemplate: "[{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} {Level:u3}] [{SourceContext}] {Message:lj} {Properties:j}{NewLine}{Exception}")
    .CreateLogger();

try
{
    Log.Information("Đang khởi chạy ứng dụng CloudServices API...");

    var builder = WebApplication.CreateBuilder(args);

    // Cấu hình Serilog Host
    builder.Host.UseSerilog((context, services, configuration) => configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext()
        .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}")
        .WriteTo.File(
            path: "logs/app-.log",
            rollingInterval: RollingInterval.Day,
            retainedFileCountLimit: 30,
            outputTemplate: "[{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} {Level:u3}] [{SourceContext}] {Message:lj} {Properties:j}{NewLine}{Exception}")
    );

    builder.Services.AddControllers();
    builder.Services.AddAuthorization();

    // Exception handling
    builder.Services.AddExceptionHandler<CustomExceptionHandler>();
    builder.Services.AddProblemDetails();

    // OpenAPI
    builder.Services.AddOpenApi(options =>
    {
        options.AddDocumentTransformer((document, context, cancellationToken) =>
        {
            var securityScheme = new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.Http,
                Name = "Authorization",
                In = ParameterLocation.Header,
                Scheme = "bearer",
                BearerFormat = "JWT",
                Description = "Nhập Access Token dạng: Bearer {token}"
            };

            document.Components ??= new OpenApiComponents();
            document.Components.SecuritySchemes ??= new Dictionary<string, IOpenApiSecurityScheme>();
            document.Components.SecuritySchemes.Add("Bearer", securityScheme);

            document.Security ??= new List<OpenApiSecurityRequirement>();
            document.Security.Add(new OpenApiSecurityRequirement
            {
                [new OpenApiSecuritySchemeReference("Bearer", document)] = new List<string>()
            });

            return Task.CompletedTask;
        });
    });

    // Clean Architecture Layers
    builder.Services.AddApplicationServices();
    builder.Services.AddInfrastructureServices(builder.Configuration);

    // JWT Authentication
    var jwtSecret = builder.Configuration["JwtSettings:Secret"]
        ?? throw new InvalidOperationException("Chưa cấu hình JWT Secret");

    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

    var corsPolicyName = "AllowFrontendPolicy";

    builder.Services.AddCors(options =>
    {
        options.AddPolicy(name: corsPolicyName,
            policy =>
            {
                var frontendUrl = builder.Configuration["AppSettings:FrontendUrl"] ?? "http://localhost:3000";
                var allowedOrigins = frontendUrl.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

                policy.WithOrigins(allowedOrigins)
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            });
    });

    builder.Services.AddHttpClient<IEmailSender, ResendEmailSender>();
    builder.Services.AddMemoryCache();

    var payOsClientId = builder.Configuration["PayOS:ClientId"]
        ?? throw new InvalidOperationException("Chưa cấu hình PayOS ClientId");
    var payOsApiKey = builder.Configuration["PayOS:ApiKey"]
        ?? throw new InvalidOperationException("Chưa cấu hình PayOS ApiKey");
    var payOsChecksumKey = builder.Configuration["PayOS:ChecksumKey"]
        ?? throw new InvalidOperationException("Chưa cấu hình PayOS ChecksumKey");

    builder.Services.AddSingleton(new PayOS(payOsClientId, payOsApiKey, payOsChecksumKey));

    var app = builder.Build();

    // Global Exception Handler
    app.UseExceptionHandler();

    // Serilog Request Logging (đặt sớm trong pipeline để đo chính xác thời gian request)
    app.UseSerilogRequestLogging(options =>
    {
        options.GetLevel = (httpContext, elapsed, ex) =>
        {
            if (ex is UnauthorizedException || ex is NotFoundException || ex is BadRequestException || ex is FluentValidation.ValidationException)
                return LogEventLevel.Warning;

            if (httpContext.Response.StatusCode == 401 || httpContext.Response.StatusCode == 404 || httpContext.Response.StatusCode == 400 || httpContext.Response.StatusCode == 403)
                return LogEventLevel.Warning;

            if (httpContext.Response.StatusCode >= 500 || ex != null)
                return LogEventLevel.Error;

            return LogEventLevel.Information;
        };
        options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
        options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
        {
            var userId = httpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? httpContext.User?.FindFirst("sub")?.Value;
            if (!string.IsNullOrWhiteSpace(userId))
            {
                diagnosticContext.Set("UserId", userId);
            }

            var username = httpContext.User?.Identity?.Name;
            if (!string.IsNullOrWhiteSpace(username))
            {
                diagnosticContext.Set("UserName", username);
            }

            var clientIp = httpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault()
                ?? httpContext.Connection.RemoteIpAddress?.ToString();
            if (!string.IsNullOrWhiteSpace(clientIp))
            {
                diagnosticContext.Set("ClientIp", clientIp);
            }

            var userAgent = httpContext.Request.Headers.UserAgent.ToString();
            if (!string.IsNullOrWhiteSpace(userAgent))
            {
                diagnosticContext.Set("UserAgent", userAgent.Length > 200 ? userAgent[..200] : userAgent);
            }

            diagnosticContext.Set("TraceIdentifier", httpContext.TraceIdentifier);
        };
    });

    // OpenAPI + Scalar - bật ở mọi môi trường để hỗ trợ kiểm thử trên Render/Production
    app.MapOpenApi();

    app.MapScalarApiReference(options =>
    {
        options.WithTitle("Cloud Services Document API")
               .WithTheme(ScalarTheme.Default);
    });

    // Khởi tạo và seed Database (chạy ở mọi môi trường để Render có dữ liệu ban đầu)
    using (var scope = app.Services.CreateScope())
    {
        var initialiser = scope.ServiceProvider.GetRequiredService<ApplicationDbContextInitialiser>();
        await initialiser.InitialiseAsync();
        await initialiser.SeedAsync();
    }

    app.UseHttpsRedirection();
    app.UseCors("AllowFrontendPolicy");
    app.UseAuthentication();
    app.UseAuthorization();

    // Ghi nhật ký hệ thống toàn diện cho mọi request
    app.UseMiddleware<AuditLoggingMiddleware>();

    app.MapControllers();

    app.Run();
}
catch (Exception ex) when (ex is not HostAbortedException && !ex.GetType().Name.Equals("HostAbortedException", StringComparison.Ordinal))
{
    Log.Fatal(ex, "Ứng dụng CloudServices API bị ngắt đột ngột.");
}
finally
{
    Log.CloseAndFlush();
}