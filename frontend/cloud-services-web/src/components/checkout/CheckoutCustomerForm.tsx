import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { User, Mail, Phone, Building2, FileText, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckoutFormData } from "@/types/checkout.types";

export interface CheckoutCustomerFormProps {
  form: UseFormReturn<CheckoutFormData>;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function CheckoutCustomerForm({
  form,
  onBack,
  onSubmit,
  isSubmitting = false,
}: CheckoutCustomerFormProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Thông tin kích hoạt dịch vụ
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Thông tin dùng để bàn giao quyền quản trị máy chủ và xuất hóa đơn VAT điện tử.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Họ tên */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <User className="size-3.5 text-slate-400" />
              Họ và tên <span className="text-rose-500">*</span>
            </label>
            <Input
              {...register("fullName")}
              placeholder="Nguyễn Văn A"
              className={`h-11 rounded-xl bg-slate-50/50 ${
                errors.fullName ? "border-rose-400 focus-visible:ring-rose-200" : ""
              }`}
            />
            {errors.fullName && (
              <p className="text-[11px] text-rose-500 font-medium">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Mail className="size-3.5 text-slate-400" />
              Email nhận thông tin máy chủ <span className="text-rose-500">*</span>
            </label>
            <Input
              {...register("email")}
              type="email"
              placeholder="your-email@company.vn"
              className={`h-11 rounded-xl bg-slate-50/50 ${
                errors.email ? "border-rose-400 focus-visible:ring-rose-200" : ""
              }`}
            />
            {errors.email && (
              <p className="text-[11px] text-rose-500 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Số điện thoại */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Phone className="size-3.5 text-slate-400" />
              Số điện thoại <span className="text-rose-500">*</span>
            </label>
            <Input
              {...register("phone")}
              placeholder="0912 345 678"
              className={`h-11 rounded-xl bg-slate-50/50 ${
                errors.phone ? "border-rose-400 focus-visible:ring-rose-200" : ""
              }`}
            />
            {errors.phone && (
              <p className="text-[11px] text-rose-500 font-medium">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Tên công ty / Doanh nghiệp */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Building2 className="size-3.5 text-slate-400" />
              Tên công ty / Tổ chức (Tùy chọn)
            </label>
            <Input
              {...register("companyName")}
              placeholder="Công ty TNHH Giải Pháp Công Nghệ..."
              className="h-11 rounded-xl bg-slate-50/50"
            />
          </div>

          {/* Ghi chú thêm */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <FileText className="size-3.5 text-slate-400" />
              Yêu cầu kỹ thuật bổ sung (Hệ điều hành, Port, Cấu hình IP...)
            </label>
            <Input
              {...register("notes")}
              placeholder="Ví dụ: Cài Ubuntu 22.04 LTS, mở Port 80, 443..."
              className="h-11 rounded-xl bg-slate-50/50"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-11 px-6 rounded-xl font-semibold text-xs border-slate-200 gap-1.5"
        >
          <ArrowLeft className="size-4" /> Quay lại chọn gói
        </Button>

        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="h-11 px-8 rounded-xl font-bold text-xs bg-primary text-white shadow-md hover:bg-primary/95 gap-1.5"
        >
          <span>Tạo đơn và Thanh toán</span>
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
