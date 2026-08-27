import React from "react";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutHistory } from "@/components/about/AboutHistory";
import { AboutDatacenter } from "@/components/about/AboutDatacenter";
import { AboutCertificates } from "@/components/about/AboutCertificates";
import { AboutCommitment } from "@/components/about/AboutCommitment";

export const metadata = {
  title: "Giới thiệu - Cloud Services",
  description: "Tìm hiểu về lịch sử hình thành, hạ tầng trung tâm dữ liệu chuẩn Tier III, các chứng chỉ bảo mật quốc tế và cam kết chất lượng dịch vụ SLA 99.9% của chúng tôi.",
};

export default function AboutPage() {
  return (
    <main className="flex-1 bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <AboutHero />

      {/* History Section */}
      <AboutHistory />

      {/* Datacenter Section */}
      <AboutDatacenter />

      {/* Certificates Section */}
      <AboutCertificates />

      {/* SLA / Commitment Section */}
      <AboutCommitment />
    </main>
  );
}
