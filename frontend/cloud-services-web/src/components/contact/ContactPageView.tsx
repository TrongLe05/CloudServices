"use client";

import * as React from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Building2,
  Headphones,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
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

export function ContactPageView() {
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    serviceInterest: "Cloud Server (VM)",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.add({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ họ tên, email và nội dung yêu cầu.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    // Giả lập gửi thông tin liên hệ / ticket tư vấn
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setSubmitted(true);
    toast.add({
      title: "Gửi liên hệ thành công!",
      description: "Đội ngũ chuyên viên tư vấn CloudServices sẽ phản hồi trong vòng 15-30 phút.",
      type: "success",
    });
  };

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200/80 py-16 px-6 text-center">
        <div className="mx-auto max-w-3xl space-y-4">
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-bold px-3 py-1">
            <Sparkles className="size-3.5 mr-1.5" /> HỖ TRỢ KỸ THUẬT & TƯ VẤN 24/7/365
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight font-heading">
            Liên Hệ Đội Ngũ CloudServices
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Bạn đang cần tư vấn kiến trúc đám mây, nâng cấp hạ tầng hoặc yêu cầu báo giá giải pháp tùy chỉnh? Chúng tôi luôn sẵn sàng đồng hành cùng doanh nghiệp bạn.
          </p>
        </div>
      </section>

      {/* 3. Main Content Container */}
      <section className="mx-auto max-w-7xl px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* CỘT TRÁI: Contact Information Cards (5 Cột) */}
          <aside className="lg:col-span-5 space-y-6">
            
            {/* Card 1: Trụ sở & Văn phòng */}
            <Card className="rounded-3xl border-slate-200/80 shadow-xs bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Building2 className="size-5 text-primary" />
                  Trụ Sở & Trung Tâm Dữ Liệu
                </CardTitle>
                <CardDescription className="text-xs">
                  Hạ tầng máy chủ tiêu chuẩn quốc tế Tier III
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Trụ sở chính:</strong>
                    Tòa nhà Công nghệ FPT, Khu Công nghệ cao Hòa Lạc, Hà Nội
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Chi nhánh TP. Hồ Chí Minh:</strong>
                    Khu Công viên Phần mềm Quang Trung, Quận 12, TP. HCM
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Kênh hỗ trợ trực tiếp */}
            <Card className="rounded-3xl border-slate-200/80 shadow-xs bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Headphones className="size-5 text-indigo-600" />
                  Kênh Kết Nối Nhanh
                </CardTitle>
                <CardDescription className="text-xs">
                  Phản hồi ngay lập tức qua Hotline và Email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs text-slate-600">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <Phone className="size-4 text-emerald-600" />
                    <div>
                      <span className="text-[11px] text-slate-500 block">Hotline Kinh Doanh & Kỹ Thuật</span>
                      <strong className="text-sm text-slate-900">1900 6868 - 0988 123 456</strong>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px]">
                    24/7
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <Mail className="size-4 text-blue-600" />
                    <div>
                      <span className="text-[11px] text-slate-500 block">Hộp thư hỗ trợ chính thức</span>
                      <strong className="text-xs text-slate-900">support@cloudservices.vn</strong>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 text-[10px]">
                    Email
                  </Badge>
                </div>

                <div className="flex items-center gap-3 pt-1 text-slate-500">
                  <Clock className="size-4 text-slate-400 shrink-0" />
                  <span>Thời gian làm việc văn phòng: <strong>08:00 - 17:30 (Thứ 2 - Thứ 6)</strong>. Hệ thống NOC trực 24/7/365.</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Cam kết chất lượng SLA */}
            <Card className="rounded-3xl border-primary/20 bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-md">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="size-4" /> Cam kết chất lượng dịch vụ
                </div>
                <h4 className="text-base font-bold leading-snug">
                  Đảm bảo thời gian Uptime 99.99% & Hỗ trợ kỹ thuật trực tiếp
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Mọi sự cố kỹ thuật đều được đội ngũ chuyên gia phân tích và phản hồi qua hệ thống Ticket với thời gian phản hồi cam kết dưới 15 phút.
                </p>
              </CardContent>
            </Card>

          </aside>

          {/* CỘT PHẢI: Contact Form (7 Cột) */}
          <article className="lg:col-span-7">
            <Card className="rounded-3xl border-slate-200/80 shadow-md bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-black text-slate-900 font-heading flex items-center gap-2">
                  <MessageSquare className="size-5 text-primary" />
                  Gửi Yêu Cầu Tư Vấn & Báo Giá
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Điền thông tin bên dưới, kỹ sư giải pháp của CloudServices sẽ liên hệ trực tiếp với bạn sớm nhất.
                </CardDescription>
              </CardHeader>

              <CardContent>
                {submitted ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                    <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 className="size-9 stroke-[2.5]" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Yêu cầu đã được tiếp nhận!</h3>
                    <p className="text-xs text-slate-600 max-w-md leading-relaxed">
                      Cảm ơn <strong>{formData.fullName}</strong>. Chúng tôi đã chuyển thông tin tới bộ phận phụ trách dịch vụ <strong>{formData.serviceInterest}</strong>. Chuyên viên tư vấn sẽ liên hệ qua email hoặc số điện thoại trong thời gian sớm nhất.
                    </p>
                    <Button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          fullName: "",
                          email: "",
                          phone: "",
                          subject: "",
                          serviceInterest: "Cloud Server (VM)",
                          message: "",
                        });
                      }}
                      variant="outline"
                      className="rounded-xl text-xs mt-2"
                    >
                      Gửi thêm yêu cầu khác
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Họ tên & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="fullName" className="text-xs font-semibold text-slate-700">
                          Họ và tên <span className="text-rose-500">*</span>
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

                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                          Email doanh nghiệp <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="example@company.vn"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="h-10 text-xs rounded-xl bg-slate-50/50"
                        />
                      </div>
                    </div>

                    {/* Số điện thoại & Dịch vụ quan tâm */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">
                          Số điện thoại liên hệ <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          id="phone"
                          placeholder="0988 123 456"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                          className="h-10 text-xs rounded-xl bg-slate-50/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="serviceInterest" className="text-xs font-semibold text-slate-700">
                          Dịch vụ quan tâm
                        </Label>
                        <select
                          id="serviceInterest"
                          value={formData.serviceInterest}
                          onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                          className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="Cloud Server (VM)">Cloud Server (Máy chủ ảo)</option>
                          <option value="Cloud Storage S3">Cloud Storage & Block Storage</option>
                          <option value="Managed Database">Cơ sở dữ liệu Database Cloud</option>
                          <option value="Cloud Security & WAF">Bảo mật Cloud & Anti-DDoS</option>
                          <option value="GPU Cloud & AI">GPU Cloud & AI Inference</option>
                          <option value="Khác">Tư vấn giải pháp hạ tầng riêng</option>
                        </select>
                      </div>
                    </div>

                    {/* Tiêu đề */}
                    <div className="space-y-1.5">
                      <Label htmlFor="subject" className="text-xs font-semibold text-slate-700">
                        Tiêu đề liên hệ
                      </Label>
                      <Input
                        id="subject"
                        placeholder="VD: Cần tư vấn mở rộng hạ tầng E-commerce chịu tải 100k CCU"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="h-10 text-xs rounded-xl bg-slate-50/50"
                      />
                    </div>

                    {/* Nội dung chi tiết */}
                    <div className="space-y-1.5">
                      <Label htmlFor="message" className="text-xs font-semibold text-slate-700">
                        Mô tả nhu cầu chi tiết <span className="text-rose-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        rows={5}
                        placeholder="Hãy chia sẻ thêm về cấu hình mong muốn, số lượng server, quy mô truy cập hoặc các yêu cầu kỹ thuật đặc thù..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
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
                      {loading ? "Đang gửi thông tin..." : "Gửi yêu cầu tư vấn ngay"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </article>

        </div>
      </section>

      {/* 4. Google Maps & Data Center Locations */}
      <section className="mx-auto max-w-7xl px-6 pt-12">
        <Card className="rounded-3xl border-slate-200/80 shadow-xs bg-white overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <MapPin className="size-4 text-rose-500" />
              Bản Đồ Chỉ Đường Đến Trụ Sở CloudServices
            </CardTitle>
            <CardDescription className="text-xs">
              Khu Công nghệ cao Hòa Lạc, Km29 Đại lộ Thăng Long, Hà Nội
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 aspect-[21/7] w-full min-h-[300px] relative bg-slate-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096484300262!2d105.52528997596956!3d21.02882508777402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345b465a4e65fb%3A0xaae6040cfabe8fe!2sFPT%20University!5e0!3m2!1sen!2svn!4v1700000000000!5m2!1sen!2svn"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="CloudServices Location"
              className="w-full h-full"
            />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
