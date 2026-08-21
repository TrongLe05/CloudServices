"use client";

import { NavBar } from "./NavBar";
import { AvatarDropdown } from "@/components/layout/Avatar";
import { Button } from "../ui/button";
import Link from "next/link";
<<<<<<< Updated upstream
import Image from "next/image";
import { useEffect, useState } from "react";
=======
<<<<<<< Updated upstream
import { useEffect } from "react";
>>>>>>> Stashed changes
import { useAuthStore } from "@/store/auth.store";

export const Header = () => {
  const { user, initialize } = useAuthStore();
<<<<<<< Updated upstream
  const [isScrolled, setIsScrolled] = useState(false);
=======
=======
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export const Header = () => {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
>>>>>>> Stashed changes
>>>>>>> Stashed changes

  useEffect(() => {
<<<<<<< Updated upstream
    initialize();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [initialize]);

  return (
<<<<<<< Updated upstream
=======
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
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isLoggedIn = status === "authenticated";

  return (
>>>>>>> Stashed changes
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

          {/* Navigation */}
          <div className="hidden md:block">
            <NavBar />
          </div>
        </div>

        {/* Authentication actions */}
        <div className="flex items-center gap-3">
<<<<<<< Updated upstream
          {user ? (
            <AvatarDropdown />
=======
          {isLoggedIn ? (
            <AvatarDropdown user={session?.user} />
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    </header>
  );
};