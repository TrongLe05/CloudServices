import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "../LoginForm";
import * as nextAuth from "next-auth/react";

describe("LoginForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render all form elements properly", () => {
    render(<LoginForm />);

    expect(screen.getByRole("heading", { name: /Chào mừng bạn trở lại/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Tên đăng nhập/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mật khẩu/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Đăng nhập" })).toBeInTheDocument();
  });

  it("should display validation errors when fields are empty", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const submitBtn = screen.getByRole("button", { name: "Đăng nhập" });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Tên đăng nhập không được để trống")).toBeInTheDocument();
      expect(screen.getByText("Mật khẩu phải có ít nhất 6 ký tự")).toBeInTheDocument();
    });
  });

  it("should display error when password is less than 6 characters", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const usernameInput = screen.getByLabelText(/Tên đăng nhập/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);

    await user.type(usernameInput, "testuser");
    await user.type(passwordInput, "123");

    const submitBtn = screen.getByRole("button", { name: "Đăng nhập" });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Mật khẩu phải có ít nhất 6 ký tự")).toBeInTheDocument();
    });
  });

  it("should call signIn when valid credentials are submitted", async () => {
    const user = userEvent.setup();
    const mockSignIn = vi.spyOn(nextAuth, "signIn").mockResolvedValueOnce({
      error: undefined,
      status: 200,
      ok: true,
      url: "/",
    } as any);

    render(<LoginForm />);

    const usernameInput = screen.getByLabelText(/Tên đăng nhập/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);

    await user.type(usernameInput, "admin");
    await user.type(passwordInput, "password123");

    const submitBtn = screen.getByRole("button", { name: "Đăng nhập" });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("credentials", {
        username: "admin",
        password: "password123",
        redirect: false,
      });
    });
  });

  it("should display server error message when signIn fails", async () => {
    const user = userEvent.setup();
    vi.spyOn(nextAuth, "signIn").mockResolvedValueOnce({
      error: "CredentialsSignin",
      status: 401,
      ok: false,
      url: null,
    } as any);

    render(<LoginForm />);

    const usernameInput = screen.getByLabelText(/Tên đăng nhập/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);

    await user.type(usernameInput, "wronguser");
    await user.type(passwordInput, "wrongpass123");

    const submitBtn = screen.getByRole("button", { name: "Đăng nhập" });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Tên đăng nhập hoặc mật khẩu không chính xác/i)
      ).toBeInTheDocument();
    });
  });
});
