import {
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

import { slugify } from "@/components/services/ServiceNavigation";

import { Services } from "@/constants/serviceNavigation";
import Image from "next/image";
import Link from "next/link";

export const MenuTrigger = ({
  title,
  childrenItems = [],
}: {
  title: string;
  childrenItems: Services[];
}) => {
  const href = () => `/dich-vu/${slugify(title)}`;
  return (
    <>
      <NavigationMenuTrigger>{title}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[400px] gap-3 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
          {childrenItems?.map((child, idx) => (
            <li key={idx}>
              <NavigationMenuLink
                render={
                  <Link
                    href={href()}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <Image
                      src="/pic.png"
                      alt={child.title}
                      width={48}
                      height={48}
                    />
                    <div>
                      <div className="text-sm font-medium leading-none">
                        {child.title}
                      </div>
                      {child.description && (
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                          {child.description}
                        </p>
                      )}
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
