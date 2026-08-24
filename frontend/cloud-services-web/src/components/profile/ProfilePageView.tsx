"use client";

import * as React from "react";
import Link from "next/link";
import { User, Shield, Layers, Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "@/components/ui/toast";
import { ProfileHeaderCard, UserProfileData } from "./ProfileHeaderCard";
import { ProfileInfoForm } from "./ProfileInfoForm";
import { ProfileSecurityForm } from "./ProfileSecurityForm";
import { ProfileActivityCard } from "./ProfileActivityCard";

interface ProfilePageViewProps {
  initialUser: UserProfileData;
}

export function ProfilePageView({ initialUser }: ProfilePageViewProps) {
  const [user, setUser] = React.useState<UserProfileData>(initialUser);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.add({
        title: "Tệp không hợp lệ",
        description: "Vui lòng chọn tệp hình ảnh (PNG, JPG, WEBP).",
        type: "error",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.add({
        title: "Dung lượng quá lớn",
        description: "Kích thước ảnh đại diện tối đa là 2MB.",
        type: "error",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      if (!base64) return;

      try {
        const res = await fetch("/api/auth/me", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: user.fullName || user.username,
            avatarUrl: base64,
          }),
        });

        if (res.ok) {
          const updated = await res.json();
          setUser(updated);
          toast.add({
            title: "Cập nhật ảnh đại diện thành công",
            description: "Ảnh đại diện mới đã được lưu trên hệ thống.",
            type: "success",
          });
        }
      } catch {
        toast.add({
          title: "Lỗi tải ảnh",
          description: "Không thể lưu ảnh đại diện. Vui lòng thử lại sau.",
          type: "error",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className="min-h-screen bg-slate-50/50 pb-24 font-sans">
      {/* Hidden File Input for Avatar Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarUpload}
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
      />

      {/* 1. Breadcrumb Header */}
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3.5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Hồ sơ cá nhân</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* 2. Main Content Container */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Top Overview Banner Card */}
        <ProfileHeaderCard
          user={user}
          onAvatarUploadClick={() => fileInputRef.current?.click()}
        />

        {/* 2-Column Responsive Form & Side Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Column (8 Cols): Information Form & Security Form */}
          <section className="lg:col-span-8 space-y-8">
            <ProfileInfoForm
              user={user}
              onProfileUpdated={(updated) => setUser(updated)}
            />

            <ProfileSecurityForm />
          </section>

          {/* Side Column (4 Cols): Shortcuts & Service Management */}
          <aside className="lg:col-span-4 space-y-6">
            <ProfileActivityCard />
          </aside>
        </div>
      </div>
    </main>
  );
}
