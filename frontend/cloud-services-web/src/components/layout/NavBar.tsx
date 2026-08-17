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
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              render={<Link href="/">Trang chủ</Link>}
            />
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>
              Getting started
            </NavigationMenuTrigger>

            <NavigationMenuContent>
              <ul className="w-96">
                <ListItem
                  ListItemProps={{
                    href: "/testt",
                    title: "Introduction",
                    description:
                      "Re-usable components built with Tailwind CSS.",
                    image: "/images/intro.png",
                  }}
                />
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem className="hidden md:flex">
            <NavigationMenuTrigger>
              Components
            </NavigationMenuTrigger>

            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {/*
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
                */}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>
              With Icon
            </NavigationMenuTrigger>

            <NavigationMenuContent>
              <ul className="grid w-[200px]">
                <li>
                  <NavigationMenuLink
                    render={
                      <Link
                        href="#"
                        className="flex-row items-center gap-2"
                      >
                        <CircleAlert />
                        Backlog
                      </Link>
                    }
                  />

                  <NavigationMenuLink
                    render={
                      <Link
                        href="#"
                        className="flex-row items-center gap-2"
                      >
                        <CircleDashed />
                        To Do
                      </Link>
                    }
                  />

                  <NavigationMenuLink
                    render={
                      <Link
                        href="#"
                        className="flex-row items-center gap-2"
                      >
                        <CircleCheck />
                        Done
                      </Link>
                    }
                  />
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              render={<Link href="/docs">Docs</Link>}
            />
          </NavigationMenuItem>

          {features.map((feature, index) => (
            <NavigationMenuItem key={index}>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                render={
                  <Link href={feature.href}>
                    {feature.title}
                  </Link>
                }
              />
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};