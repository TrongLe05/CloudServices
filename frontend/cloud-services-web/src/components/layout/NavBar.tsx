import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { CircleAlert, CircleCheck, CircleDashed } from "lucide-react";
import { ListItem } from "./ListItem";
import { features } from "@/mock/navbar.mock";

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
