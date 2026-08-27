import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegisterForm } from "../RegisterForm";

describe("RegisterForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render all registration fields", () => {
    render(<RegisterForm />);

    expect(screen.getByRole("heading", { name: /Tạo tài khoản mới/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Họ và tên/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tên tài khoản/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Địa chỉ Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Mật khẩu$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Xác nhận Mật khẩu/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tạo Tài Khoản" })).toBeInTheDocument();
  });

  it("should display errors when required fields are empty on submit", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const submitBtn = screen.getByRole("button", { name: "Tạo Tài Khoản" });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Tên đầy đủ không được để trống")).toBeInTheDocument();
      expect(screen.getByText("Tên đăng nhập không được để trống")).toBeInTheDocument();
      expect(screen.getByText("Email không được để trống")).toBeInTheDocument();
      expect(screen.getByText("Mật khẩu phải có ít nhất 6 ký tự")).toBeInTheDocument();
    });
  });

  it("should display error when invalid email is entered", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const emailInput = screen.getByLabelText(/Địa chỉ Email/i);
    await user.type(emailInput, "not-an-email");

    const submitBtn = screen.getByRole("button", { name: "Tạo Tài Khoản" });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Email không hợp lệ")).toBeInTheDocument();
    });
  });

  it("should display error when confirm password does not match", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const fullnameInput = screen.getByLabelText(/Họ và tên/i);
    const usernameInput = screen.getByLabelText(/Tên tài khoản/i);
    const emailInput = screen.getByLabelText(/Địa chỉ Email/i);
    const passwordInput = screen.getByLabelText(/^Mật khẩu$/i);
    const confirmPasswordInput = screen.getByLabelText(/Xác nhận Mật khẩu/i);

    await user.type(fullnameInput, "Nguyen Van A");
    await user.type(usernameInput, "nguyenvana");
    await user.type(emailInput, "a.nguyen@cloudservices.vn");
    await user.type(passwordInput, "password123");
    await user.type(confirmPasswordInput, "passwordMismatch");

    const submitBtn = screen.getByRole("button", { name: "Tạo Tài Khoản" });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Mật khẩu xác nhận không khớp")).toBeInTheDocument();
    });
  });

  it("should submit successfully when all data is valid", async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: "Created" }),
    } as any);

    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/Họ và tên/i), "Nguyen Van A");
    await user.type(screen.getByLabelText(/Tên tài khoản/i), "nguyenvana");
    await user.type(screen.getByLabelText(/Địa chỉ Email/i), "a.nguyen@cloudservices.vn");
    await user.type(screen.getByLabelText(/^Mật khẩu$/i), "securePass123");
    await user.type(screen.getByLabelText(/Xác nhận Mật khẩu/i), "securePass123");

    const submitBtn = screen.getByRole("button", { name: "Tạo Tài Khoản" });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/auth/register",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            fullname: "Nguyen Van A",
            username: "nguyenvana",
            email: "a.nguyen@cloudservices.vn",
            password: "securePass123",
            confirmPassword: "securePass123",
          }),
        })
      );
    });
  });
});
