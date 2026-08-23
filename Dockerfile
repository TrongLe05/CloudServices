# Stage 1: Build .NET Backend
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project files for caching restore layers (Relative to repository root)
COPY ["backend/CloudServices.Domain/CloudServices.Domain.csproj", "CloudServices.Domain/"]
COPY ["backend/CloudServices.Application/CloudServices.Application.csproj", "CloudServices.Application/"]
COPY ["backend/CloudServices.Infrastructure/CloudServices.Infrastructure.csproj", "CloudServices.Infrastructure/"]
COPY ["backend/CloudServices.API/CloudServices.API.csproj", "CloudServices.API/"]

RUN dotnet restore "CloudServices.API/CloudServices.API.csproj"

# Copy backend source code and build
COPY backend/ .
WORKDIR "/src/CloudServices.API"
RUN dotnet publish "CloudServices.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Final Runtime Image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

EXPOSE 8080
ENV ASPNETCORE_HTTP_PORTS=8080
ENV ASPNETCORE_ENVIRONMENT=Production

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CloudServices.API.dll"]
