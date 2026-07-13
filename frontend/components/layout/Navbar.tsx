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
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-lg font-bold text-white">
            S
          </div>

          <div>
            <h1 className="text-lg font-bold text-charcoal">
              Stem Innovation Nepal
            </h1>

            <p className="text-xs text-slate">
              IoT & Robotics Education
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}

        <nav className="hidden items-center rounded-full border border-gray-200 bg-light-gray px-2 py-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="rounded-full px-5 py-2 text-sm font-medium text-slate transition-all duration-200 hover:bg-white hover:text-blue"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Button */}

        {pathname !== "/contact" && (
        <Link
          href="/contact"
          className="bg-orange px-5 py-3 rounded-lg text-white"
          >
          Book a Workshop
        </Link>
        )}

        {/* Mobile Button */}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-charcoal md:hidden"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}

      {menuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="flex flex-col px-6 py-5">

            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-slate transition hover:bg-light-gray hover:text-blue"
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