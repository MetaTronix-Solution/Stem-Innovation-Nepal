// The layout file that renders your sidebar,
// e.g. app/admin/(protected)/layout.tsx
//
// Every page inside this layout is protected:
//   /admin/analytics, /admin/blog, /admin/gallery,
//   /admin/labs, /admin/lab-items, /admin/lab-category
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { ThemeToggle } from "@/components/admin/theme-toggle";
import { AdminAuthGuard } from "@/components/admin/auth-guard";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-5" />
              <span className="text-sm font-medium text-muted-foreground">
                Admin Console
              </span>
            </div>
            <ThemeToggle />
          </header>
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AdminAuthGuard>
  );
}