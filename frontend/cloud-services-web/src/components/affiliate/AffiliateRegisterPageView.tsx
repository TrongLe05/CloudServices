"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle2,
  Send,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Globe,
  Share2,
  Coins,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";
import {
  AFFILIATE_BENEFITS,
  AFFILIATE_STEPS,
  AFFILIATE_AUDIENCES,
} from "@/data/affiliate.data";
import { registerAffiliate } from "@/services/affiliate.services";

export function AffiliateRegisterPageView() {
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    websiteUrl: "",
    motivation: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.add({
        title: "Thiếu họ và tên",
        description: "Vui lòng nhập họ và tên của bạn.",
        type: "error",
      });
      return;
    }

    if (!formData.email.trim()) {
      toast.add({
        title: "Thiếu email",
        description: "Vui lòng nhập địa chỉ email hợp lệ.",
        type: "error",
      });
      return;
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 9) {
      toast.add({
        title: "Số điện thoại không hợp lệ",
        description: "Vui lòng nhập số điện thoại hợp lệ (từ 9 đến 11 chữ số).",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await registerAffiliate({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        websiteUrl: formData.websiteUrl.trim() || null,
        motivation: formData.motivation.trim() || null,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        let errorMsg = errData.message || errData.title || "Không thể gửi đơn đăng ký Affiliate.";
        if (errData.errors && typeof errData.errors === "object") {
          const firstErrKey = Object.keys(errData.errors)[0];
          if (firstErrKey && Array.isArray(errData.errors[firstErrKey])) {
            errorMsg = errData.errors[firstErrKey][0];
          }
        }
        throw new Error(errorMsg);
      }

      setSubmitted(true);
      toast.add({
        title: "Đăng ký thành công!",
        description: "Đơn đăng ký Đối tác Tiếp thị của bạn đã được gửi thành công đến CloudServices.",
        type: "success",
      });
    } catch (err: any) {
      toast.add({
        title: "Lỗi đăng ký",
        description: err.message || "Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại sau.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      {/* 1. Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="mx-auto max-w-3xl space-y-5 relative z-10">
          <Badge className="bg-amber-400/20 text-amber-300 border-amber-400/30 text-xs font-bold px-3.5 py-1">
            <Coins className="size-3.5 mr-1.5" /> HOA HỒNG TRỌN ĐỜI LÊN ĐẾN 20%
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight font-heading">
            Chương Trình Đối Tác Tiếp Thị <br />
            <span className="text-indigo-400">CloudServices Affiliate</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Hợp tác cùng nhà cung cấp dịch vụ Điện toán Đám mây hàng đầu. Nhận hoa hồng định kỳ hấp dẫn từ mỗi khách hàng bạn giới thiệu sử dụng Cloud Server, VPS và Database.
          </p>
        </div>
      </section>

      {/* 2. Key Benefits Highlights Grid */}
      <section className="mx-auto max-w-7xl px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AFFILIATE_BENEFITS.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <Card key={idx} className="rounded-3xl border-slate-200 shadow-md bg-white hover:shadow-lg transition-all">
                <CardHeader className="pb-3 space-y-2">
                  <div className={`size-11 rounded-2xl ${benefit.colorClass} flex items-center justify-center`}>
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-base font-bold text-slate-900">{benefit.title}</CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    {benefit.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 3. Main Form & Program Policy */}
      <section className="mx-auto max-w-7xl px-6 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* CỘT TRÁI: Quy trình tham gia & Hướng dẫn (5 Cột) */}
          <aside className="lg:col-span-5 space-y-6">
            <Card className="rounded-3xl border-slate-200/80 shadow-xs bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <TrendingUp className="size-5 text-primary" />
                  Quy Trình 3 Bước Tham Gia
                </CardTitle>
                <CardDescription className="text-xs">
                  Bắt đầu gia tăng thu nhập thụ động cùng CloudServices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs text-slate-600">
                {AFFILIATE_STEPS.map((stepItem, idx) => (
                  <React.Fragment key={stepItem.step}>
                    {idx > 0 && <Separator />}
                    <div className="flex items-start gap-3">
                      <div className="size-6 rounded-full bg-primary text-white font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                        {stepItem.step}
                      </div>
                      <div>
                        <strong className="block text-slate-900 text-sm">{stepItem.title}</strong>
                        {stepItem.desc}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-slate-200/80 shadow-xs bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <HelpCircle className="size-5 text-amber-600" />
                  Ai Phù Hợp Làm Affiliate?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 text-xs text-slate-600">
                {AFFILIATE_AUDIENCES.map((audience, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span>{audience}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>

          {/* CỘT PHẢI: Form Đăng ký (7 Cột) */}
          <article className="lg:col-span-7">
            <Card className="rounded-3xl border-slate-200/80 shadow-md bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-black text-slate-900 font-heading flex items-center gap-2">
                  <Send className="size-5 text-primary" />
                  Biểu Mẫu Đăng Ký Đối Tác Tiếp Thị
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Vui lòng cung cấp thông tin chính xác để hệ thống xác thực và kích hoạt mã tiếp thị riêng cho bạn.
                </CardDescription>
              </CardHeader>

              <CardContent>
                {submitted ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                    <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 className="size-9 stroke-[2.5]" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Đơn đăng ký đã được tiếp nhận!</h3>
                    <p className="text-xs text-slate-600 max-w-md leading-relaxed">
                      Chào mừng <strong>{formData.fullName}</strong> đến với mạng lưới đối tác CloudServices. Đội ngũ phụ trách sẽ xem xét hồ sơ và liên hệ kích hoạt tài khoản tiếp thị qua email <strong>{formData.email}</strong> trong vòng 24 giờ làm việc.
                    </p>
                    <Button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          fullName: "",
                          email: "",
                          phone: "",
                          websiteUrl: "",
                          motivation: "",
                        });
                      }}
                      variant="outline"
                      className="rounded-xl text-xs mt-2"
                    >
                      Gửi thêm đơn đăng ký khác
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Họ và tên */}
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-xs font-semibold text-slate-700">
                        Họ và tên / Tên tổ chức <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="Nguyễn Văn A"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                        className="h-10 text-xs rounded-xl bg-slate-50/50"
                      />
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                          Địa chỉ Email <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="partner@example.vn"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="h-10 text-xs rounded-xl bg-slate-50/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">
                          Số điện thoại (10 chữ số) <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          id="phone"
                          maxLength={10}
                          placeholder="0988123456"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                          className="h-10 text-xs rounded-xl bg-slate-50/50"
                        />
                      </div>
                    </div>

                    {/* Website / Kênh truyền thông */}
                    <div className="space-y-1.5">
                      <Label htmlFor="websiteUrl" className="text-xs font-semibold text-slate-700">
                        Website / Kênh mạng xã hội / Diễn đàn (nếu có)
                      </Label>
                      <Input
                        id="websiteUrl"
                        placeholder="https://mytechblog.vn hoặc https://facebook.com/..."
                        value={formData.websiteUrl}
                        onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                        className="h-10 text-xs rounded-xl bg-slate-50/50"
                      />
                    </div>

                    {/* Động lực / Định hướng quảng bá */}
                    <div className="space-y-1.5">
                      <Label htmlFor="motivation" className="text-xs font-semibold text-slate-700">
                        Kế hoạch & Kênh tiếp thị dự kiến
                      </Label>
                      <Textarea
                        id="motivation"
                        rows={4}
                        placeholder="Mô tả ngắn gọn về đối tượng khách hàng tiềm năng hoặc các phương thức bạn dự định triển khai (Viết bài đánh giá, đặt banner, tư vấn trực tiếp cho khách hàng làm website...)"
                        value={formData.motivation}
                        onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                        className="text-xs rounded-xl bg-slate-50/50 resize-y"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl shadow-md gap-2"
                    >
                      <Send className="size-4" />
                      {loading ? "Đang gửi đơn đăng ký..." : "Gửi hồ sơ đăng ký Affiliate ngay"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </article>

        </div>
      </section>
    </main>
  );
}
