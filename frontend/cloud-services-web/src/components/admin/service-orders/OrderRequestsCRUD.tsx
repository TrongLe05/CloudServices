"use client";

import * as React from "react";
import { Cpu } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { OrderRequestsTable, OrderRequest } from "./OrderRequestsTable";
import { OrderRequestsFilter } from "./OrderRequestsFilter";
import { AdminPagination } from "../AdminPagination";

interface OrderRequestsCRUDProps {
  initialOrders: OrderRequest[];
}

export function OrderRequestsCRUD({ initialOrders }: OrderRequestsCRUDProps) {
  const [orders, setOrders] = React.useState<OrderRequest[]>(initialOrders);
  const [loading, setLoading] = React.useState(false);

  // Search & Filter
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("ALL");

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 6;

  const filteredOrders = React.useMemo(() => {
    return orders.filter((order) => {
      const matchSearch =
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.includes(searchTerm);
      const matchStatus =
        selectedStatus === "ALL" || String(order.status) === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [orders, searchTerm, selectedStatus]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus]);

  const paginatedOrders = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const handleStatusChange = async (id: string, nextStatus: number | string) => {
    setLoading(true);
    try {
      const statusStr = String(nextStatus);

      const res = await fetch(`/api/order-requests/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusStr }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Không thể cập nhật trạng thái");
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: nextStatus } : o))
      );
    } catch (err: any) {
      alert(err.message || "Lỗi khi cập nhật trạng thái");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-xs border border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Cpu className="size-5 text-primary" /> Yêu Cầu Đặt Dịch Vụ
        </CardTitle>
        <CardDescription>
          Xem và phê duyệt các yêu cầu đăng ký dịch vụ đám mây từ khách hàng
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <OrderRequestsFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Không tìm thấy yêu cầu đặt dịch vụ nào.
          </div>
        ) : (
          <>
            <OrderRequestsTable
              orders={paginatedOrders}
              onStatusChange={handleStatusChange}
              loading={loading}
            />

            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredOrders.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              itemName="yêu cầu"
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
