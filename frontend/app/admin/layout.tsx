import type { Metadata } from "next";
import { AdminThemeProvider } from "@/components/admin/theme-provider";

export const metadata: Metadata = {
  title: "Admin | Stem Innovation Nepal",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminThemeProvider>{children}</AdminThemeProvider>;
}
