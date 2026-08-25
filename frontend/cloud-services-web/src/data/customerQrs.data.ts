export interface ServicePlanItem {
  id: string;
  name: string;
  description?: string;
  categoryId?: string;
  categoryName?: string;
  cpu?: string;
  ram?: string;
  storage?: string;
  bandwidth?: string;
  uptimeSla?: string;
  qrCodeUrl?: string | null;
  prices?: Array<{
    id?: string;
    billingCycle: string;
    price: number;
    promotionDiscountPercentage?: number;
  }>;
}

export const SAMPLE_PLANS: ServicePlanItem[] = [
  {
    id: "plan-vps-basic",
    name: "Cloud VPS Basic",
    categoryName: "Máy chủ ảo VPS",
    description: "Giải pháp lưu trữ cá nhân, blog và hệ thống testing khởi đầu.",
    cpu: "2 vCPU Intel Xeon Platinum",
    ram: "4 GB RAM ECC DDR4",
    storage: "50 GB NVMe SSD Uptime 100%",
    bandwidth: "100 Mbps Không giới hạn",
    prices: [{ billingCycle: "monthly", price: 150000 }],
  },
  {
    id: "plan-vps-pro",
    name: "Cloud VPS Pro NVMe",
    categoryName: "Máy chủ ảo VPS",
    description: "Tối ưu cho website thương mại điện tử, ứng dụng web và API microservices.",
    cpu: "4 vCPU AMD EPYC 7003",
    ram: "8 GB RAM ECC DDR4",
    storage: "120 GB NVMe SSD Enterprise",
    bandwidth: "300 Mbps Không giới hạn",
    prices: [{ billingCycle: "monthly", price: 350000, promotionDiscountPercentage: 10 }],
  },
  {
    id: "plan-dedicated-biz",
    name: "Dedicated Server Enterprise",
    categoryName: "Máy chủ vật lý Dedicated",
    description: "Máy chủ vật lý chuyên biệt cấu hình cao, toàn quyền điều khiển phần cứng.",
    cpu: "16 Core / 32 Thread Intel Xeon",
    ram: "64 GB RAM ECC Registered",
    storage: "2 x 1TB NVMe RAID 1",
    bandwidth: "1 Gbps Trong nước / 50 Mbps Quốc tế",
    prices: [{ billingCycle: "monthly", price: 2500000 }],
  },
  {
    id: "plan-cloud-gpu",
    name: "GPU AI Server Pro",
    categoryName: "Hạ tầng AI & GPU",
    description: "Cụm máy chủ tăng tốc GPU NVIDIA phục vụ AI Training, Deep Learning.",
    cpu: "24 vCPU AMD EPYC + NVIDIA RTX A5000",
    ram: "128 GB RAM ECC",
    storage: "2 TB NVMe Gen4 High-IOPS",
    bandwidth: "1 Gbps Không giới hạn",
    prices: [{ billingCycle: "monthly", price: 6500000 }],
  },
  {
    id: "plan-storage-s3",
    name: "Cloud S3 Storage 1TB",
    categoryName: "Lưu trữ đám mây",
    description: "Lưu trữ đối tượng tương thích S3 API, backup dữ liệu an toàn đa vùng.",
    cpu: "API Gateway S3 High-Availability",
    ram: "Unlimited Concurrent Requests",
    storage: "1,000 GB Block / Object Storage",
    bandwidth: "Miễn phí băng thông tải lên",
    prices: [{ billingCycle: "monthly", price: 200000 }],
  },
  {
    id: "plan-custom-quote",
    name: "Private Cloud Custom Cluster",
    categoryName: "Giải pháp Doanh nghiệp",
    description: "Cụm đám mây riêng biệt thiết kế kiến trúc theo yêu cầu đặc thù của tập đoàn.",
    cpu: "Tùy biến theo yêu cầu",
    ram: "Mở rộng không giới hạn",
    storage: "Hệ thống SAN / Ceph Storage",
    bandwidth: "Đường truyền riêng Leased Line",
    prices: [{ billingCycle: "monthly", price: 0 }],
  },
];
