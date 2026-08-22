export const dynamic = "force-dynamic";

import { ContactPageView } from "@/components/contact/ContactPageView";

export const metadata = {
  title: "Liên hệ & Tư vấn giải pháp đám mây | CloudServices",
  description:
    "Kết nối với chuyên gia giải pháp hạ tầng điện toán đám mây CloudServices. Hỗ trợ kỹ thuật 24/7/365, tư vấn kiến trúc hệ thống và tối ưu hóa chi phí vận hành đám mây.",
};

export default function ContactPage() {
  return <ContactPageView />;
}
