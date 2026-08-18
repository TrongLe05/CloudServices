import Link from "next/link";
import { NavigationMenuLink } from "../ui/navigation-menu";
import Image from "next/image";

interface ListItemProps {
  href: string;
  title: string;
  description: string;
  image: string;
}

export const ListItem = (
  //   props: React.ComponentPropsWithoutRef<"li">,
  { ListItemProps }: { ListItemProps: ListItemProps },
) => {
  return (
    // <link children={ListItemProps.title}>
    <NavigationMenuLink
      render={
        <Link
          href={ListItemProps.href}
          className="flex items-center p-3 rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="flex gap-1 text-sm">
            <Image
              src={ListItemProps.image}
              alt={ListItemProps.title}
              width={48}
              height={48}
            />
            <div className="flex flex-col space-y-1">
              <div className="leading-none font-medium">
                {ListItemProps.title}
              </div>
              <div className="line-clamp-2 text-muted-foreground">
                {ListItemProps.description}
              </div>
            </div>
          </div>
        </Link>
      }
    />
    // </link>
  );
};
