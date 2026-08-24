import { revalidatePath } from "next/cache";

/**
 * Purge cache on-demand for all public pages when Admin or Editor modifies content.
 */
export function revalidatePublicPages() {
  try {
    revalidatePath("/");
    revalidatePath("/bang-gia");
    revalidatePath("/dich-vu");
    revalidatePath("/dich-vu/[...slug]", "page");
    revalidatePath("/dich-vu/[slug]", "page");
    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");
    revalidatePath("/khach-hang");
  } catch (err) {
    console.error("[OnDemandRevalidate] Error revalidating pages:", err);
  }
}
