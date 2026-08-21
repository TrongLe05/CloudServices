"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Calendar,
  Clock,
  User,
  TrendingUp,
  Flame,
  ArrowRight,
  ChevronRight,
  Share2,
  Bookmark,
  Sparkles,
  Newspaper,
  BookOpen,
  Tag,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  thumbnailUrl?: string | null;
  publishedAt?: string | null;
  createdAt: string;
}

interface BlogPageViewProps {
  initialNews: BlogPostItem[];
}

export function BlogPageView({ initialNews }: BlogPageViewProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const postsPerPage = 6;

  // Fallback / default articles if database is empty
  const defaultNews: BlogPostItem[] = [
    {
      id: "news-finops-2026",
      title: "Cẩm nang tối ưu hóa chi phí vận hành đám mây (FinOps) hiệu quả cho SMEs năm 2026",
      slug: "cam-nang-toi-uu-chi-phi-finops-cho-smes-2026",
      category: "FinOps & Quản trị",
      content:
        "FinOps không chỉ là việc cắt giảm chi phí một cách cơ học, mà là chiến lược tối ưu hóa toàn diện nhằm liên kết đội ngũ kỹ sư công nghệ, tài chính và kinh doanh để đưa ra các quyết định sáng suốt...",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800",
      publishedAt: "2026-08-15T08:00:00.000Z",
      createdAt: "2026-08-15T08:00:00.000Z",
    },
    {
      id: "news-infra-10gbps",
      title: "CloudServices hoàn tất nâng cấp hạ tầng băng thông kết nối 10Gbps tại Hà Nội & TP. HCM",
      slug: "cloudservices-nang-cap-ha-tang-10gbps",
      category: "Hạ tầng & Tin tức",
      content:
        "Để đáp ứng nhu cầu truyền tải dữ liệu dung lượng lớn và giảm độ trễ tối đa cho các hệ thống thương mại điện tử, chúng tôi chính thức hoàn thành nâng cấp switch mạng lõi...",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800",
      publishedAt: "2026-08-10T09:30:00.000Z",
      createdAt: "2026-08-10T09:30:00.000Z",
    },
    {
      id: "news-devops-docker",
      title: "Hướng dẫn triển khai CI/CD và Docker Container lên Cloud Server chi tiết từ A-Z",
      slug: "huong-dan-trien-khai-docker-ci-cd-cloud-server",
      category: "DevOps & Kỹ thuật",
      content:
        "Hướng dẫn toàn diện cách đóng gói ứng dụng bằng Dockerfile, thiết lập pipeline GitHub Actions tự động build & deploy lên VPS an toàn với zero downtime...",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=800",
      publishedAt: "2026-08-05T14:15:00.000Z",
      createdAt: "2026-08-05T14:15:00.000Z",
    },
    {
      id: "news-security-ddos",
      title: "Chiến lược phòng chống và giảm thiểu rủi ro tấn công DDoS quy mô lớn năm 2026",
      slug: "chien-luoc-phong-chong-tan-cong-ddos-2026",
      category: "An ninh mạng",
      content:
        "Các cuộc tấn công mạng ngày càng gia tăng về quy mô và độ phức tạp. Hãy cùng chuyên gia CloudServices phân tích mô hình tường lửa nhiều lớp và cơ chế bảo vệ Anti-DDoS tự động...",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800",
      publishedAt: "2026-08-01T10:00:00.000Z",
      createdAt: "2026-08-01T10:00:00.000Z",
    },
    {
      id: "news-db-postgres",
      title: "Tối ưu hóa hiệu năng PostgreSQL trên đám mây: Indexing và Partitioning thực chiến",
      slug: "toi-uu-hoa-hieu-nang-postgresql-tren-cloud",
      category: "Cơ sở dữ liệu",
      content:
        "Phân tích cách cấu hình shared_buffers, work_mem, sử dụng BRIN / B-Tree Index hợp lý và phân vùng dữ liệu theo thời gian giúp tăng tốc độ truy vấn cơ sở dữ liệu lên gấp 5 lần...",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800",
      publishedAt: "2026-07-28T16:20:00.000Z",
      createdAt: "2026-07-28T16:20:00.000Z",
    },
  ];

  const allArticles = initialNews && initialNews.length > 0 ? initialNews : defaultNews;

  // Extract categories
  const categoriesList = React.useMemo(() => {
    const set = new Set<string>();
    allArticles.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return Array.from(set);
  }, [allArticles]);

  // Filter articles
  const filteredArticles = React.useMemo(() => {
    return allArticles.filter((article) => {
      const matchCat = selectedCategory === "all" || article.category === selectedCategory;
      const matchQuery =
        !searchQuery.trim() ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [allArticles, selectedCategory, searchQuery]);

  // Newspaper Lead Stories
  const leadArticle = filteredArticles[0] || allArticles[0];
  const sideArticles = filteredArticles.slice(1, 4);
  const remainingArticles = filteredArticles.slice(4);

  // Pagination for remaining articles
  const totalPages = Math.ceil(remainingArticles.length / postsPerPage) || 1;
  const paginatedRemaining = remainingArticles.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  // Helper to remove HTML tags when previewing excerpt
  const stripHtml = (htmlString: string) => {
    if (!htmlString) return "";
    return htmlString.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ").trim();
  };

  // Helper to estimate read time
  const calculateReadTime = (content: string) => {
    const text = stripHtml(content);
    const words = text ? text.split(/\s+/).length : 200;
    const minutes = Math.ceil(words / 200);
    return `${minutes} phút đọc`;
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "Mới cập nhật";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* 1. Newspaper Top Masthead / Tờ báo điện tử Header */}
      <header className="bg-white border-b border-slate-200 pt-8 pb-6">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-6">
          {/* Top meta bar: Date & Trending keywords */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 border-b border-slate-100 pb-3 font-sans">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Calendar className="size-3.5 text-primary" />
                {new Date().toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span>•</span>
              <span>Phiên bản Điện tử Số 2026</span>
            </div>

            {/* Trending Tags */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1 shrink-0">
                <TrendingUp className="size-3" /> Xu hướng:
              </span>
              {["FinOps", "10Gbps Network", "Docker K8s", "Anti-DDoS", "NVMe RAID"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSearchQuery(tag)}
                  className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary transition-colors text-[11px] shrink-0"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Newspaper Main Logo & Slogan */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-2">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-white text-[10px] font-extrabold uppercase px-2 py-0.5 tracking-wider">
                  Tạp chí Công nghệ & Hạ tầng
                </Badge>
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 font-heading uppercase mt-2">
                CloudServices Newsroom
              </h1>
              <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-xl">
                Cổng thông tin chuyên sâu về Điện toán Đám mây, Hạ tầng Máy chủ, DevOps và Giải pháp Chuyển đổi số.
              </p>
            </div>

            {/* Search Input Box */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Tìm kiếm bài viết, tài liệu..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 bg-slate-50/80 border-slate-200 text-xs rounded-xl focus-visible:ring-primary/20 h-10"
              />
            </div>
          </div>

          {/* Category Navigation Bar (Phong cách Chuyên mục Báo) */}
          <nav className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Trang nhất (Tất cả)
            </button>
            {categoriesList.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* 2. Main Newspaper Content Container */}
      <main className="mx-auto max-w-7xl px-6 lg:px-8 pt-8 space-y-12">
        {/* 2.1 Lead Headline & Side Hot Stories (Khu vực Tiêu điểm Báo chí) */}
        {leadArticle && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 border-b border-slate-200">
            {/* Main Spotlight Headline (Cột Tin Nổi Bật Chính - 8 Cột) */}
            <article className="lg:col-span-8 group flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md">
                  <Image
                    src={
                      leadArticle.thumbnailUrl ||
                      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200"
                    }
                    alt={leadArticle.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Badge & Date over image */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <Badge className="bg-primary hover:bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                      <Flame className="size-3 mr-1 text-amber-400" /> TIÊU ĐIỂM HÔM NAY
                    </Badge>
                    <Badge variant="secondary" className="bg-black/60 backdrop-blur-md text-white text-[10px] border-white/20">
                      {leadArticle.category}
                    </Badge>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-2">
                    <div className="flex items-center gap-3 text-xs text-slate-300 font-sans">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        {formatDate(leadArticle.publishedAt || leadArticle.createdAt)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {calculateReadTime(leadArticle.content)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 group-hover:text-primary transition-colors leading-tight font-heading">
                    <Link href={`/blog/${leadArticle.slug || leadArticle.id}`}>
                      {leadArticle.title}
                    </Link>
                  </h2>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed line-clamp-3 font-sans">
                    {stripHtml(leadArticle.content).slice(0, 260)}...
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-800">Ban Biên tập Kỹ thuật</span>
                  <span>-</span>
                  <span>CloudServices Media</span>
                </div>
                <Link
                  href={`/blog/${leadArticle.slug || leadArticle.id}`}
                  className="text-primary hover:underline text-xs font-bold inline-flex items-center gap-1"
                >
                  Đọc toàn văn bài viết <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </article>

            {/* Side Articles Column (3 Tin Nóng Kèm Theo - 4 Cột) */}
            <aside className="lg:col-span-4 flex flex-col justify-between space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-heading">
                  <Newspaper className="size-4 text-primary" /> Đáng chú ý trong tuần
                </h3>
              </div>

              <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-between">
                {sideArticles.map((article) => (
                  <article key={article.id} className="py-4 first:pt-0 last:pb-0 group space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="font-bold text-primary">{article.category}</span>
                      <span>•</span>
                      <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-1">
                        <h4 className="text-xs md:text-sm font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          <Link href={`/blog/${article.slug || article.id}`}>
                            {article.title}
                          </Link>
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {stripHtml(article.content).slice(0, 100)}...
                        </p>
                      </div>

                      {article.thumbnailUrl && (
                        <div className="relative size-18 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                          <Image
                            src={article.thumbnailUrl}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              {/* Newsletter subscription box */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-3 shadow-md">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Bản tin tuần IT & Cloud
                </span>
                <h4 className="text-xs font-bold leading-tight">
                  Nhận các phân tích kiến trúc và cảnh báo bảo mật mới nhất
                </h4>
                <div className="flex gap-2 pt-1">
                  <input
                    type="email"
                    placeholder="Email của bạn..."
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Button size="sm" className="bg-primary hover:bg-primary/95 text-white text-xs shrink-0 rounded-xl px-3">
                    Đăng ký
                  </Button>
                </div>
              </div>
            </aside>
          </section>
        )}

        {/* 2.2 News Grid (Danh sách tin bài dạng Grid báo chí chuẩn) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                {selectedCategory === "all"
                  ? "Dòng sự kiện & Chuyên mục mới nhất"
                  : `Chuyên mục: ${selectedCategory}`}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Hiển thị {filteredArticles.length} bài phân tích và hướng dẫn kỹ thuật
              </p>
            </div>

            <Badge variant="outline" className="text-xs px-3 py-1 border-slate-300 font-medium">
              Trang {currentPage} / {totalPages}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedRemaining.length > 0 ? (
              paginatedRemaining.map((post) => (
                <Card
                  key={post.id}
                  className="flex flex-col justify-between rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-300 group overflow-hidden"
                >
                  <div>
                    {/* Card Thumbnail */}
                    <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                      <Image
                        src={
                          post.thumbnailUrl ||
                          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60"
                        }
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border border-slate-200/80 text-[10px] font-bold shadow-xs">
                          {post.category}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="p-5 pb-2 space-y-2">
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                        <span>•</span>
                        <span>{calculateReadTime(post.content)}</span>
                      </div>

                      <CardTitle className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug font-heading">
                        <Link href={`/blog/${post.slug || post.id}`}>{post.title}</Link>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="p-5 pt-0">
                      <CardDescription className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        {stripHtml(post.content).slice(0, 140)}...
                      </CardDescription>
                    </CardContent>
                  </div>

                  <CardFooter className="p-5 pt-0 border-t border-slate-50 flex items-center justify-between text-xs mt-2">
                    <span className="text-[11px] font-medium text-slate-500">Chuyên gia Cloud</span>
                    <Link
                      href={`/blog/${post.slug || post.id}`}
                      className="text-primary hover:underline font-bold text-xs inline-flex items-center gap-1"
                    >
                      Chi tiết <ChevronRight className="size-3.5" />
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-16 text-center space-y-3 bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="size-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <BookOpen className="size-6" />
                </div>
                <p className="text-sm font-bold text-slate-800">Không tìm thấy bài viết nào</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Thử tìm kiếm với từ khóa khác hoặc chuyển về xem tất cả chuyên mục.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                  className="rounded-xl text-xs"
                >
                  Xóa bộ lọc
                </Button>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="rounded-xl text-xs"
              >
                Trang trước
              </Button>
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                  className={`size-8 p-0 rounded-xl text-xs ${
                    currentPage === i + 1 ? "bg-primary text-white" : ""
                  }`}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="rounded-xl text-xs"
              >
                Trang sau
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
