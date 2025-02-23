"use client";
import {
  Bot,
  Briefcase,
  Command,
  LayoutDashboardIcon,
  Settings,
  SquareFunction,
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
  {
    title: "Jobs",
    url: "/auth/jobs",
    icon: Briefcase,
    isActive: false,
  },
  {
    title: "Applications",
    url: "/auth/applications",
    icon: SquareFunction,
    isActive: false,
  },
  {
    title: "Settings",
    url: "/auth/settings",
    icon: Settings,
    isActive: false,
  },
  {
    title: "Commands",
    url: "/auth/commands",
    icon: Command,
    isActive: false,
  }
];

const AppSidebar = React.memo(
  (props: {
    userName?: string | null;
    profilePicture?: string | null;
    email?: string | null;
  }) => {

    // Removed the effect and state tracking active item since they were unused.

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
            <SidebarGroupLabel>Your jobs</SidebarGroupLabel>
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

AppSidebar.displayName = "AppSidebar"; // Add a display name for debugging

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