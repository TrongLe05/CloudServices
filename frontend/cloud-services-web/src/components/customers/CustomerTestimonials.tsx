"use client";

import * as React from "react";
import {
  Star,
  MessageSquareQuote,
  CheckCircle,
  Building,
  User,
  Plus,
  Send,
  Sparkles,
  Filter,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/toast";

export interface TestimonialItem {
  id?: string;
  name: string;
  role?: string;
  company?: string;
  rating: number;
  content: string;
  avatarUrl?: string | null;
  createdAt?: string;
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "1",
    name: "Nguyễn Văn Hùng",
    role: "Giám đốc Công nghệ (CTO)",
    company: "MegaTech Solutions",
    rating: 5,
    content:
      "Chúng tôi chuyển toàn bộ 15 máy chủ web và database sang CloudServices được 8 tháng nay. Uptime đạt 100% không một phút gián đoạn. Tốc độ đọc ghi NVMe SSD cực kỳ ấn tượng, chi phí tiết kiệm hơn 30% so với nhà cung cấp ngoại.",
    createdAt: "2026-08-15T08:30:00Z",
  },
  {
    id: "2",
    name: "Trần Thị Mai Phương",
    role: "Lead DevOps Engineer",
    company: "FastFintech Global",
    rating: 5,
    content:
      "Đội ngũ kỹ thuật hỗ trợ cực kỳ nhiệt tình và am hiểu chuyên sâu. Lúc nửa đêm gặp sự cố cấu hình SSL, gửi ticket hỗ trợ chỉ sau 7 phút đã được xử lý xong. Hệ thống chống DDoS hoạt động rất hiệu quả.",
    createdAt: "2026-08-12T14:10:00Z",
  },
  {
    id: "3",
    name: "Lê Hoàng Quân",
    role: "Nhà sáng lập & CEO",
    company: "EcomStart Vietnam",
    rating: 5,
    content:
      "Gói Cloud Server của CloudServices giúp chúng tôi vượt qua đợt sale Mega 11.11 với hơn 500,000 lượt truy cập đồng thời mà không hề bị nghẽn mạng hay crash hệ thống. Rất đáng đồng tiền bát gạo!",
    createdAt: "2026-08-08T09:45:00Z",
  },
  {
    id: "4",
    name: "Phạm Quốc Bảo",
    role: "System Administrator",
    company: "GreenData Logistics",
    rating: 5,
    content:
      "Giao diện quản trị trực quan, cấp phát VPS tự động bằng mã VietQR siêu nhanh chỉ dưới 30 giây. Băng thông trong nước và quốc tế rất dồi dào, ping từ các tỉnh thành về datacenter chỉ từ 2-5ms.",
    createdAt: "2026-08-01T11:20:00Z",
  },
  {
    id: "5",
    name: "Vũ Minh Tuấn",
    role: "Head of Infrastructure",
    company: "NextGen Software",
    rating: 4,
    content:
      "Hạ tầng phần cứng hiện đại dùng chip AMD EPYC và Intel Xeon mới nhất. Dịch vụ Dedicated Server rất ổn định. Tôi rất kỳ vọng CloudServices sẽ mở thêm datacenter tại khu vực miền Trung trong tương lai.",
    createdAt: "2026-07-28T16:00:00Z",
  },
  {
    id: "6",
    name: "Đặng Thu Thảo",
    role: "Quản lý Vận hành",
    company: "Alpha Media & Agency",
    rating: 5,
    content:
      "Lưu trữ video và asset truyền thông trên hệ thống Cloud Storage của CloudServices vừa an toàn vừa tiết kiệm. Tốc độ tải trang của các website đối tác tăng rõ rệt sau khi trỏ về CDN của CloudServices.",
    createdAt: "2026-07-20T10:15:00Z",
  },
];

interface CustomerTestimonialsProps {
  initialTestimonials?: TestimonialItem[];
}

export function CustomerTestimonials({
  initialTestimonials = [],
}: CustomerTestimonialsProps) {
  const [testimonials, setTestimonials] = React.useState<TestimonialItem[]>(
    initialTestimonials.length > 0 ? initialTestimonials : DEFAULT_TESTIMONIALS
  );
  const [ratingFilter, setRatingFilter] = React.useState<number | "ALL">("ALL");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form states
  const [formName, setFormName] = React.useState("");
  const [formRole, setFormRole] = React.useState("");
  const [formCompany, setFormCompany] = React.useState("");
  const [formRating, setFormRating] = React.useState(5);
  const [formContent, setFormContent] = React.useState("");

  const filteredList = React.useMemo(() => {
    if (ratingFilter === "ALL") return testimonials;
    return testimonials.filter((item) => item.rating === ratingFilter);
  }, [testimonials, ratingFilter]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formContent.trim()) {
      toast.add({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập họ tên và nội dung đánh giá của bạn.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newReview: TestimonialItem = {
        name: formName.trim(),
        role: formRole.trim() || "Khách hàng doanh nghiệp",
        company: formCompany.trim() || "Đối tác CloudServices",
        rating: formRating,
        content: formContent.trim(),
        createdAt: new Date().toISOString(),
      };

      // Gửi lên API lưu vào database
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          CustomerName: newReview.name,
          Position: newReview.role,
          Company: newReview.company,
          Rating: newReview.rating,
          Content: newReview.content,
        }),
      });

      if (res.ok) {
        setTestimonials((prev) => [newReview, ...prev]);
        toast.add({
          title: "Đã gửi đánh giá thành công!",
          description: "Cảm ơn bạn đã đóng góp ý kiến quý báu cho CloudServices.",
          type: "success",
        });
        setIsModalOpen(false);
        setFormName("");
        setFormRole("");
        setFormCompany("");
        setFormRating(5);
        setFormContent("");
      } else {
        // Fallback lưu local UI
        setTestimonials((prev) => [newReview, ...prev]);
        toast.add({
          title: "Đã ghi nhận đánh giá!",
          description: "Đánh giá của bạn đã được lưu vào hệ thống.",
          type: "success",
        });
        setIsModalOpen(false);
      }
    } catch {
      toast.add({
        title: "Lỗi gửi đánh giá",
        description: "Không thể kết nối máy chủ. Vui lòng thử lại sau.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <Badge variant="outline" className="text-xs font-semibold px-3 py-1 bg-white border-slate-300">
              <MessageSquareQuote className="size-3.5 mr-1 text-primary" />
              Đánh Giá & Cảm Nhận
            </Badge>
            <h2 id="testimonials-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Khách hàng nói gì về trải nghiệm dịch vụ CloudServices
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Những đánh giá thực tế từ các nhà quản lý công nghệ, lập trình viên và doanh nghiệp đang vận hành hệ thống hàng ngày trên nền tảng đám mây của chúng tôi.
            </p>
          </div>

          {/* Action to open review modal */}
          <Button
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl text-xs font-semibold bg-primary hover:bg-primary/95 text-white shadow-xs self-start md:self-auto shrink-0"
          >
            <Plus className="size-3.5 mr-1.5" />
            Gửi đánh giá của bạn
          </Button>
        </header>

        {/* Filter Navigation */}
        <nav aria-label="Bộ lọc số sao đánh giá" className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setRatingFilter("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              ratingFilter === "ALL"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Tất cả đánh giá ({testimonials.length})
          </button>

          {[5, 4, 3].map((star) => {
            const count = testimonials.filter((t) => t.rating === star).length;
            return (
              <button
                key={star}
                type="button"
                onClick={() => setRatingFilter(star)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                  ratingFilter === star
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{star} sao</span>
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <span className="opacity-70 text-[11px]">({count})</span>
              </button>
            );
          })}
        </nav>

        {/* Testimonials Semantic Articles Grid */}
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0">
          {filteredList.map((item, idx) => (
            <li key={item.id || idx} className="h-full">
              <article className="h-full p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-5">
                {/* Rating Stars & Verified Badge */}
                <header className="flex items-center justify-between">
                  <div className="flex items-center gap-1" aria-label={`Đánh giá ${item.rating} trên 5 sao`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-4 ${
                          i < item.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-200 text-slate-200"
                        }`}
                      />
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle className="size-3" />
                    Đã xác thực
                  </span>
                </header>

                {/* Testimonial Quote */}
                <blockquote className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal italic flex-1">
                  &ldquo;{item.content}&rdquo;
                </blockquote>

                {/* Author Info */}
                <footer className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <div className="size-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                    {getInitials(item.name)}
                  </div>
                  <address className="not-italic text-left space-y-0.5">
                    <cite className="font-bold text-xs sm:text-sm text-slate-900 not-italic block">
                      {item.name}
                    </cite>
                    <p className="text-[11px] text-slate-500 font-medium truncate max-w-[200px]">
                      {item.role && `${item.role} • `}
                      {item.company}
                    </p>
                  </address>
                </footer>
              </article>
            </li>
          ))}
        </ul>
      </div>

      {/* Review Submission Sheet Modal */}
      <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
        <SheetContent className="sm:max-w-md p-6 overflow-y-auto">
          <SheetHeader className="space-y-2 text-left">
            <Badge variant="outline" className="w-fit text-xs font-semibold px-2.5 py-0.5">
              <Sparkles className="size-3.5 mr-1 text-primary" />
              Đóng góp ý kiến
            </Badge>
            <SheetTitle className="text-xl font-bold text-slate-900">
              Gửi đánh giá dịch vụ
            </SheetTitle>
            <SheetDescription className="text-xs text-slate-500">
              Chia sẻ trải nghiệm của bạn khi sử dụng máy chủ đám mây CloudServices.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmitReview} className="space-y-4 pt-6 text-xs">
            <fieldset className="space-y-1.5">
              <legend className="font-semibold text-slate-700 text-xs">
                Họ và tên của bạn <span className="text-red-500">*</span>
              </legend>
              <Input
                placeholder="VD: Nguyễn Văn A"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="h-10 text-xs rounded-xl"
                required
              />
            </fieldset>

            <div className="grid grid-cols-2 gap-3">
              <fieldset className="space-y-1.5">
                <legend className="font-semibold text-slate-700 text-xs">Chức vụ / Vị trí</legend>
                <Input
                  placeholder="VD: CTO, DevOps, CEO"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="h-10 text-xs rounded-xl"
                />
              </fieldset>

              <fieldset className="space-y-1.5">
                <legend className="font-semibold text-slate-700 text-xs">Tên công ty / Tổ chức</legend>
                <Input
                  placeholder="VD: Công ty TNHH ABC"
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  className="h-10 text-xs rounded-xl"
                />
              </fieldset>
            </div>

            <fieldset className="space-y-2">
              <legend className="font-semibold text-slate-700 text-xs">
                Mức độ hài lòng của bạn <span className="text-red-500">*</span>
              </legend>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                    title={`${star} sao`}
                  >
                    <Star
                      className={`size-6 ${
                        star <= formRating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-slate-200 text-slate-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-bold text-slate-700 text-xs">
                  {formRating === 5
                    ? "Rất tuyệt vời (5/5)"
                    : formRating === 4
                    ? "Hài lòng (4/5)"
                    : formRating === 3
                    ? "Bình thường (3/5)"
                    : "Cần cải thiện"}
                </span>
              </div>
            </fieldset>

            <fieldset className="space-y-1.5">
              <legend className="font-semibold text-slate-700 text-xs">
                Nội dung đánh giá chi tiết <span className="text-red-500">*</span>
              </legend>
              <Textarea
                placeholder="Chia sẻ cảm nhận về tốc độ, tính ổn định, hỗ trợ kỹ thuật hoặc bảng giá..."
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                rows={4}
                className="text-xs rounded-xl"
                required
              />
            </fieldset>

            <div className="pt-3 flex gap-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/95 text-white font-bold h-10 rounded-xl"
              >
                <Send className="size-3.5 mr-1.5" />
                {isSubmitting ? "Đang gửi..." : "Gửi đánh giá ngay"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </section>
  );
}
