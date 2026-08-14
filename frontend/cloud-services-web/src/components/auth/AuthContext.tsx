"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginState: (username: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Khi khởi chạy, kiểm tra thông tin user đã lưu trong localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Lỗi đọc dữ liệu user từ localStorage:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Hàm cập nhật state đăng nhập thành công
  const loginState = (username: string) => {
    const newUser = { username };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  // Hàm đăng xuất
  const logout = async () => {
    try {
      setIsLoading(true);
      // Gọi Route Handler ở Next.js để xóa Cookie
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      setIsLoading(false);
      
      // Chuyển hướng về trang chủ và refresh lại dữ liệu
      router.push("/");
      router.refresh();
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, loginState, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook để các component con dễ dàng lấy state & hàm từ Context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
  }
  return context;
}
