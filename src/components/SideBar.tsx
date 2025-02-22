"use client";
import {
  Bot,
  Command,
  LayoutDashboardIcon,
  Settings,
  SquareFunction,
  Workflow,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavUser } from "./NavUser";

interface SidebarItem {
  title: string;
  url: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  isActive: boolean;
}

interface NavigationLinkProps {
  item: SidebarItem;
}

const items: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/auth",
    icon: LayoutDashboardIcon,
    isActive: false,
  },
];

const AppSidebar = React.memo(
  (props: {
    userName?: string | null;
    profilePicture?: string | null;
    email?: string | null;
  }) => {
    let pathname = usePathname();

    React.useEffect(() => {
      let activeItem = items.find((item) => item.url === pathname);
      if (activeItem) {
        setActiveItem(activeItem.title);
      }
    }, [pathname]);

    const [activeItem, setActiveItem] = React.useState<string>("");

    return (
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" className="md:h-8 md:p-0">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="grid flex-1 text-left text-lg leading-tight">
                  <span className="truncate font-semibold">HireLabz</span>
                  <span className="truncate text-xs">Preview</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <NavigationLink key={item.title} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser
            initialUser={{
              name: props.userName || "User",
              email: props.email || "",
              avatar: props.profilePicture || "",
            }}
          />
        </SidebarFooter>
      </Sidebar>
    );
  }
);

function NavigationLink({ item }: NavigationLinkProps) {
  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton tooltip={item.title} asChild>
        <Link href={item.url} prefetch={true}>
          <item.icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
export default AppSidebar;
