import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="w-full bg-slate-50 text-zinc-600 border-t border-zinc-200/80">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 xl:gap-12">
          {/* Logo & Intro */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/Logo.png"
                alt="Cloud Services Logo"
                width={40}
                height={40}
              />
              <span className="font-heading text-xl font-bold text-zinc-900 tracking-tight">
                CloudServices
              </span>
            </Link>
            <p className="text-sm leading-6 max-w-sm text-zinc-600">
              Nhà cung cấp hạ tầng điện toán đám mây và giải pháp chuyển đổi số
              hàng đầu Việt Nam. Mang lại giải pháp tối ưu, an toàn và hiệu năng
              vượt trội cho doanh nghiệp của bạn.
            </p>
            <div className="flex flex-col gap-3 text-sm text-zinc-600">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-primary shrink-0" />
                <span>
                  Tòa nhà Innovation, Công viên phần mềm Quang Trung, Q.12,
                  TP.HCM
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-primary shrink-0" />
                <span>Hotline: 1900 xxxx (Hỗ trợ 24/7)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-primary shrink-0" />
                <span>Email: support@cloudservices.vn</span>
              </div>
            </div>
          </div>

          {/* Column 1: Services */}
          <div>
            <h3 className="text-sm font-bold text-zinc-900 tracking-wider uppercase mb-4">
              Dịch vụ
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/dich-vu#cloud-server"
                  className="hover:text-primary hover:underline transition-colors text-zinc-600"
                >
                  Cloud Server (VM)
                </Link>
              </li>
              <li>
                <Link
                  href="/dich-vu#cloud-storage"
                  className="hover:text-primary hover:underline transition-colors text-zinc-600"
                >
                  Cloud Storage
                </Link>
              </li>
              <li>
                <Link
                  href="/dich-vu#managed-db"
                  className="hover:text-primary hover:underline transition-colors text-zinc-600"
                >
                  Managed Database
                </Link>
              </li>
              <li>
                <Link
                  href="/dich-vu#cdn-loadbalancer"
                  className="hover:text-primary hover:underline transition-colors text-zinc-600"
                >
                  CDN & Load Balancer
                </Link>
              </li>
              <li>
                <Link
                  href="/dich-vu#cloud-security"
                  className="hover:text-primary hover:underline transition-colors text-zinc-600"
                >
                  Cloud Security & WAF
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h3 className="text-sm font-bold text-zinc-900 tracking-wider uppercase mb-4">
              Tài nguyên
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/tailieu"
                  className="hover:text-primary hover:underline transition-colors text-zinc-600"
                >
                  Tài liệu kỹ thuật
                </Link>
              </li>
              <li>
                <Link
                  href="/api-docs"
                  className="hover:text-primary hover:underline transition-colors text-zinc-600"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-primary hover:underline transition-colors text-zinc-600"
                >
                  Blog công nghệ
                </Link>
              </li>
              <li>
                <Link
                  href="/status"
                  className="hover:text-primary hover:underline transition-colors text-zinc-600"
                >
                  Trạng thái hệ thống
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Company */}
          <div>
            <h3 className="text-sm font-bold text-zinc-900 tracking-wider uppercase mb-4">
              Chính sách & Công ty
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/gioi-thieu"
                  className="hover:text-primary hover:underline transition-colors text-zinc-600"
                >
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  href="/sla"
                  className="hover:text-primary hover:underline transition-colors text-zinc-600"
                >
                  Cam kết chất lượng SLA
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach-bao-mat"
                  className="hover:text-primary hover:underline transition-colors text-zinc-600"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  href="/dieu-khoan"
                  className="hover:text-primary hover:underline transition-colors text-zinc-600"
                >
                  Điều khoản dịch vụ
                </Link>
              </li>
              <li>
                <Link
                  href="/lien-he"
                  className="hover:text-primary hover:underline transition-colors text-zinc-600"
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Area */}
        <div className="mt-12 pt-8 border-t border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} CloudServices. Đã đăng ký toàn
            quyền.
          </p>
          <div className="flex items-center gap-4">
            {/* Inline SVG Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-primary transition-colors"
              aria-label="Facebook"
            >
              <svg
                className="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            {/* Inline SVG LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <svg
                className="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            {/* Inline SVG GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <svg
                className="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
