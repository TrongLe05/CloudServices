/**
 * Utilities for formatting Currency, Dates, Bank BINs, Timers and Text
 */

export const BANK_NAMES: Record<string, string> = {
  "970422": "MBBank (Quân Đội)",
  "970415": "VietinBank (Công Thương)",
  "970436": "Vietcombank (Ngoại Thương)",
  "970407": "Techcombank",
  "970418": "BIDV (Đầu Tư & Phát Triển)",
  "970423": "TPBank (Tiên Phong)",
  "970432": "VPBank (Việt Nam Thịnh Vượng)",
  "970454": "VietCapitalBank (Bản Việt)",
  "970416": "ACB (Á Châu)",
  "970441": "VIB (Quốc Tế)",
  "970403": "Sacombank (Sài Gòn Thương Tín)",
  "970405": "Agribank (Nông Nghiệp)",
  "970448": "OCB (Phương Đông)",
  "970443": "SHB (Sài Gòn - Hà Nội)",
  "970437": "HDBank (Phát Triển TP.HCM)",
  "970428": "Nam A Bank (Nam Á)",
  "970452": "Kienlongbank (Kiên Long)",
  "970449": "LPBank (Bưu Điện Liên Việt)",
  "970438": "BaoVietBank (Bảo Việt)",
  "970431": "Eximbank (Xuất Nhập Khẩu)",
  "970429": "SCB (Sài Gòn)",
  "970426": "MSB (Hàng Hải)",
  "970406": "DongABank (Đông Á)",
  "970440": "SeABank (Đông Nam Á)",
  "970425": "ABBANK (An Bình)",
  "970427": "VietABank (Việt Á)",
  "970433": "VietBank (Việt Nam Thương Tín)",
  "970430": "PGBank (Xăng Dầu Petrolimex)",
};

/**
 * Lấy tên hiển thị ngân hàng từ mã BIN (Napas 24/7)
 */
export function getBankName(bin?: string | null, fallback = "Ngân hàng liên kết Napas 24/7"): string {
  if (!bin) return fallback;
  return BANK_NAMES[bin] || fallback;
}

/**
 * Định dạng tiền tệ VNĐ chuẩn Việt Nam
 */
export function formatVND(value?: number | null, emptyFallback = "Liên hệ báo giá"): string {
  if (value === null || value === undefined || value <= 0) {
    return emptyFallback;
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

/**
 * Chuẩn hóa chuỗi thời gian từ server về UTC timestamp milliseconds
 * (Tránh lệch 7 tiếng múi giờ GMT+7 khi server không có đuôi 'Z')
 */
export function parseDateToMs(dateStr?: string | null): number {
  if (!dateStr) return Date.now();
  const trimmed = dateStr.trim();
  const hasTimezone = trimmed.endsWith("Z") || /[+-]\d{2}(:\d{2})?$/.test(trimmed);
  const normalizedStr = hasTimezone ? trimmed : `${trimmed}Z`;
  const parsedTime = new Date(normalizedStr).getTime();
  return isNaN(parsedTime) ? new Date(trimmed).getTime() : parsedTime;
}

/**
 * Định dạng số giây sang dạng mm:ss
 */
export function formatTimer(seconds: number): string {
  const m = Math.floor(Math.max(0, seconds) / 60);
  const s = Math.max(0, seconds) % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/**
 * Tính số giây còn lại của đơn hàng chờ thanh toán (mặc định 5 phút = 300s)
 */
export function getRemainingPaymentSeconds(createdAtStr?: string | null, totalDurationSeconds = 300): number {
  if (!createdAtStr) return totalDurationSeconds;
  const createdTime = parseDateToMs(createdAtStr);
  const expiryTime = createdTime + totalDurationSeconds * 1000;
  const diff = Math.floor((expiryTime - Date.now()) / 1000);
  return Math.max(0, diff);
}

/**
 * Định dạng ngày tháng năm hiển thị tiếng Việt
 */
export function formatDateVN(dateInput?: string | Date | null, includeTime = false): string {
  if (!dateInput) return "Chưa cập nhật";
  const ms = typeof dateInput === "string" ? parseDateToMs(dateInput) : dateInput.getTime();
  const date = new Date(ms);
  if (isNaN(date.getTime())) return "Chưa cập nhật";

  if (includeTime) {
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

/**
 * Lấy 2 chữ cái viết tắt từ họ tên (Initials)
 */
export function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return "CS";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
