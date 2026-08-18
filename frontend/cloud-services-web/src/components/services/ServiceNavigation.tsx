import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { Services, services } from "@/constants/serviceNavigation";

import Link from "next/link";

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
                    render={<Link href="#">{service.title}</Link>}
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

// 1. Ensure childrenItems has a default value of []
export const MenuTrigger = ({
  title,
  childrenItems = [],
}: {
  title: string;
  childrenItems: Services[];
}) => {
  return (
    <>
      <NavigationMenuTrigger>{title}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
          {/* 2. Safely map using optional chaining just in case */}
          {childrenItems?.map((child, idx) => (
            <li key={idx}>
              {/* 3. Use asChild instead of the non-standard 'render=' prop */}
              <NavigationMenuLink
                render={
                  <Link
                    href={child.href}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">
                      {child.title}
                    </div>
                    {child.description && (
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                        {child.description}
                      </p>
                    )}
                  </Link>
                }
              ></NavigationMenuLink>
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </>
  );
};
