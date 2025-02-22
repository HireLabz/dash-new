import AppSidebar from "@/components/SideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }
  
  return (
    <SidebarProvider>
      <AppSidebar userName={session.user?.name}  />
      <main className="w-full min-h-screen bg-gray-50 flex flex-col">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default AuthLayout;
