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

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
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
