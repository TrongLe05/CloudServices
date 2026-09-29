# ☁️ CloudServices - Nền Tảng Quản Lý & Cung Cấp Dịch Vụ Đám Mây

<p align="center">
  <img src="https://img.shields.io/badge/.NET-10.0-512BD4?logo=dotnet&logoColor=white" alt=".NET 10" />
  <img src="https://img.shields.io/badge/Next.js-16.3-000000?logo=next.js&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/SQL_Server-2022-CC292B?logo=microsoft-sql-server&logoColor=white" alt="SQL Server" />
  <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/PayOS-Integrated-0052FF" alt="PayOS" />
</p>

---

## 📌 Giới Thiệu Dự Án

**CloudServices** là hệ thống website thương mại điện tử chuyên cung cấp các giải pháp và hạ tầng đám mây (Cloud Infrastructure) như **Cloud VPS, Web Hosting, Dedicated Server, Storage Cloud,...**

Hệ thống được thiết kế theo chuẩn doanh nghiệp hiện đại:
- **Backend**: Xây dựng theo mô hình **Clean Architecture** kết hợp mẫu thiết kế **CQRS (Command Query Responsibility Segregation)** trên nền tảng **ASP.NET Core 10**.
- **Frontend**: Ứng dụng **Next.js 16 (App Router)** với **React 19**, giao diện hiện đại tối ưu bằng **Tailwind CSS v4** và bộ component **shadcn/ui**.
- **Tích hợp thanh toán & Dịch vụ**: Cổng thanh toán trực tuyến **PayOS** (tạo mã VietQR tự động), dịch vụ gửi email tự động qua **Resend API**, xuất báo cáo Excel qua **ClosedXML**, quản lý phiên với **NextAuth v5 & JWT**.

---

## 🏗️ Kiến Trúc Hệ Thống (System Architecture)

### 1. Backend: Clean Architecture & CQRS
```text
backend/
├── CloudServices.Domain          # Định nghĩa Entities, Enums, Value Objects, quy tắc nghiệp vụ cốt lõi
├── CloudServices.Application     # Tầng ứng dụng: CQRS (Commands/Queries qua MediatR), Validators (FluentValidation), Mappings (Mapster)
├── CloudServices.Infrastructure  # Triển khai EF Core 10, SQL Server, Password Hasher (BCrypt), QRCoder, Resend Email, ClosedXML
├── CloudServices.API             # Tầng trình diễn: RESTful Controllers, Middleware, Auth JWT, OpenAPI + Scalar, Serilog
└── CloudServices.UnitTests       # Bộ kiểm thử đơn vị cho Domain, Application và Infrastructure
```

### 2. Sơ đồ Quan hệ Thực thể CSDL (Entity Relationship)
```text
[ServiceCategory] (1) ───◄ (N) [ServicePlan]
                                   │ (1)
                                   ├───◄ (N) [PlanPrice] (Chu kỳ giá)
                                   │             │ (1)
                                   │             └───◄ (N) [OrderRequest] ───◄ [Payments]
                                   ▼ (0..1)
                              [Promotion] (Khuyến mãi)

[Roles] (1) ───◄ (N) [AppUsers]
                        │ (1)
                        └───◄ (N) [AuditLogs] (Nhật ký kiểm toán hệ thống)

[AffiliateApplication] (Đăng ký Cộng tác viên)
[NewsArticle]          (Tin tức & bài viết công nghệ)
[Testimonial]          (Đánh giá phản hồi khách hàng)
```

---

## ✨ Tính Năng Nổi Bật

### 🌐 Phân Hệ Khách Hàng (Public Portal)
- **Danh mục & Bảng giá**: Duyệt các danh mục dịch vụ (VPS, Hosting,...), tùy chọn thông số kỹ thuật (CPU, RAM, Ổ cứng, Băng thông) và chu kỳ thanh toán (Theo tháng, Theo năm).
- **Chương trình khuyến mãi**: Tự động áp dụng mã ưu đãi và chiết khấu phần trăm theo chiến dịch đang có hiệu lực.
- **Quy trình đặt hàng thông minh**: Điền thông tin đăng ký dịch vụ, hỗ trợ tạo đơn hàng và thanh toán trực tiếp qua cổng **PayOS** (Quét mã VietQR tiện lợi).
- **Hệ thống tin tức (Blog/News)**: Cập nhật các thông tin công nghệ, hướng dẫn dịch vụ.
- **Chương trình Đối tác & CTV (Affiliate)**: Biểu mẫu đăng ký tham gia mạng lưới cộng tác viên trực tuyến.
- **Đánh giá & Phản hồi (Testimonials)**: Trải nghiệm thực tế từ các doanh nghiệp, khách hàng đã sử dụng dịch vụ.
- **Xác thực & Cá nhân hóa**: Đăng nhập, đăng ký tài khoản thành viên, quản lý thông tin hồ sơ và tra cứu lịch sử đơn hàng.

### 🛡️ Phân Hệ Quản Trị (Admin & Editor Dashboard)
- **Báo cáo & Thống kê (Dashboard)**: Biểu đồ trực quan (Recharts) theo dõi doanh thu, số lượng đơn hàng, tỷ lệ chuyển đổi và tăng trưởng người dùng.
- **Quản lý Dịch vụ**:
  - CRUD Danh mục dịch vụ (`ServiceCategories`) với URL Slug chuẩn SEO.
  - CRUD Gói cấu hình (`ServicePlans`) và bảng giá theo chu kỳ (`PlanPrices`).
  - Tạo và cấu hình mã QR dịch vụ (`ServicePlanQrCode`).
- **Quản lý Khuyến mãi (`Promotions`)**: Thiết lập mức chiết khấu, thời gian bắt đầu và kết thúc chương trình ưu đãi.
- **Quản lý Đơn đặt hàng (`OrderRequests`)**: Theo dõi trạng thái đơn hàng (Chờ xử lý, Đang xử lý, Hoàn tất, Bị từ chối), cập nhật ghi chú và **xuất báo cáo danh sách đơn hàng ra file Excel (.xlsx)**.
- **Quản lý Cộng tác viên (`Affiliates`)**: Xét duyệt đơn đăng ký CTV, quản lý liên hệ và **xuất danh sách CTV ra file Excel**.
- **Biên tập tin tức (`News`)**: Soạn thảo bài viết chuẩn SEO với trình soạn thảo WYSIWYG cao cấp **TinyMCE**.
- **Quản lý Tài khoản & Phân quyền (`Users & Roles`)**: Quản lý danh sách thành viên, cấp quyền (`Admin`, `Editor`, `User`), cơ chế Soft-delete (xóa mềm).
- **Nhật ký hệ thống (`Audit Logs`)**: Ghi nhận toàn bộ thao tác thêm, sửa, xóa quan trọng, lưu lại Payload JSON trước và sau thay đổi để đối chiếu bảo mật.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

| Thành phần | Công nghệ / Thư viện |
| :--- | :--- |
| **Backend Core** | ASP.NET Core 10 (C#) |
| **Kiến trúc** | Clean Architecture, CQRS, Repository / UnitOfWork pattern |
| **Thư viện Backend** | MediatR, FluentValidation, Mapster, BCrypt.Net, ClosedXML, QRCoder |
| **Thanh toán & Email** | PayOS SDK (VietQR), Resend Email API |
| **Logging & Docs** | Serilog (Rolling Daily Files), OpenAPI, Scalar API Reference UI |
| **Cơ sở dữ liệu** | Microsoft SQL Server 2022, Entity Framework Core 10 |
| **Frontend Framework**| Next.js 16 (App Router + Turbopack), React 19, TypeScript 5 |
| **Giao diện & UI** | Tailwind CSS v4, shadcn/ui, Radix UI, Base UI, Lucide Icons, Embla Carousel |
| **Quản lý trạng thái** | Zustand, React Hook Form, Zod |
| **Xác thực Client** | NextAuth v5 (Auth.js beta), Jose (JWT) |
| **Trình soạn thảo** | TinyMCE React |
| **Biểu đồ thống kê** | Recharts |
| **Testing** | Vitest, React Testing Library, xUnit, FluentAssertions, Moq |
| **DevOps & Deploy** | Docker, Docker Compose, GitHub Actions (CI/CD), Render |

---

## 📁 Cấu Trúc Thư Mục Dự Án

```text
CloudServices/
├── .github/
│   └── workflows/
│       └── ci-cd.yml             # Luồng tự động kiểm thử và build CI/CD
├── backend/
│   ├── CloudServices.API/        # Web API Host (Controllers, Program.cs, Middleware, Configs)
│   ├── CloudServices.Application/# CQRS Handlers, Behaviors, DTOs, Interfaces
│   ├── CloudServices.Domain/     # Domain Entities, Enums, BaseEntity
│   ├── CloudServices.Infrastructure/ # EF Core Context, Migrations, External Services
│   ├── CloudServices.UnitTests/  # Unit Tests Backend
│   ├── database_design.md        # Tài liệu chi tiết đặc tả CSDL
│   └── Dockerfile                # Dockerfile đa tầng cho Backend
├── frontend/
│   └── cloud-services-web/
│       ├── src/
│       │   ├── app/              # Next.js App Router (Public routes, Admin, Editor)
│       │   ├── components/       # UI Components tái sử dụng (shadcn/ui, Layouts)
│       │   ├── services/         # API Service Clients giao tiếp với Backend
│       │   ├── schema/           # Zod Validation Schemas
│       │   └── types/            # TypeScript Type Definitions
│       ├── package.json
│       └── Dockerfile            # Dockerfile đa tầng cho Frontend
├── .env.example                  # File mẫu biến môi trường
├── docker-compose.yml            # Khởi chạy toàn bộ hệ thống (SQL Server, Backend, Frontend)
├── render.yaml                   # File cấu hình deploy tự động lên Render Cloud
└── README.md
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### Cách 1: Sử dụng Docker Compose (Khuyên dùng - Nhanh nhất)

Hệ thống đã được đóng gói đầy đủ gồm **SQL Server 2022**, **Backend API (.NET 10)** và **Frontend (Next.js 16)**.

1. **Chuẩn bị file môi trường**:
   Sao chép `.env.example` thành `.env`:
   ```bash
   cp .env.example .env
   ```

2. **Khởi chạy container**:
   ```bash
   docker compose up -d --build
   ```

3. **Kiểm tra trạng thái**:
   - Giao diện người dùng: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8080](http://localhost:8080)
   - Tài liệu API (Scalar): [http://localhost:8080/scalar/v1](http://localhost:8080/scalar/v1)

---

### Cách 2: Chạy Thủ Công Từng Phần (Local Development)

#### 1. Yêu cầu môi trường
- [.NET 10.0 SDK](https://dotnet.microsoft.com/)
- [Node.js 20+](https://nodejs.org/) & [pnpm](https://pnpm.io/)
- [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server) (hoặc chạy SQL Server qua Docker)

#### 2. Khởi chạy Cơ sở dữ liệu (SQL Server)
Nếu chưa có SQL Server cục bộ, có thể dùng Docker:
```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=CloudServices@2026!" -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2022-latest
```

#### 3. Cấu hình & Khởi chạy Backend
1. Truy cập thư mục backend:
   ```bash
   cd backend/CloudServices.API
   ```
2. Cập nhật chuỗi kết nối trong `appsettings.Development.json` (hoặc `appsettings.json`):
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost,1433;Database=CloudServicesDb;User Id=sa;Password=CloudServices@2026!;MultipleActiveResultSets=true;TrustServerCertificate=True;"
   }
   ```
3. Chạy ứng dụng (*Hệ thống sẽ tự động thực hiện Migration và nạp dữ liệu mẫu ban đầu*):
   ```bash
   dotnet run
   ```
   Backend sẽ lắng nghe tại: `http://localhost:8080` (hoặc cổng cấu hình trong `launchSettings.json`).

#### 4. Khởi chạy Frontend
1. Truy cập thư mục frontend:
   ```bash
   cd frontend/cloud-services-web
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   pnpm install
   ```
3. Tạo file cấu hình môi trường `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   AUTH_SECRET=e4f95d4e244405a2588f95d36854429a77e6299e1d6ab520e804c5d7d594ec86
   AUTH_URL=http://localhost:3000
   ```
4. Khởi chạy máy chủ phát triển:
   ```bash
   pnpm dev
   ```
   Mở trình duyệt tại: [http://localhost:3000](http://localhost:3000).

---

## 🔑 Tài Khoản Mặc Định (Seed Account)

Hệ thống tự động kích hoạt tài khoản quản trị khi khởi chạy lần đầu:

| Vai trò | Tài khoản | Mật khẩu | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `123123` | Toàn quyền quản trị hệ thống, duyệt đơn hàng, quản lý người dùng, xem audit logs |

---

## 📖 Tài Liệu API & Kiểm Thử

### 1. Tài liệu API tương tác
Dự án tích hợp công cụ trực quan hóa API hiện đại **Scalar** (thay thế giao diện Swagger truyền thống):
- **Scalar API UI**: `http://localhost:8080/scalar/v1`
- **OpenAPI Schema**: `http://localhost:8080/openapi/v1.json`

### 2. Chạy Kiểm Thử (Unit Tests)
- **Backend Tests (xUnit)**:
  ```bash
  cd backend/CloudServices.UnitTests
  dotnet test
  ```
- **Frontend Tests (Vitest)**:
  ```bash
  cd frontend/cloud-services-web
  pnpm test
  ```

---

## 📄 Bản Quyền & Giấy Phép

Dự án được xây dựng phục vụ học tập, nghiên cứu và phát triển phần mềm theo định hướng công nghệ đám mây.
Mọi đóng góp và phản hồi xin vui lòng tạo Issue hoặc Pull Request trên repository.
