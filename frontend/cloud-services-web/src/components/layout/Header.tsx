"use client";

<<<<<<< Updated upstream
import { NavBar } from "./NavBar";
import { AvatarDropdown } from "@/components/layout/Avatar";
import { Button } from "../ui/button";
import Link from "next/link";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

export const Header = () => {
  const { user, initialize } = useAuthStore();
=======
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "../ui/button";
import { NavBar } from "./NavBar";
import { AvatarDropdown } from "@/components/layout/Avatar";

export const Header = () => {
  const { user, initialize } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
>>>>>>> Stashed changes

  // Khởi tạo dữ liệu người dùng từ localStorage sau khi component mount ở Client
  useEffect(() => {
    initialize();
<<<<<<< Updated upstream
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
=======

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [initialize]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-zinc-200/80 shadow-xs"
          : "bg-white/60 backdrop-blur-xs border-zinc-200/30"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/Logo.png"
              alt="CloudServices Logo"
              width={32}
              height={32}
              className="transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-heading text-lg font-bold text-zinc-900 tracking-tight">
              CloudServices
            </span>
          </Link>

          {/* Navigation links inside viewport */}
          <div className="hidden md:block">
            <NavBar />
          </div>
        </div>

        {/* Authentication actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <AvatarDropdown />
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-600 hover:text-zinc-900 font-medium text-xs px-4"
                render={<Link href="/dang-nhap" />}
              >
                Đăng nhập
              </Button>
              <Button
                variant="default"
                size="sm"
                className="bg-primary hover:bg-primary/95 text-white font-semibold text-xs px-4 shadow-sm"
                render={<Link href="/dang-ky" />}
              >
                Đăng ký
              </Button>
            </>
          )}
        </div>
      </div>
>>>>>>> Stashed changes
    </header>
  );
};
