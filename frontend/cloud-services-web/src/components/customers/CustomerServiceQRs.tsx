"use client";

import * as React from "react";
import Link from "next/link";
import {
  QrCode,
  Download,
  ExternalLink,
  Cpu,
  HardDrive,
  Activity,
  Layers,
  Search,
  Check,
  Sparkles,
  Smartphone,
  Server,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { formatVND } from "@/lib/formatUtils";
import { PlanSpecsList } from "@/components/common/PlanSpecsList";
import { SAMPLE_PLANS, ServicePlanItem } from "@/data/customerQrs.data";

export type { ServicePlanItem };

interface CustomerServiceQRsProps {
  initialPlans?: ServicePlanItem[];
}


// Subcomponent cho từng thẻ gói dịch vụ & QR Code lấy trực tiếp từ Backend API
function ServicePlanQrCard({ plan }: { plan: ServicePlanItem }) {
  const [qrBase64, setQrBase64] = React.useState<string | null>(plan.qrCodeUrl || null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!plan.id || plan.qrCodeUrl) return;

    let isMounted = true;
    const fetchQr = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/service-plans/${plan.id}/qr-code`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.qrCodeBase64) {
            setQrBase64(data.qrCodeBase64);
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải mã QR từ API:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchQr();
    return () => {
      isMounted = false;
    };
  }, [plan.id, plan.qrCodeUrl]);

  const currentPrice = plan.prices?.[0]?.price ?? 0;
  const isQuote = currentPrice <= 0;

  const imageSrc = qrBase64
    ? qrBase64.startsWith("data:")
      ? qrBase64
      : `data:image/png;base64,${qrBase64}`
    : "";

  const handleDownloadQr = () => {
    if (!imageSrc) {
      toast.add({
        title: "Đang tải mã QR",
        description: "Vui lòng chờ mã QR tải xong trước khi lưu ảnh.",
        type: "error",
      });
      return;
    }

    const a = document.createElement("a");
    a.href = imageSrc;
    a.download = `QR-${plan.name.replace(/\s+/g, "-")}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast.add({
      title: "Đã tải mã QR",
      description: `Mã QR của gói ${plan.name} đã được lưu về máy.`,
      type: "success",
    });
  };

  return (
    <li className="h-full">
      <Card className="h-full p-6 rounded-3xl bg-white border border-slate-200 hover:border-primary/50 hover:shadow-lg transition-all flex flex-col justify-between space-y-6">
        {/* Header: Tên gói & Danh mục */}
        <CardHeader className="p-0 space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border-indigo-100">
              {plan.categoryName || "Cloud Service"}
            </Badge>
            <span className="text-xs font-black text-primary">
              {formatVND(currentPrice)}
            </span>
          </div>

          <CardTitle className="text-lg font-bold text-slate-900 line-clamp-1">
            {plan.name}
          </CardTitle>

          {plan.description && (
            <CardDescription className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {plan.description}
            </CardDescription>
          )}
        </CardHeader>

        {/* QR Code Figure lấy trực tiếp từ Backend API */}
        <CardContent className="p-0 space-y-4">
          <figure className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center space-y-3">
            <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:scale-105 transition-transform flex items-center justify-center min-h-[144px] min-w-[144px]">
              {loading ? (
                <div className="size-36 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Loader2 className="size-6 animate-spin text-primary" />
                  <span className="text-[10px] font-medium">Đang tạo mã QR...</span>
                </div>
              ) : imageSrc ? (
                <img
                  src={imageSrc}
                  alt={`Mã QR ${plan.name}`}
                  className="size-36 object-contain rounded-lg"
                />
              ) : (
                <div className="size-36 flex flex-col items-center justify-center text-slate-300">
                  <QrCode className="size-8" />
                </div>
              )}
            </div>
            <figcaption className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
              <Smartphone className="size-3 text-slate-400" />
              <span>Quét bằng Camera / Zalo để xem chi tiết</span>
            </figcaption>
          </figure>

          {/* Specifications Definition List */}
          <PlanSpecsList
            cpu={plan.cpu}
            ram={plan.ram}
            storage={plan.storage}
            bandwidth={plan.bandwidth}
            variant="dl"
            className="border-t border-slate-100 pt-4"
          />
        </CardContent>

        {/* Footer Actions */}
        <CardFooter className="p-0 pt-2 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadQr}
            disabled={!imageSrc}
            className="flex-1 text-xs font-semibold rounded-xl border-slate-200 hover:bg-slate-100"
            title="Tải ảnh QR về máy"
          >
            <Download className="size-3.5 mr-1" />
            Tải QR
          </Button>

          <Button
            size="sm"
            className="flex-1 text-xs font-semibold rounded-xl bg-primary hover:bg-primary/95 text-white shadow-xs"
            render={
              isQuote ? (
                <Link href={`/lien-he?service=${encodeURIComponent(plan.name)}`} />
              ) : (
                <Link href={`/dat-hang?plan=${encodeURIComponent(plan.id || plan.name)}`} />
              )
            }
          >
            <ExternalLink className="size-3.5 mr-1" />
            {isQuote ? "Báo giá" : "Đặt ngay"}
          </Button>
        </CardFooter>
      </Card>
    </li>
  );
}

export function CustomerServiceQRs({
  initialPlans = [],
}: CustomerServiceQRsProps) {
  const [plans, setPlans] = React.useState<ServicePlanItem[]>(
    initialPlans.length > 0 ? initialPlans : SAMPLE_PLANS
  );
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("ALL");

  // Lấy danh sách danh mục độc nhất
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    plans.forEach((p) => {
      if (p.categoryName) set.add(p.categoryName);
    });
    return ["ALL", ...Array.from(set)];
  }, [plans]);

  const filteredPlans = React.useMemo(() => {
    return plans.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.cpu && p.cpu.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory =
        selectedCategory === "ALL" || p.categoryName === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [plans, searchTerm, selectedCategory]);

  return (
    <section
      id="service-qrs"
      aria-labelledby="service-qrs-heading"
      className="py-16 sm:py-20 bg-white border-b border-slate-200"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <Badge variant="outline" className="text-xs font-semibold px-3 py-1 bg-slate-50 border-slate-300">
              <QrCode className="size-3.5 mr-1 text-primary" />
              Tra Cứu & Quét Mã QR Gói Dịch Vụ
            </Badge>
            <h2 id="service-qrs-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Mã QR thông số & Đăng ký nhanh từng gói dịch vụ
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Mã QR được khởi tạo trực tiếp từ hệ thống Backend CloudServices. Quét mã QR bằng Camera điện thoại hoặc Zalo để xem cấu hình chi tiết và đặt dịch vụ ngay lập tức.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72 self-start md:self-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Tìm theo tên gói, CPU, RAM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 text-xs rounded-xl bg-slate-50 border-slate-200"
            />
          </div>
        </header>

        {/* Category Pills Navigation */}
        <nav aria-label="Lọc theo danh mục dịch vụ" className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat === "ALL" ? "Tất cả danh mục" : cat}
            </button>
          ))}
        </nav>

        {/* Semantic Service Plan QR Cards Grid */}
        {filteredPlans.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Server className="size-10 mx-auto text-slate-300" />
            <h3 className="text-sm font-bold text-slate-700">Không tìm thấy gói dịch vụ phù hợp</h3>
            <p className="text-xs text-slate-500">Vui lòng thử tìm kiếm với từ khóa khác.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0">
            {filteredPlans.map((plan) => (
              <ServicePlanQrCard key={plan.id} plan={plan} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
