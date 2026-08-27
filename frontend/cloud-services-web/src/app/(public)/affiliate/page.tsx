export const dynamic = "force-dynamic";

import { AffiliateRegisterPageView } from "@/components/affiliate/AffiliateRegisterPageView";

export const metadata = {
  title: "Đăng ký Đối tác Tiếp thị (Affiliate Partner) | CloudServices",
  description:
    "Tham gia chương trình Tiếp thị liên kết CloudServices Affiliate. Nhận hoa hồng trọn đời lên tới 20% trên mỗi khách hàng giới thiệu sử dụng Cloud Server, VPS và Database.",
};

export default function AffiliatePage() {
  return <AffiliateRegisterPageView />;
}
