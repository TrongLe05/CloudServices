export interface SlaFeatureItem {
  title: string;
  desc: string;
}

export interface DatacenterStatusItem {
  location: string;
  uptime: string;
  isPingActive?: boolean;
}

export const SLA_FEATURES: SlaFeatureItem[] = [
  {
    title: "Cơ cấu dự phòng kép N+1",
    desc: "Mọi cấu phần vật lý từ nguồn điện máy phát dự phòng đến đường truyền cáp quang trục đều có hạ tầng backup hoạt động song song.",
  },
  {
    title: "Tự động chuyển mạch dự phòng",
    desc: "Khi xảy ra sự cố phần cứng vật lý, máy chủ ảo của bạn sẽ tự động được di trú và khởi chạy trên node dự trữ chỉ trong vài giây.",
  },
];

export const SLA_DATACENTER_STATUSES: DatacenterStatusItem[] = [
  {
    location: "Singapore Datacenter",
    uptime: "99.999% Operational",
    isPingActive: true,
  },
  {
    location: "Hanoi Datacenter",
    uptime: "99.997% Operational",
  },
  {
    location: "Ho Chi Minh Datacenter",
    uptime: "99.998% Operational",
  },
];
