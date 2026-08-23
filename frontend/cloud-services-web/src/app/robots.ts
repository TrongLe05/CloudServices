import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/don-hang/",
          "/quen-mat-khau",
          "/dang-nhap",
          "/dang-ky",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/don-hang/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
