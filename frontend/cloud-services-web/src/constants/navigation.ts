export interface Feature {
  title: string;
  href?: string;
  children?: Feature[];
}

export const features = [
  {
    title: "Trang chủ",
    href: "/",
  },
  {
    title: "Dịch vụ",
    href: "/dich-vu",
  },
  {
    title: "Bảng giá",
    href: "/bang-gia",
  },
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "Về chúng tôi",
    href: "",
    children: [
      {
        title: "Giới thiệu",
        href: "/gioi-thieu",
      },
      {
        title: "Liên hệ",
        href: "/lien-he",
      },
      {
        title: "Đối tác",
        href: "/doi-tac",
      },
    ],
  },
];
