export interface Services {
  title: string;
  href: string;
  description?: string;
  specifications?: string[];
  children?: Services[];
}

export const services: Services[] = [
  {
    title: "Hosting",
    href: "#",

    children: [
      {
        title: "Hosting 1",
        href: "hosting-1",
        description: "description 1",
      },
      {
        title: "Hosting 2",
        href: "#",
        description: "description 2",
      },
      {
        title: "Hosting 3",
        href: "#",
        description: "description 3",
      },
      {
        title: "Hosting 4",
        href: "#",
        description: "description 4",
      },
    ],
  },
  {
    title: "Tên miền",
    href: "#",
    children: [
      {
        title: "Tên miền 1",
        href: "#",
        description: "description 1",
      },
      {
        title: "Tên miền 2",
        href: "#",
        description: "description 2",
      },
      {
        title: "Tên miền 3",
        href: "#",
        description: "description 3",
      },
      {
        title: "Tên miền 4",
        href: "#",
        description: "description 4",
      },
    ],
  },
  {
    title: "VPS",
    href: "#",
    children: [
      {
        title: "VPS 1",
        href: "#",
        description: "description 1",
      },
      {
        title: "VPS 2",
        href: "#",
        description: "description 2",
      },
      {
        title: "VPS 3",
        href: "#",
        description: "description 3",
      },
      {
        title: "VPS 4",
        href: "#",
        description: "description 4",
      },
    ],
  },
  {
    title: "Dịch vụ Cloud",
    href: "#",
    children: [
      {
        title: "Dịch vụ Cloud 1",
        href: "#",
        description: "description 1",
      },
      {
        title: "Dịch vụ Cloud 2",
        href: "#",
        description: "description 2",
      },
      {
        title: "Dịch vụ Cloud 3",
        href: "#",
        description: "description 3",
      },
      {
        title: "Dịch vụ Cloud 4",
        href: "#",
        description: "description 4",
      },
    ],
  },
  {
    title: "Máy chủ",
    href: "#",
    children: [
      {
        title: "Máy chủ 1",
        href: "#",
        description: "description 1",
      },
      {
        title: "Máy chủ 2",
        href: "#",
        description: "description 2",
      },
      {
        title: "Máy chủ 3",
        href: "#",
        description: "description 3",
      },
      {
        title: "Máy chủ 4",
        href: "#",
        description: "description 4",
      },
    ],
  },
  {
    title: "Email Doanh Nghiệp",
    href: "#",
  },
  {
    title: "SSL",
    href: "#",
  },
  {
    title: "Firewall Anti DDoS",
    href: "#",
  },
  {
    title: "Giải pháp",
    href: "#",
    children: [
      {
        title: "Giải pháp 1",
        href: "#",
        description: "description 1",
      },
      {
        title: "Giải pháp 2",
        href: "#",
        description: "description 2",
      },
      {
        title: "Giải pháp 3",
        href: "#",
        description: "description 3",
      },
      {
        title: "Giải pháp 4",
        href: "#",
        description: "description 4",
      },
    ],
  },
];
