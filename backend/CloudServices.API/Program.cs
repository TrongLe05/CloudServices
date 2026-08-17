using CloudServices.API.Middleware;
using CloudServices.Application;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Infrastructure;
using CloudServices.Infrastructure.Data;
using CloudServices.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Scalar.AspNetCore;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Exception handling
builder.Services.AddExceptionHandler<CustomExceptionHandler>();
builder.Services.AddProblemDetails();

// OpenAPI
// Configure OpenAPI với cấu hình bảo mật JWT Bearer
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, context, cancellationToken) =>
    {
        // 1. Định nghĩa phương thức bảo mật JWT Bearer
        var securityScheme = new OpenApiSecurityScheme
        {
            Type = SecuritySchemeType.Http,
            Name = "Authorization",
            In = ParameterLocation.Header,
            Scheme = "bearer",
            BearerFormat = "JWT",
            Description = "Nhập Access Token dạng: Bearer {token}"
        };

        // Khởi tạo Components nếu chưa có (dùng OpenApiComponents thay vì ApiComponents)
        document.Components ??= new OpenApiComponents();
        document.Components.SecuritySchemes ??= new Dictionary<string, IOpenApiSecurityScheme>();
        
        // Đăng ký Security Scheme tên là "Bearer"
        document.Components.SecuritySchemes.Add("Bearer", securityScheme);

        // 2. Yêu cầu bắt buộc gửi kèm Token cho toàn bộ API (Hoặc chỉ những API có [Authorize])
        document.Security ??= new List<OpenApiSecurityRequirement>();
        document.Security.Add(new OpenApiSecurityRequirement
        {
            [new OpenApiSecuritySchemeReference("Bearer", document)] = new List<string>()
        });

        return Task.CompletedTask;
    });
});

// Clean Architecture
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

// JWT
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

        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtSecret))
    };
});

var corsPolicyName = "AllowFrontendPolicy";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: corsPolicyName,
        policy =>
        {
            policy.WithOrigins("http://localhost:3000") // Địa chỉ chính xác của Frontend React/Next.js
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // 🔴 BẮT BUỘC: Cho phép gửi/nhận Cookie chéo domain
        });
});

builder.Services.AddHttpClient<IEmailSender, ResendEmailSender>();

builder.Services.AddMemoryCache();

var app = builder.Build();

// Global Exception Handler
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.MapScalarApiReference(options =>
    {
        options.WithTitle("Cloud Services Document API")
               .WithTheme(ScalarTheme.Default);
    });

    using (var scope = app.Services.CreateScope())
    {
        var initialiser =
            scope.ServiceProvider
                .GetRequiredService<ApplicationDbContextInitialiser>();

        await initialiser.InitialiseAsync();
        await initialiser.SeedAsync();
    }
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontendPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();