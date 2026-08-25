export interface MetricItem {
  label: string;
  value: string;
}

export const HERO_TRUST_METRICS: MetricItem[] = [
  {
    label: "Độ ổn định SLA",
    value: "99.99% Uptime",
  },
  {
    label: "Khởi tạo nhanh",
    value: "< 30 giây",
  },
  {
    label: "Kết nối mạng",
    value: "10 Gbps Uplink",
  },
];
