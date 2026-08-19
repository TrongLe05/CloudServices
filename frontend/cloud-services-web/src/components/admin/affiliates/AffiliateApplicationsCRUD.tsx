"use client";

import * as React from "react";
import { Users } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  AffiliateApplicationsTable,
  AffiliateApplication,
} from "./AffiliateApplicationsTable";
import { AffiliateApplicationsFilter } from "./AffiliateApplicationsFilter";
import { AdminPagination } from "../AdminPagination";

interface AffiliateApplicationsCRUDProps {
  initialApplications: AffiliateApplication[];
}

export function AffiliateApplicationsCRUD({
  initialApplications,
}: AffiliateApplicationsCRUDProps) {
  const [applications, setApplications] =
    React.useState<AffiliateApplication[]>(initialApplications);
  const [loading, setLoading] = React.useState(false);

  // Search & Filter
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("ALL");

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 6;

  const filteredApps = React.useMemo(() => {
    return applications.filter((app) => {
      const matchSearch =
        app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone.includes(searchTerm);
      const matchStatus =
        selectedStatus === "ALL" || String(app.status) === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [applications, searchTerm, selectedStatus]);

  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus]);

  const paginatedApps = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredApps.slice(start, start + itemsPerPage);
  }, [filteredApps, currentPage]);

  const handleStatusChange = async (
    id: string,
    nextStatus: number | string,
  ) => {
    setLoading(true);
    try {
      const statusStr = String(nextStatus);

      const res = await fetch(`/api/affiliates/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusStr }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Không thể cập nhật trạng thái");
      }

      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: nextStatus } : a)),
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
          <Users className="size-5 text-primary" /> Đơn Đăng Ký Đối Tác
          Affiliate
        </CardTitle>
        <CardDescription>
          Quản lý xét duyệt đơn đăng ký tham gia chương trình tiếp thị liên kết
          từ đối tác
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AffiliateApplicationsFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />

        {filteredApps.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Không tìm thấy đơn đăng ký nào.
          </div>
        ) : (
          <>
            <AffiliateApplicationsTable
              applications={paginatedApps}
              onStatusChange={handleStatusChange}
              loading={loading}
            />

            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredApps.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              itemName="đơn đăng ký"
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
