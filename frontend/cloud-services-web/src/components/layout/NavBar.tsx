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
import { features } from "@/constants/navigation";

export const NavBar = () => {
  return (
    <nav>
      <NavigationMenu>
        <NavigationMenuList>
          {features.map((feature, index) =>
            feature.children ? (
              <NavigationMenuItem key={index}>
                <NavigationMenuTrigger>{feature.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 p-2 w-[160px]">
                    {feature.children.map((child, childIndex) => (
                      <li key={childIndex}>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                          render={<Link href={child.href || "#"}>{child.title}</Link>}
                        />
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  render={<Link href={feature.href || "#"}>{feature.title}</Link>}
                />
              </NavigationMenuItem>
            )
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};
