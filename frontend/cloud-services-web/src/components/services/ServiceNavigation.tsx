import { MenuTrigger } from "@/components/services/MenuTrigger";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface ServicePlan {
  id: string;
  categoryId: string;
  name: string;
  description?: string | null;
  cpu?: string | null;
  ram?: string | null;
  storage?: string | null;
  bandwidth?: string | null;
}

export interface CategoryWithPlans extends ServiceCategory {
  plans: ServicePlan[];
}

import { slugify } from "@/lib/slugUtils";
export { slugify };

async function getNavigationData(): Promise<CategoryWithPlans[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";
    const [categoriesRes, plansRes] = await Promise.all([
      fetch(`${apiUrl}/api/service-categories`, {
        next: { revalidate: 60 },
      }),
      fetch(`${apiUrl}/api/service-plans?pageSize=100`, {
        next: { revalidate: 60 },
      }),
    ]);

    if (!categoriesRes.ok) return [];

    const categories: ServiceCategory[] = await categoriesRes.json();
    const plansData = plansRes.ok ? await plansRes.json() : { items: [] };
    const plans: ServicePlan[] = Array.isArray(plansData)
      ? plansData
      : plansData.items || [];

    return categories.map((cat) => ({
      ...cat,
      plans: plans.filter((p) => p.categoryId === cat.id),
    }));
  } catch (error) {
    console.error(
      "Lỗi khi tải danh mục dịch vụ trong ServiceNavigation:",
      error,
    );
    return [];
  }
}

export const ServiceNavigation = async () => {
  const categories = await getNavigationData();

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-16 z-40 w-full transition-all duration-300 border-b bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 h-14 flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-2 mr-4 shrink-0 font-semibold text-xs text-slate-500 uppercase tracking-wider hidden sm:flex">
          <span className="size-2 rounded-full bg-primary animate-pulse" />
          Dịch vụ:
        </div>

        <NavigationMenu className="max-w-full justify-start">
          <NavigationMenuList className="space-x-1">
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                render={
                  <Link href="/dich-vu" className="font-semibold text-xs">
                    Tất cả
                  </Link>
                }
              />
            </NavigationMenuItem>

            {categories.map((cat) => (
              <NavigationMenuItem key={cat.id}>
                {cat.plans && cat.plans.length > 0 ? (
                  <Link href={`/dich-vu/${cat.slug || slugify(cat.name)}`}>
                    <MenuTrigger
                      title={cat.name}
                      categorySlug={cat.slug || slugify(cat.name)}
                      plans={cat.plans}
                    />
                  </Link>
                ) : (
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    render={
                      <Link
                        href={`/dich-vu/${cat.slug || slugify(cat.name)}`}
                        className="font-semibold text-xs"
                      >
                        {cat.name}
                      </Link>
                    }
                  />
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
};
