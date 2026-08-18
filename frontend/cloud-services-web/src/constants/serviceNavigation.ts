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
        href: "#",
        description: "description 1",
        specifications: ["specification 1", "specification 2"],
      },
      {
        title: "Hosting 2",
        href: "#",
        description: "description 2",
        specifications: ["specification 1", "specification 2"],
      },
      {
        title: "Hosting 3",
        href: "#",
        description: "description 3",
        specifications: ["specification 1", "specification 2"],
      },
      {
        title: "Hosting 4",
        href: "#",
        description: "description 4",
        specifications: ["specification 1", "specification 2"],
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
        specifications: ["specification 1", "specification 2"],
      },
      {
        title: "Tên miền 2",
        href: "#",
        description: "description 2",
        specifications: ["specification 1", "specification 2"],
      },
      {
        title: "Tên miền 3",
        href: "#",
        description: "description 3",
        specifications: ["specification 1", "specification 2"],
      },
      {
        title: "Tên miền 4",
        href: "#",
        description: "description 4",
        specifications: ["specification 1", "specification 2"],
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
        specifications: ["specification 1", "specification 2"],
      },
      {
        title: "VPS 2",
        href: "#",
        description: "description 2",
        specifications: ["specification 1", "specification 2"],
      },
      {
        title: "VPS 3",
        href: "#",
        description: "description 3",
        specifications: ["specification 1", "specification 2"],
      },
      {
        title: "VPS 4",
        href: "#",
        description: "description 4",
        specifications: ["specification 1", "specification 2"],
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
        specifications: ["specification 1", "specification 2"],
      },
      {
        title: "Dịch vụ Cloud 2",
        href: "#",
        description: "description 2",
        specifications: ["specification 1", "specification 2"],
      },
      {
        title: "Dịch vụ Cloud 3",
        href: "#",
        description: "description 3",
        specifications: ["specification 1", "specification 2"],
      },
      {
        title: "Dịch vụ Cloud 4",
        href: "#",
        description: "description 4",
        specifications: ["specification 1", "specification 2"],
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
        specifications: ["specification 1", "specification 2"],
      },
      {
        title: "Máy chủ 2",
        href: "#",
        description: "description 2",
        specifications: ["specification 1", "specification 2"],
      },
      {
        title: "Máy chủ 3",
        href: "#",
        description: "description 3",
        specifications: ["specification 1", "specification 2"],
      },
      {
        title: "Máy chủ 4",
        href: "#",
        description: "description 4",
        specifications: ["specification 1", "specification 2"],
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
        specifications: ["specification 1", "specification 2"],
      },
      {
        title: "Giải pháp 2",
        href: "#",
        description: "description 2",
        specifications: ["specification 1", "specification 2"],
      },
      {
        title: "Giải pháp 3",
        href: "#",
        description: "description 3",
        specifications: ["specification 1", "specification 2"],
      },
      {
        title: "Giải pháp 4",
        href: "#",
        description: "description 4",
        specifications: ["specification 1", "specification 2"],
      },
    ],
  },
];
