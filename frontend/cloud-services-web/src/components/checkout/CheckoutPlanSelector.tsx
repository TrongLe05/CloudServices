import * as React from "react";
import {
  Check,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Cpu,
  HardDrive,
  Layers,
  Activity,
  Server,
  ArrowRight,
  RefreshCw,
  Zap,
  Globe,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ServicePlanItem } from "@/types/plans.types";
import { formatVND } from "@/lib/formatUtils";

export interface CheckoutPlanSelectorProps {
  plans: ServicePlanItem[];
  selectedPlan: ServicePlanItem | null;
  selectedCycle: string;
  onSelectPlan: (plan: ServicePlanItem) => void;
  onSelectCycle: (cycle: string) => void;
  onNext: () => void;
}

export function CheckoutPlanSelector({
  plans,
  selectedPlan,
  selectedCycle,
  onSelectPlan,
  onSelectCycle,
  onNext,
}: CheckoutPlanSelectorProps) {
  const [showPlanSwitcher, setShowPlanSwitcher] = React.useState(false);

  // Lấy danh sách chu kỳ giá theo cấu hình gói hoặc fallback sang mặc định
  const availablePrices = selectedPlan?.prices && selectedPlan.prices.length > 0
    ? selectedPlan.prices
    : [
        { billingCycle: "Monthly", price: 0 },
        { billingCycle: "Yearly", price: 0 },
      ];

  const currentPriceObj =
    selectedPlan?.prices?.find(
      (p) => p.billingCycle.toLowerCase() === selectedCycle.toLowerCase()
    ) || selectedPlan?.prices?.[0];

  const rawPrice = currentPriceObj?.price || 0;
  const discountPct =
    currentPriceObj?.promotionDiscountPercentage ||
    selectedPlan?.promotion?.discountPercentage ||
    0;
  const isCustomQuote = rawPrice <= 0;

  // Format label chu kỳ
  const getCycleLabel = (cycle: string) => {
    switch (cycle.toLowerCase()) {
      case "monthly":
        return { label: "Hàng tháng (1 Tháng)", period: "tháng", hint: "Linh hoạt từng tháng" };
      case "quarterly":
        return { label: "Hàng quý (3 Tháng)", period: "quý", hint: "Tiết kiệm 5%" };
      case "semiannually":
        return { label: "Nửa năm (6 Tháng)", period: "6 tháng", hint: "Tiết kiệm 10%" };
      case "yearly":
        return { label: "Hàng năm (12 Tháng)", period: "năm", hint: "Ưu đãi lớn nhất" };
      case "biennially":
        return { label: "2 Năm (24 Tháng)", period: "2 năm", hint: "Tiết kiệm 25%" };
      case "triennially":
        return { label: "3 Năm (36 Tháng)", period: "3 năm", hint: "Tiết kiệm 30%" };
      default:
        return { label: cycle, period: "kỳ", hint: "" };
    }
  };

  // Nếu chưa có gói nào được chọn (trường hợp hi hữu vào link trực tiếp mà không có plan)
  if (!selectedPlan) {
    return (
      <Card className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm text-center space-y-6">
        <CardHeader className="p-0 space-y-4">
          <div className="size-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Server className="size-8" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-xl font-bold text-slate-900 font-heading">
              Vui lòng chọn 1 gói cấu hình dịch vụ
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 max-w-md mx-auto">
              Hệ thống chưa nhận diện được gói cấu hình bạn muốn đặt. Hãy chọn một trong các gói dưới đây để tiếp tục:
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left pt-2">
            {plans.map((p) => (
              <Card
                key={p.id}
                onClick={() => onSelectPlan(p)}
                className="p-4 rounded-2xl border border-slate-200 hover:border-primary hover:shadow-md cursor-pointer transition-all bg-white"
              >
                <CardHeader className="p-0">
                  <CardTitle className="font-bold text-slate-900 text-sm">{p.name}</CardTitle>
                  <CardDescription className="text-xs text-slate-500 line-clamp-2 mt-1 mb-3">
                    {p.description || "Máy chủ đám mây thế hệ mới"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <span className="text-xs font-bold text-primary">
                    {p.prices?.[0]?.price ? formatVND(p.prices[0].price) : "Liên hệ báo giá"}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. KHỐI HIỂN THỊ CẤU HÌNH GÓI ĐÃ CHỌN */}
      <Card className="p-6 md:p-8 rounded-3xl bg-white border-2 border-primary/20 shadow-sm relative overflow-hidden">
        {/* Subtle Decorative Background Element */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-linear-to-bl from-primary/10 via-primary/5 to-transparent rounded-bl-full pointer-events-none -mr-16 -mt-16" />

        <div className="relative space-y-6">
          {/* Header Card: Tên gói & Nút Đổi gói */}
          <CardHeader className="p-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <CheckCircle2 className="size-3.5" />
                  Cấu hình đang chọn
                </span>
                {selectedPlan.categoryName && (
                  <Badge variant="outline" className="font-semibold text-slate-600 bg-slate-50 border-slate-200">
                    {selectedPlan.categoryName}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
                {selectedPlan.name}
              </CardTitle>
              {selectedPlan.description && (
                <CardDescription className="text-sm text-slate-600 max-w-2xl">
                  {selectedPlan.description}
                </CardDescription>
              )}
            </div>

            {plans.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPlanSwitcher((prev) => !prev)}
                className="shrink-0 rounded-xl border-slate-200 hover:border-primary hover:text-primary font-semibold text-xs h-9 px-3.5 gap-1.5 self-start sm:self-center"
              >
                <RefreshCw className="size-3.5" />
                {showPlanSwitcher ? "Đóng danh sách" : "Đổi gói khác"}
              </Button>
            )}
          </CardHeader>

          {/* Collapsible Switcher nếu người dùng muốn chọn gói khác */}
          {showPlanSwitcher && plans.length > 1 && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Chọn gói cấu hình khác ({plans.length} gói):
                </span>
                <button
                  type="button"
                  onClick={() => setShowPlanSwitcher(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-medium"
                >
                  Thu gọn ✕
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {plans.map((p) => {
                  const isCurrent = p.id === selectedPlan.id;
                  const pPrice = p.prices?.[0]?.price || 0;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        onSelectPlan(p);
                        setShowPlanSwitcher(false);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                        isCurrent
                          ? "border-primary bg-primary/10 ring-1 ring-primary font-bold shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-slate-900">{p.name}</span>
                        {isCurrent && <Check className="size-3 text-primary" />}
                      </div>
                      <span className="text-[11px] font-semibold text-primary">
                        {pPrice > 0 ? formatVND(pPrice) : "Liên hệ báo giá"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bảng Chi tiết Thông số phần cứng của cấu hình đã chọn */}
          <CardContent className="p-0 space-y-6">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Thông số tài nguyên phần cứng
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {/* CPU */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="size-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Cpu className="size-4" />
                    </div>
                    <span className="text-xs font-medium text-slate-500">Vi xử lý (CPU)</span>
                  </div>
                  <span className="text-sm font-extrabold text-slate-900">
                    {selectedPlan.cpu || "Tối ưu hóa"}
                  </span>
                </div>

                {/* RAM */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="size-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Layers className="size-4" />
                    </div>
                    <span className="text-xs font-medium text-slate-500">Bộ nhớ (RAM)</span>
                  </div>
                  <span className="text-sm font-extrabold text-slate-900">
                    {selectedPlan.ram || "Tốc độ cao"}
                  </span>
                </div>

                {/* SSD Storage */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="size-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <HardDrive className="size-4" />
                    </div>
                    <span className="text-xs font-medium text-slate-500">Lưu trữ SSD</span>
                  </div>
                  <span className="text-sm font-extrabold text-slate-900">
                    {selectedPlan.storage || "SSD Enterprise"}
                  </span>
                </div>

                {/* Bandwidth */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="size-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Activity className="size-4" />
                    </div>
                    <span className="text-xs font-medium text-slate-500">Băng thông</span>
                  </div>
                  <span className="text-sm font-extrabold text-slate-900 truncate" title={selectedPlan.bandwidth || "Không giới hạn"}>
                    {selectedPlan.bandwidth || "Không giới hạn"}
                  </span>
                </div>
              </div>
            </div>

            {/* Hạ tầng & Cam kết đi kèm cấu hình */}
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Dịch vụ hạ tầng &amp; Tính năng đi kèm
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50/50 border border-slate-100">
                  <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                  <span>Uptime SLA: <strong>{selectedPlan.uptimeSla || "99.99%"}</strong></span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50/50 border border-slate-100">
                  <Globe className="size-4 text-indigo-600 shrink-0" />
                  <span>Địa chỉ IP: <strong>01 IPv4 Dedicated</strong></span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50/50 border border-slate-100">
                  <Lock className="size-4 text-rose-600 shrink-0" />
                  <span>Bảo vệ: <strong>Anti-DDoS 10Gbps</strong></span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50/50 border border-slate-100">
                  <Zap className="size-4 text-amber-600 shrink-0" />
                  <span>Khởi tạo: <strong>Tức thì sau 30s</strong></span>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* 2. CHỌN CHU KỲ THANH TOÁN */}
      <Card className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
        <CardHeader className="p-0 flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold text-slate-900 font-heading">
              2. Chọn chu kỳ thanh toán
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Lựa chọn kỳ thanh toán phù hợp cho gói cấu hình của bạn.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {availablePrices.map((priceItem) => {
              const cycleKey = priceItem.billingCycle;
              const cycleMeta = getCycleLabel(cycleKey);
              const isSelected = selectedCycle.toLowerCase() === cycleKey.toLowerCase();
              const itemPrice = priceItem.price || 0;
              const itemDiscount = priceItem.promotionDiscountPercentage || 0;
              const discountedPrice = itemDiscount > 0
                ? Math.round(itemPrice * (1 - itemDiscount / 100))
                : itemPrice;

              return (
                <button
                  key={cycleKey}
                  type="button"
                  onClick={() => onSelectCycle(cycleKey)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative flex flex-col justify-between gap-3 ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {cycleMeta.label}
                        </span>
                        {itemDiscount > 0 && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700">
                            -{itemDiscount}%
                          </span>
                        )}
                      </div>
                      {cycleMeta.hint && (
                        <span className="text-[11px] text-slate-400 font-medium">
                          {cycleMeta.hint}
                        </span>
                      )}
                    </div>
                    <div
                      className={`size-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="size-3" />}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                    <span className="text-xs text-slate-400 font-medium">Thành tiền:</span>
                    <div className="text-right">
                      {itemDiscount > 0 && itemPrice > 0 && (
                        <span className="text-xs text-slate-400 line-through mr-1.5">
                          {formatVND(itemPrice)}
                        </span>
                      )}
                      <span className="text-sm font-extrabold text-primary">
                        {discountedPrice > 0
                          ? formatVND(discountedPrice)
                          : "Liên hệ báo giá"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {isCustomQuote && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                Gói này có cấu hình theo yêu cầu doanh nghiệp (0đ). Đội ngũ kỹ sư của CloudServices sẽ liên hệ trực tiếp để khảo sát và báo mức chiết khấu tốt nhất.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. NÚT TIẾP TỤC */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-slate-500 hidden sm:block">
          Cấu hình: <strong className="text-slate-800">{selectedPlan.name}</strong> • Chu kỳ: <strong className="text-slate-800">{getCycleLabel(selectedCycle).label}</strong>
        </div>
        <Button
          type="button"
          onClick={onNext}
          className="h-12 px-8 rounded-xl font-bold text-sm bg-primary text-white shadow-md hover:bg-primary/95 gap-2 ml-auto"
        >
          <span>Tiếp tục: Nhập thông tin</span>
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}


