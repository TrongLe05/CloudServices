import { create } from "zustand";

interface User {
  username: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  loginState: (username: string) => void;
  logout: () => Promise<void>;
  initialize: () => void; // Khôi phục trạng thái từ localStorage
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  // Cập nhật trạng thái sau khi đăng nhập thành công
  loginState: (username: string) => {
    const newUser = { username };
    localStorage.setItem("user", JSON.stringify(newUser));
    set({ user: newUser });
  },

  // Đăng xuất
  logout: async () => {
    set({ isLoading: true });
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    } finally {
      localStorage.removeItem("user");
      set({ user: null, isLoading: false });
    }
  },

  // Khởi tạo trạng thái ở Client (tránh lỗi Hydration)
  initialize: () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        set({ user: JSON.parse(storedUser) });
      }
    } catch (e) {
      console.error("Lỗi đọc dữ liệu user từ localStorage:", e);
    } finally {
      set({ isLoading: false });
    }
  },
}));
