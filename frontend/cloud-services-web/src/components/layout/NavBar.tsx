import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { features } from "@/constants/navigation";

export const NavBar = () => {
  return (
    <nav>
      <NavigationMenu>
        <NavigationMenuList>
          {features.map((feature, index) => (
            <NavigationMenuItem key={index}>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                render={<Link href={feature.href}>{feature.title}</Link>}
              />
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};
