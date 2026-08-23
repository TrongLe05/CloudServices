import { describe, it, expect } from "vitest";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} from "../auth.schema";

describe("Auth Validation Schemas", () => {
  describe("loginSchema", () => {
    it("should accept valid username and password", () => {
      const valid = { username: "admin", password: "password123" };
      const result = loginSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should reject empty username", () => {
      const invalid = { username: "", password: "password123" };
      const result = loginSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Tên đăng nhập không được để trống");
      }
    });

    it("should reject password less than 6 characters", () => {
      const invalid = { username: "admin", password: "123" };
      const result = loginSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Mật khẩu phải có ít nhất 6 ký tự");
      }
    });
  });

  describe("registerSchema", () => {
    it("should accept valid registration data", () => {
      const valid = {
        fullname: "Nguyen Van A",
        username: "nguyenvana",
        email: "a.nguyen@cloudservices.vn",
        password: "securePassword123",
        confirmPassword: "securePassword123",
      };
      const result = registerSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email format", () => {
      const invalid = {
        fullname: "Nguyen Van A",
        username: "nguyenvana",
        email: "not-an-email",
        password: "securePassword123",
        confirmPassword: "securePassword123",
      };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        const emailIssue = result.error.issues.find((i) => i.path.includes("email"));
        expect(emailIssue?.message).toBe("Email không hợp lệ");
      }
    });

    it("should reject password shorter than 6 characters", () => {
      const invalid = {
        fullname: "Nguyen Van A",
        username: "nguyenvana",
        email: "a.nguyen@cloudservices.vn",
        password: "123",
        confirmPassword: "123",
      };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        const passIssue = result.error.issues.find((i) => i.path.includes("password"));
        expect(passIssue?.message).toBe("Mật khẩu phải có ít nhất 6 ký tự");
      }
    });

    it("should reject when confirmPassword does not match password", () => {
      const invalid = {
        fullname: "Nguyen Van A",
        username: "nguyenvana",
        email: "a.nguyen@cloudservices.vn",
        password: "securePassword123",
        confirmPassword: "differentPassword123",
      };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        const matchIssue = result.error.issues.find((i) => i.path.includes("confirmPassword"));
        expect(matchIssue?.message).toBe("Mật khẩu xác nhận không khớp");
      }
    });
  });

  describe("forgotPasswordSchema & verifyOtpSchema & resetPasswordSchema", () => {
    it("should validate email in forgotPasswordSchema", () => {
      expect(forgotPasswordSchema.safeParse({ email: "user@test.com" }).success).toBe(true);
      expect(forgotPasswordSchema.safeParse({ email: "invalid" }).success).toBe(false);
    });

    it("should validate 6-digit OTP in verifyOtpSchema", () => {
      expect(verifyOtpSchema.safeParse({ otp: "123456" }).success).toBe(true);
      expect(verifyOtpSchema.safeParse({ otp: "123" }).success).toBe(false);
      expect(verifyOtpSchema.safeParse({ otp: "1234567" }).success).toBe(false);
    });

    it("should validate matching new passwords in resetPasswordSchema", () => {
      const valid = { password: "newPassword123", confirmPassword: "newPassword123" };
      expect(resetPasswordSchema.safeParse(valid).success).toBe(true);

      const mismatch = { password: "newPassword123", confirmPassword: "wrongPassword" };
      expect(resetPasswordSchema.safeParse(mismatch).success).toBe(false);
    });
  });
});
