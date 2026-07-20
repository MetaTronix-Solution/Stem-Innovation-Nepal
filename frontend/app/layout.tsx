import "./globals.css";
import { Poppins, Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
  import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${poppins.variable} ${inter.variable}`}
    >
      <body>
        <TooltipProvider>{children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
