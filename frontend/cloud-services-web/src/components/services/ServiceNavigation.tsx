import { MenuTrigger } from "@/components/services/MenuTrigger";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { services } from "@/constants/serviceNavigation";

import Link from "next/link";

export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, "-");
};

export const ServiceNavigation = () => {
  return (
    <nav className="sticky top-0 z-50 w-full transition-all duration-300 border-b ">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 h-16 flex items-center justify-between">
        <NavigationMenu>
          <NavigationMenuList>
            {services.map((service, idx) => (
              <NavigationMenuItem key={idx}>
                {service.children?.length ? (
                  <MenuTrigger
                    title={service.title}
                    childrenItems={service.children}
                  />
                ) : (
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    render={
                      <Link href={`/dich-vu/${slugify(service.title)}`}>
                        {service.title}
                      </Link>
                    }
                  ></NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
};
