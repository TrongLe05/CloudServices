"use client";

import {
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Server } from "lucide-react";
import Link from "next/link";
import { ServicePlan, slugify } from "@/components/services/ServiceNavigation";

export const MenuTrigger = ({
  title,
  categorySlug,
  plans = [],
}: {
  title: string;
  categorySlug: string;
  plans: ServicePlan[];
}) => {
  return (
    <>
      <NavigationMenuTrigger>{title}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
          {plans.map((plan) => (
            <li key={plan.id}>
              <NavigationMenuLink
                render={
                  <Link
                    href={`/dich-vu/${categorySlug}/${slugify(plan.name)}`}
                    className="block select-none space-y-1 rounded-md leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Server className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-semibold leading-none">
                          {plan.name}
                        </div>
                        {plan.description ? (
                          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                            {plan.description}
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            {[plan.cpu, plan.ram, plan.storage]
                              .filter(Boolean)
                              .join(" • ") || "Xem chi tiết gói dịch vụ"}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                }
              />
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </>
  );
};
