"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Newspaper,
  ImageIcon,
  FlaskConical,
  LogOut,
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
import { AxiosError } from "axios";
import api from "@/lib/axios";

const navItems = [
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Blog", url: "/admin/blog", icon: Newspaper },
  { title: "Gallery", url: "/admin/gallery", icon: ImageIcon },
  { title: "Lab Setup", url: "/admin/lab-setup", icon: FlaskConical },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async (): Promise<void> => {
    try {
      const { data } = await api.post("/auth/logout");

      console.log("Logout Response:", data);

      if (data.success) {
        router.replace("/admin/login");
        router.refresh();
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log("Status:", error.response?.status);
        console.log("Data:", error.response?.data);
        console.log("Message:", error.message);
      } else {
        console.log(error);
      }
    }
  };
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link href="/admin/analytics" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold text-sm shrink-0">
            SN
          </div>
          <span className="font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            Stem Innovation
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Log out">
              <LogOut />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
