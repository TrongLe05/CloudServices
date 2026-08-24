"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { features } from "@/constants/navigation";

interface MobileNavProps {
  isLoggedIn?: boolean;
}

export const MobileNav = ({ isLoggedIn }: MobileNavProps) => {
  const [open, setOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleSubMenu = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100/80 p-2"
            aria-label="Mở menu điều hướng"
          />
        }
      >
        <Menu className="h-6 w-6" />
      </SheetTrigger>

      <SheetContent side="right" className="w-[300px] sm:w-[360px] p-0 flex flex-col bg-white">
        <SheetHeader className="p-5 border-b border-zinc-100 flex flex-row items-center justify-between">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5"
          >
            <Image
              src="/Logo.png"
              alt="CloudServices Logo"
              width={28}
              height={28}
              className="rounded"
            />
            <SheetTitle className="font-heading text-base font-bold text-zinc-900 tracking-tight">
              CloudServices
            </SheetTitle>
          </Link>
        </SheetHeader>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {features.map((feature, index) => {
            if (feature.children) {
              const isExpanded = expandedIndex === index;
              return (
                <div key={index} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => toggleSubMenu(index)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors"
                  >
                    <span>{feature.title}</span>
                    <ChevronDown
                      className={h-4 w-4 text-zinc-500 transition-transform duration-200 }
                    />
                  </button>

                  {isExpanded && (
                    <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-primary/20 ml-3">
                      {feature.children.map((child, childIdx) => (
                        <Link
                          key={childIdx}
                          href={child.href || "#"}
                          onClick={() => setOpen(false)}
                          className="block px-3 py-2 text-sm text-zinc-600 hover:text-primary hover:bg-primary/5 rounded-md transition-colors font-medium"
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={index}
                href={feature.href || "#"}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-zinc-800 hover:text-primary hover:bg-zinc-100 rounded-lg transition-colors"
              >
                {feature.title}
              </Link>
            );
          })}
        </div>

        {/* Auth CTA if not logged in */}
        {!isLoggedIn && (
          <div className="p-4 border-t border-zinc-100 space-y-2 bg-zinc-50/50">
            <Button
              variant="outline"
              className="w-full justify-center text-xs font-semibold h-10 border-zinc-200"
              render={<Link href="/dang-nhap" onClick={() => setOpen(false)} />}
            >
              Đăng nhập
            </Button>
            <Button
              variant="default"
              className="w-full justify-center bg-primary hover:bg-primary/95 text-white text-xs font-semibold h-10 shadow-sm"
              render={<Link href="/dang-ky" onClick={() => setOpen(false)} />}
            >
              Đăng ký tài khoản
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
