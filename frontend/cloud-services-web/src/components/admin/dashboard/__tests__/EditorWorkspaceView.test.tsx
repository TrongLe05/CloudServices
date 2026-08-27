import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EditorWorkspaceView } from "../EditorWorkspaceView";

describe("EditorWorkspaceView Component", () => {
  const mockOrders = [
    {
      id: "order-1",
      customerName: "Tran Van B",
      email: "b.tran@example.com",
      phone: "0901234567",
      companyName: "Tech Corp",
      servicePlanName: "Cloud VPS Pro",
      billingCycle: "Hàng tháng",
      estimatedPrice: 350000,
      status: 0, // Mới
      createdAt: new Date().toISOString(),
    },
    {
      id: "order-2",
      customerName: "Le Thi C",
      email: "c.le@example.com",
      phone: "0912345678",
      servicePlanName: "Dedicated Server",
      billingCycle: "Hàng năm",
      estimatedPrice: 2400000,
      status: 1, // Đang xử lý
      createdAt: new Date().toISOString(),
    },
  ];

  const mockAffiliates = [
    {
      id: "aff-1",
      fullName: "Dang Van D",
      email: "d.dang@partner.vn",
      phoneNumber: "0987654321",
      websiteOrSocialUrl: "https://myblog.vn",
      status: 0, // Chờ duyệt
      createdAt: new Date().toISOString(),
    },
  ];

  const mockNews = [
    {
      id: "news-1",
      title: "CloudServices nâng cấp hạ tầng Cloud Gen 4",
      slug: "cloudservices-nang-cap-ha-tang-gen-4",
      category: "Công nghệ",
      isPublished: true,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  ];

  it("should render KPI summary cards and default order requests table", () => {
    render(
      <EditorWorkspaceView
        initialOrders={mockOrders}
        initialAffiliates={mockAffiliates}
        initialNews={mockNews}
      />
    );

    expect(screen.getByText("Đơn dịch vụ chờ xử lý")).toBeInTheDocument();
    expect(screen.getByText("Đăng ký CTV chờ duyệt")).toBeInTheDocument();
    expect(screen.getByText("Bài viết đã xuất bản")).toBeInTheDocument();
    expect(screen.getByText("Tran Van B")).toBeInTheDocument();
    expect(screen.getByText("Cloud VPS Pro")).toBeInTheDocument();
  });

  it("should switch tabs to Affiliate registrations and News studio", () => {
    render(
      <EditorWorkspaceView
        initialOrders={mockOrders}
        initialAffiliates={mockAffiliates}
        initialNews={mockNews}
      />
    );

    // Switch to Affiliate Section
    const affTab = screen.getByRole("button", { name: /Đăng ký Affiliate/i });
    fireEvent.click(affTab);
    expect(screen.getByText("Dang Van D")).toBeInTheDocument();
    expect(screen.getByText("d.dang@partner.vn")).toBeInTheDocument();

    // Switch to News Section
    const newsTab = screen.getByRole("button", { name: /Tin tức & Blog/i });
    fireEvent.click(newsTab);
    expect(screen.getByText("CloudServices nâng cấp hạ tầng Cloud Gen 4")).toBeInTheDocument();
  });

  it("should display action buttons for order status transitions", () => {
    render(
      <EditorWorkspaceView
        initialOrders={mockOrders}
        initialAffiliates={mockAffiliates}
        initialNews={mockNews}
      />
    );

    expect(screen.getByText("Xử lý Yêu cầu Đặt dịch vụ")).toBeInTheDocument();
    expect(screen.getByText("Le Thi C")).toBeInTheDocument();
  });
});
