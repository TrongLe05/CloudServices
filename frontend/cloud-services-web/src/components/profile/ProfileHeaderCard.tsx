"use client";

import * as React from "react";
import { User, ShieldCheck, Mail, Calendar, Camera } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface UserProfileData {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: string;
  status: boolean;
}

interface ProfileHeaderCardProps {
  user: UserProfileData;
  onAvatarUploadClick: () => void;
}

export function ProfileHeaderCard({
  user,
  onAvatarUploadClick,
}: ProfileHeaderCardProps) {
  const initials = user.fullName
    ? user.fullName
        .trim()
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : (user.username || "US").slice(0, 2).toUpperCase();

  const roleColor =
    user.role?.toLowerCase() === "admin"
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : user.role?.toLowerCase() === "editor"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-blue-50 text-blue-700 border-blue-200";

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs">
      {/* Cover Gradient Banner */}
      <header className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-primary relative" />

      {/* Profile Overview Content */}
      <CardContent className="px-6 pb-6 pt-0 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 mb-4">
          {/* Avatar with upload trigger button */}
          <div className="relative inline-block">
            <Avatar className="size-24 sm:size-28 rounded-full border-4 border-white bg-primary/10 shadow-md ring-2 ring-primary/20">
              <AvatarImage
                src={user.avatarUrl || "https://github.com/shadcn.png"}
                alt={user.fullName || user.username}
              />
              <AvatarFallback className="bg-primary text-white font-bold text-xl sm:text-2xl">
                {initials}
              </AvatarFallback>
              {user.status && (
                <AvatarBadge className="bg-emerald-500 ring-2 ring-white size-3.5" />
              )}
            </Avatar>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onAvatarUploadClick}
              className="absolute bottom-0 right-0 size-8 rounded-full bg-white shadow-md hover:bg-slate-100 border-slate-200"
              title="Đổi ảnh đại diện"
            >
              <Camera className="size-4 text-slate-600" />
            </Button>
          </div>

          {/* Role & Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={`px-2.5 py-1 font-bold text-xs uppercase tracking-wider ${roleColor}`}>
              {user.role || "User"}
            </Badge>

            <Badge
              variant={user.status ? "default" : "destructive"}
              className={`text-xs px-2.5 py-1 ${user.status ? "bg-emerald-600 text-white" : ""}`}
            >
              {user.status ? "Đang hoạt động" : "Bị khóa"}
            </Badge>
          </div>
        </div>

        {/* User Identity Details */}
        <section aria-label="Thông tin tổng quan">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
            {user.fullName || user.username}
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            @{user.username}
          </p>

          <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-slate-600 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2">
              <dt className="text-slate-400">
                <Mail className="size-4 text-slate-400 shrink-0" />
              </dt>
              <dd className="font-medium text-slate-700 truncate">{user.email}</dd>
            </div>

            <div className="flex items-center gap-2">
              <dt className="text-slate-400">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
              </dt>
              <dd className="font-medium text-slate-700">Tài khoản chính thức</dd>
            </div>

            <div className="flex items-center gap-2">
              <dt className="text-slate-400">
                <Calendar className="size-4 text-primary shrink-0" />
              </dt>
              <dd className="font-medium text-slate-700">Hạ tầng CloudServices</dd>
            </div>
          </dl>
        </section>
      </CardContent>
    </article>
  );
}
