if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { PromotionsCRUD, Promotion } from "./PromotionsCRUD";
import { getBackendApiUrl } from "@/lib/api-url";

// Data Fetching Function (Server-side)
export async function getPromotions(): Promise<Promotion[]> {
  try {
    const apiUrl = getBackendApiUrl();
    const res = await fetch(`${apiUrl}/api/promotions`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch promotions");
    return await res.json();
  } catch (error) {
    console.error("Error fetching promotions, using fallback:", error);
    return [
      {
        id: "promo-1",
        name: "Khuyến Mãi Khai Trương (Fallback)",
        discountPercentage: 20,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000 * 30).toISOString(),
      },
    ];
  }
}

export async function PromotionsSection() {
  const promotions = await getPromotions();
  return <PromotionsCRUD initialPromotions={promotions} />;
}
