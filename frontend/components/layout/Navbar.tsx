"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Programs", href: "/programs" },
  { name: "About", href: "/about" },
  { name: "Partners", href: "/partners" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-bold text-navy">
            S
          </div>

          <div>
            <h1 className="text-lg font-bold text-white">
              Stem Innovation Nepal
            </h1>

            <p className="text-xs text-light-gray/80">
              IoT & Robotics Education
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}

        <nav className="hidden items-center rounded-full border border-white/10 bg-white/10 px-2 py-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="rounded-full px-5 py-2 text-sm font-medium text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Button */}

        {pathname !== "/contact" && (
          <Link
            href="/contact"
            className="bg-orange px-5 py-3 rounded-lg text-white transition hover:bg-teal"
          >
            Book a Workshop
          </Link>
        )}

        {/* Mobile Button */}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white md:hidden"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}

      {menuOpen && (
        <div className="border-t border-white/10 bg-navy md:hidden">
          <div className="flex flex-col px-6 py-5">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                {item.name}
              </Link>
            ))}

            <Link
              href="/contact"
              className="mt-5 flex items-center justify-center gap-2 rounded-full bg-orange px-6 py-3 font-semibold text-white transition hover:bg-teal"
            >
              Book a Workshop
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
