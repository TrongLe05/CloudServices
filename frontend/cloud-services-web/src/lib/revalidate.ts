import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/constants/cache-tags";

/**
 * Tag-based Revalidation: Invalidate specific cached data tags across all pages
 */
export function revalidatePlans() {
  try {
    revalidateTag(CACHE_TAGS.SERVICE_PLANS, "max");
  } catch (err) {
    console.error("[RevalidateTag] Error revalidating plans:", err);
  }
}

export function revalidateCategories() {
  try {
    revalidateTag(CACHE_TAGS.CATEGORIES, "max");
  } catch (err) {
    console.error("[RevalidateTag] Error revalidating categories:", err);
  }
}

export function revalidatePromotions() {
  try {
    revalidateTag(CACHE_TAGS.PROMOTIONS, "max");
  } catch (err) {
    console.error("[RevalidateTag] Error revalidating promotions:", err);
  }
}

export function revalidateNews() {
  try {
    revalidateTag(CACHE_TAGS.NEWS, "max");
  } catch (err) {
    console.error("[RevalidateTag] Error revalidating news:", err);
  }
}

export function revalidateTestimonials() {
  try {
    revalidateTag(CACHE_TAGS.TESTIMONIALS, "max");
  } catch (err) {
    console.error("[RevalidateTag] Error revalidating testimonials:", err);
  }
}

export function revalidatePublicPages() {
  revalidatePlans();
  revalidateCategories();
  revalidatePromotions();
  revalidateNews();
  revalidateTestimonials();
}
