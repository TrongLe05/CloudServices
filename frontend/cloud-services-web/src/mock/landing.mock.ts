import { Server, HardDrive, Database, Shield, Globe, Cpu } from "lucide-react";

export const services = [
  {
    icon: Server,
    title: "Cloud Server (VM)",
    description: "Máy chủ riêng ảo cấu hình cực mạnh, khởi tạo tức thì trong 30 giây. Sử dụng chip Intel Xeon/AMD EPYC thế hệ mới nhất.",
    badge: "Phổ biến"
  },
  {
    icon: HardDrive,
    title: "Cloud Storage",
    description: "Lưu trữ dữ liệu mở rộng không giới hạn với Block Storage tốc độ cao và Object Storage tương thích hoàn toàn chuẩn S3.",
    badge: "Mới"
  },
  {
    icon: Database,
    title: "Managed Database",
    description: "Hệ quản trị cơ sở dữ liệu MySQL, PostgreSQL và Redis được tối ưu hóa, tự động sao lưu định kỳ, bảo mật nhiều lớp.",
    badge: ""
  },
  {
    icon: Globe,
    title: "VPC & Load Balancer",
    description: "Mạng riêng ảo cô lập bảo mật cao, kết hợp cân bằng tải thông minh giúp ứng dụng chịu tải tốt và chịu lỗi tối ưu.",
    badge: ""
  },
  {
    icon: Shield,
    title: "Cloud Security & WAF",
    description: "Giải pháp bảo mật toàn diện bảo vệ website trước các đợt tấn công DDoS nguy hiểm và chống khai thác lỗ hổng bằng WAF.",
    badge: "Bảo mật cao"
  },
  {
    icon: Cpu,
    title: "GPU Cloud & AI Inference",
    description: "Cung cấp máy chủ tăng tốc GPU chuyên dụng phục vụ huấn luyện mô hình Deep Learning và suy luận ứng dụng AI hiệu năng cao.",
    badge: "Hiệu năng"
  }
];

export const prebuiltPlans = [
  {
    name: "Starter (Cơ bản)",
    desc: "Phù hợp chạy website nhỏ, môi trường dev/test hoặc blog cá nhân.",
    price: 150000,
    specs: [
      "1 vCPU Core",
      "2 GB RAM",
      "40 GB SSD NVMe Storage",
      "1 TB Băng thông hàng tháng",
      "1 IPv4 công cộng",
      "Tự động sao lưu hàng tuần",
      "Hỗ trợ kỹ thuật 24/7/365"
    ]
  },
  {
    name: "Professional (Phổ thông)",
    desc: "Tối ưu nhất cho các ứng dụng web thương mại điện tử, CMS doanh nghiệp.",
    price: 450000,
    specs: [
      "2 vCPU Cores",
      "4 GB RAM",
      "80 GB SSD NVMe Storage",
      "3 TB Băng thông hàng tháng",
      "1 IPv4 & Block IP riêng biệt",
      "Tự động sao lưu hàng ngày",
      "Hỗ trợ VIP chuyên nghiệp 24/7",
      "Cam kết chất lượng SLA 99.99%"
    ],
    popular: true
  },
  {
    name: "Enterprise (Cao cấp)",
    desc: "Hạ tầng hiệu năng cao chuyên biệt cho hệ thống lớn, ERP và cơ sở dữ liệu nặng.",
    price: 1200000,
    specs: [
      "4 vCPU Cores",
      "8 GB RAM",
      "160 GB SSD NVMe Storage",
      "Băng thông không giới hạn",
      "IPv4 & IPv6 chuyên dụng",
      "Backup thời gian thực & Khôi phục nhanh",
      "Đội ngũ kỹ sư hỗ trợ trực tiếp riêng biệt",
      "Cam kết SLA 99.99% và Multi-Region"
    ]
  }
];

export const promotions = [
  {
    title: "Chào mừng thành viên mới",
    desc: "Tặng ngay 500,000đ vào tài khoản Cloud Credit khi đăng ký tài khoản mới và xác thực số điện thoại doanh nghiệp thành công.",
    badge: "Đặc quyền",
    code: "WELCOME500K",
    expiry: "31/12/2026"
  },
  {
    title: "Ưu đãi thanh toán dài hạn",
    desc: "Giảm trực tiếp 30% tổng giá trị hóa đơn khi đăng ký thuê Cloud Server với chu kỳ từ 12 tháng trở lên. Miễn phí setup hệ thống.",
    badge: "Hot Deal",
    code: "CLOUD30YEAR",
    expiry: "30/09/2026"
  },
  {
    title: "Chuyển vùng dữ liệu 0 đồng",
    desc: "Miễn phí hoàn toàn chi phí kỹ sư di chuyển dữ liệu từ nhà cung cấp cũ (trong nước/quốc tế) sang hệ thống CloudServices.",
    badge: "Đồng hành",
    code: "FREE-MIGRATE",
    expiry: "Hỗ trợ 24/7"
  }
];

export const blogPosts = [
  {
    title: "Cẩm nang tối ưu hóa chi phí vận hành đám mây (FinOps) hiệu quả cho SMEs năm 2026",
    desc: "Tìm hiểu cách phân bổ ngân sách, cấu hình auto-scaling hợp lý và tắt các tài nguyên nhàn rỗi để giảm thiểu lãng phí lên tới 35% chi phí hàng tháng.",
    category: "FinOps",
    date: "15 Tháng 8, 2026",
    author: "Nguyễn Minh Đức",
    readTime: "5 phút đọc",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600"
  },
  {
    title: "CloudServices nâng cấp hạ tầng băng thông rộng kết nối lên tới 10Gbps tại Hà Nội & TP. HCM",
    desc: "Chính thức hoàn thành nâng cấp switch mạng tại hai trung tâm dữ liệu trọng điểm, gia tăng tốc độ truyền tải quốc tế và tính ổn định vượt trội.",
    category: "Hạ tầng",
    date: "10 Tháng 8, 2026",
    author: "Đội ngũ Kỹ thuật",
    readTime: "3 phút đọc",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600"
  },
  {
    title: "Hướng dẫn triển khai Docker Container lên Cloud Server chi tiết cho lập trình viên",
    desc: "Từng bước cài đặt Docker, cấu hình tường lửa, tối ưu hóa bộ nhớ và triển khai CI/CD tự động giúp rút ngắn thời gian phát hành phần mềm.",
    category: "DevOps",
    date: "05 Tháng 8, 2026",
    author: "Trần Anh Tuấn",
    readTime: "8 phút đọc",
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=600"
  }
];
