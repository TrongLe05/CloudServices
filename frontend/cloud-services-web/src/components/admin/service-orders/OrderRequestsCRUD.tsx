"use client";

import * as React from "react";
import { Cpu } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { OrderRequestsTable, OrderRequest } from "./OrderRequestsTable";
import { OrderRequestsFilter } from "./OrderRequestsFilter";
import { AdminPagination } from "../AdminPagination";

import { toast } from "@/components/ui/toast";

interface OrderRequestsCRUDProps {
  initialOrders: OrderRequest[];
}

export function OrderRequestsCRUD({ initialOrders }: OrderRequestsCRUDProps) {
  const [orders, setOrders] = React.useState<OrderRequest[]>(initialOrders);
  const [loading, setLoading] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);

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

      toast.add({
        title: "Cập nhật thành công",
        description: "Đã cập nhật trạng thái yêu cầu đặt dịch vụ.",
        type: "success",
      });
    } catch (err: any) {
      toast.add({
        title: "Lỗi cập nhật",
        description: err.message || "Lỗi khi cập nhật trạng thái",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedStatus !== "ALL") params.append("status", selectedStatus);

      const res = await fetch(`/api/order-requests/export?${params.toString()}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Không thể xuất file Excel");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `OrderRequests_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.add({
        title: "Xuất file thành công",
        description: "Đã tải xuống danh sách yêu cầu đặt dịch vụ dạng Excel.",
        type: "success",
      });
    } catch (err: any) {
      toast.add({
        title: "Lỗi xuất file",
        description: err.message || "Lỗi khi xuất file Excel",
        type: "error",
      });
    } finally {
      setExporting(false);
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
          onExport={handleExport}
          isExporting={exporting}
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
