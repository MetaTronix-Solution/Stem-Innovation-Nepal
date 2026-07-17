import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Stem Innovation Nepal",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-light-gray">{children}</div>;
}
