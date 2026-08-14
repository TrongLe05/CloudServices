"use client";

import { NavBar } from "./NavBar";
import { AvatarDropdown } from "@/components/layout/Avatar";
import { Button } from "../ui/button";
import Link from "next/link";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

export const Header = () => {
  const { user, initialize } = useAuthStore();

  // Khởi tạo dữ liệu người dùng từ localStorage sau khi component mount ở Client
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <header className="flex items-center justify-between sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border px-4 py-2">
      <NavBar />
      {user ? (
        <AvatarDropdown />
      ) : (
        <Button
          variant="destructive"
          nativeButton={false}
          render={<Link href="/dang-nhap"> Đăng nhập </Link>}
        ></Button>
      )}
    </header>
  );
};
