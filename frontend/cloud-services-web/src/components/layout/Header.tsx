"use client";

import { useState } from "react";
import { NavBar } from "./NavBar";
import { AvatarDropdown } from "@/components/layout/Avatar";
import { Button } from "../ui/button";
import Link from "next/link";

export const Header = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  return (
    <header className="flex items-center justify-between ">
      <NavBar />
      {isLoggingIn ? (
        <AvatarDropdown />
      ) : (
        <Button
          variant="destructive"
          render={<Link href="/dang-nhap"> Đăng nhập </Link>}
        ></Button>
      )}
    </header>
  );
};
