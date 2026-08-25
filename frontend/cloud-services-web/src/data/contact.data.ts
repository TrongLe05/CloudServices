export interface ContactLocationItem {
  name: string;
  address: string;
}

export interface ContactDirectChannelItem {
  title: string;
  value: string;
  type: "phone" | "email";
  badge: string;
}

export const CONTACT_LOCATIONS: ContactLocationItem[] = [
  {
    name: "Trụ sở chính:",
    address: "Tòa nhà Công nghệ FPT, Khu Công nghệ cao Hòa Lạc, Hà Nội",
  },
  {
    name: "Chi nhánh TP. Hồ Chí Minh:",
    address: "Khu Công viên Phần mềm Quang Trung, Quận 12, TP. HCM",
  },
];

export const CONTACT_DIRECT_CHANNELS: ContactDirectChannelItem[] = [
  {
    title: "Hotline Kinh Doanh & Kỹ Thuật",
    value: "1900 6868 - 0988 123 456",
    type: "phone",
    badge: "24/7",
  },
  {
    title: "Hộp thư hỗ trợ chính thức",
    value: "support@cloudservices.vn",
    type: "email",
    badge: "Email",
  },
];

export const CONTACT_SERVICE_OPTIONS: string[] = [
  "Cloud Server (VM)",
  "Dedicated Server",
  "Cloud Storage & CDN",
  "Database Quản Trị",
  "Tư vấn giải pháp Private Cloud",
];
