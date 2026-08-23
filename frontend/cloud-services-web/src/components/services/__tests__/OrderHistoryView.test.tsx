import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { OrderHistoryView } from "../OrderHistoryView";
import { UserOrder } from "@/types/orders.types";

describe("OrderHistoryView Component", () => {
  const mockOrders: UserOrder[] = [
    {
      id: "ord-1",
      customerName: "Nguyen Van A",
      email: "a.nguyen@test.com",
      phone: "0901112223",
      servicePlanId: "plan-1",
      servicePlanName: "Cloud Server Standard",
      billingCycle: "Hàng tháng",
      estimatedPrice: 450000,
      status: "New",
      createdAt: new Date().toISOString(),
    },
    {
      id: "ord-2",
      customerName: "Nguyen Van A",
      email: "a.nguyen@test.com",
      phone: "0901112223",
      servicePlanId: "plan-2",
      servicePlanName: "Cloud GPU AI Pro",
      billingCycle: "Hàng năm",
      estimatedPrice: 12000000,
      status: "Completed",
      createdAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("order-requests")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ items: mockOrders }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({}),
      });
    });
  });

  it("should render order history title and service items", async () => {
    render(<OrderHistoryView initialOrders={mockOrders} userEmail="a.nguyen@test.com" />);

    await waitFor(() => {
      expect(screen.getByText("Lịch sử đơn dịch vụ đám mây")).toBeInTheDocument();
      expect(screen.getByText("Cloud Server Standard")).toBeInTheDocument();
      expect(screen.getByText("Cloud GPU AI Pro")).toBeInTheDocument();
    });
  });

  it("should render empty state when no orders exist", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [] }),
    });

    render(<OrderHistoryView initialOrders={[]} userEmail="empty@test.com" />);

    await waitFor(() => {
      expect(screen.getByText(/Không tìm thấy đơn dịch vụ nào/i)).toBeInTheDocument();
    });
  });

  it("should filter orders when search query is typed", async () => {
    render(<OrderHistoryView initialOrders={mockOrders} userEmail="a.nguyen@test.com" />);

    await waitFor(() => {
      expect(screen.getByText("Cloud GPU AI Pro")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Tìm theo tên gói, mã đơn #ID, doanh nghiệp/i);
    fireEvent.change(searchInput, { target: { value: "GPU" } });

    await waitFor(() => {
      expect(screen.getByText("Cloud GPU AI Pro")).toBeInTheDocument();
      expect(screen.queryByText("Cloud Server Standard")).not.toBeInTheDocument();
    });
  });
});
