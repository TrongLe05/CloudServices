import React from "react";
import { 
  Server, 
  Shield, 
  Zap, 
  Globe, 
  Award, 
  ShieldCheck, 
  FileCheck, 
  CheckCircle,
  Flame, 
  RefreshCcw, 
  Headset
} from "lucide-react";

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export interface SpecItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

export interface Certificate {
  icon: React.ReactNode;
  name: string;
  authority: string;
  description: string;
}

export interface CommitmentItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

export const milestones: Milestone[] = [
  {
    year: "2018",
    title: "Khởi đầu hành trình",
    description: "Công ty được thành lập với đội ngũ kỹ sư tâm huyết, bắt đầu nghiên cứu và xây dựng giải pháp ảo hóa điện toán đám mây tối ưu.",
  },
  {
    year: "2020",
    title: "Ra mắt Cloud Server & VPS",
    description: "Chính thức thương mại hóa các dịch vụ Cloud Server và VPS hiệu năng cao, ứng dụng công nghệ ảo hóa KVM hiện đại.",
  },
  {
    year: "2022",
    title: "Đạt chuẩn quốc tế & Mở rộng hạ tầng",
    description: "Đạt các chứng chỉ ISO 27001 và PCI-DSS. Đồng thời mở rộng thêm trung tâm dữ liệu mới tại Singapore phục vụ thị trường khu vực.",
  },
  {
    year: "2024",
    title: "Hệ sinh thái Multi-Cloud & Kubernetes",
    description: "Ra mắt các giải pháp Managed Kubernetes, Cloud Database và Object Storage thế hệ mới, đáp ứng các tiêu chuẩn khắt khe nhất của doanh nghiệp lớn.",
  },
  {
    year: "2026",
    title: "Bứt phá và Dẫn đầu",
    description: "Phục vụ hơn 10.000+ doanh nghiệp trên khắp Đông Nam Á. Tiếp tục cải tiến công nghệ và tối ưu chi phí hạ tầng cho khách hàng.",
  },
];

export const datacenterSpecs: SpecItem[] = [
  {
    icon: <Server className="size-6 text-primary" />,
    title: "Tiêu chuẩn Tier III Uptime Institute",
    desc: "Hạ tầng được thiết kế chuẩn xác với hệ thống điều hòa, nguồn điện và kết nối Internet dự phòng song hành.",
  },
  {
    icon: <Zap className="size-6 text-amber-500" />,
    title: "Nguồn điện dự phòng N+1",
    desc: "Hệ thống UPS và máy phát điện dự phòng công suất lớn hoạt động 24/7 đảm bảo thiết bị không bị mất nguồn đột ngột.",
  },
  {
    icon: <Globe className="size-6 text-primary" />,
    title: "Đa đường truyền Internet (Multi-carrier)",
    desc: "Băng thông kết nối trực tiếp đến các nhà mạng lớn trong nước (Viettel, VNPT, FPT) và quốc tế với băng thông rộng cực đại.",
  },
  {
    icon: <Shield className="size-6 text-primary" />,
    title: "An ninh & Phòng chống DDoS",
    desc: "Hệ thống giám sát an ninh vật lý 3 lớp nghiêm ngặt, kết hợp hệ thống lọc lưu lượng xấu và chống DDoS nâng cao ở tầng mạng.",
  },
];

export const certificates: Certificate[] = [
  {
    icon: <ShieldCheck className="size-8 text-primary" />,
    name: "ISO/IEC 27001:2013",
    authority: "Tiêu chuẩn quốc tế về An toàn thông tin",
    description: "Chứng nhận hệ thống quản lý an toàn thông tin (ISMS) đạt chuẩn quốc tế, bảo vệ dữ liệu khách hàng tuyệt đối trước các nguy cơ tấn công mạng.",
  },
  {
    icon: <Award className="size-8 text-primary" />,
    name: "PCI-DSS Level 1",
    authority: "Chuẩn bảo mật thanh toán thẻ quốc tế",
    description: "Chứng nhận cao nhất về bảo mật dữ liệu thẻ thanh toán, đảm bảo an toàn tuyệt đối cho mọi giao dịch thanh toán trực tuyến của khách hàng.",
  },
  {
    icon: <FileCheck className="size-8 text-primary" />,
    name: "ISO 9001:2015",
    authority: "Hệ thống quản lý chất lượng dịch vụ",
    description: "Quy trình vận hành, hỗ trợ kỹ thuật và quản lý dịch vụ được chuẩn hóa toàn diện, đảm bảo trải nghiệm khách hàng tối ưu nhất.",
  },
  {
    icon: <CheckCircle className="size-8 text-primary" />,
    name: "Uptime Institute Tier III",
    authority: "Chứng nhận thiết kế và xây dựng Datacenter",
    description: "Hạ tầng trung tâm dữ liệu được kiểm định bởi tổ chức uy tín toàn cầu Uptime Institute, đảm bảo độ sẵn sàng của hệ thống ở mức tối đa.",
  },
];

export const commitments: CommitmentItem[] = [
  {
    icon: <ShieldCheck className="size-6 text-primary" />,
    title: "Cam kết bồi thường rõ ràng",
    desc: "Nếu mức độ khả dụng (Uptime) trong tháng giảm xuống dưới 99.9%, khách hàng sẽ nhận được mức bồi thường chi tiết tương ứng theo điều khoản dịch vụ.",
  },
  {
    icon: <Flame className="size-6 text-orange-500" />,
    title: "Sao lưu tự động định kỳ",
    desc: "Mọi dữ liệu hệ thống được sao lưu tự động hàng tuần/hàng ngày, đảm bảo an toàn tuyệt đối ngay cả khi xảy ra các sự cố nghiêm trọng.",
  },
  {
    icon: <RefreshCcw className="size-6 text-primary" />,
    title: "Hỗ trợ di chuyển dữ liệu",
    desc: "Cung cấp công cụ và hỗ trợ kỹ thuật viên chuyển dữ liệu từ các nhà cung cấp khác về hệ thống của chúng tôi hoàn toàn miễn phí.",
  },
  {
    icon: <Headset className="size-6 text-primary" />,
    title: "Hỗ trợ kỹ thuật 24/7/365",
    desc: "Đội ngũ chuyên gia hệ thống túc trực liên tục qua ticket, live chat và hotline để xử lý mọi yêu cầu phát sinh của bạn chỉ trong vài phút.",
  },
];
