"use client";

import { NavBar } from "./NavBar";
import { MobileNav } from "./MobileNav";
import { AvatarDropdown } from "@/components/layout/Avatar";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export const Header = () => {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isLoggedIn = status === "authenticated";

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-zinc-200/80 shadow-xs"
          : "bg-white/60 backdrop-blur-xs border-zinc-200/30"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo Brand & Desktop Navigation */}
        <div className="flex items-center gap-6 lg:gap-8">
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

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavBar />
          </div>
        </div>

        {/* Right side: Auth actions & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isLoggedIn ? (
            <AvatarDropdown user={session?.user} />
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-600 hover:text-zinc-900 font-medium text-xs px-3 lg:px-4"
                render={<Link href="/dang-nhap" />}
              >
                Đăng nhập
              </Button>

              <Button
                variant="default"
                size="sm"
                className="bg-primary hover:bg-primary/95 text-white font-semibold text-xs px-3 lg:px-4 shadow-sm"
                render={<Link href="/dang-ky" />}
              >
                Đăng ký
              </Button>
            </div>
          )}

          {/* Mobile Navigation Drawer Trigger */}
          <MobileNav isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </header>
  );
};