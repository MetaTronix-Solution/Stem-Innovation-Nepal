"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

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
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show navbar near the top of the page
      if (currentScrollY < 80) {
        setVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Ignore tiny scroll jitters
      if (Math.abs(currentScrollY - lastScrollY.current) < 10) {
        return;
      }

      if (currentScrollY > lastScrollY.current) {
        // Scrolling down
        setVisible(false);
        setMenuOpen(false); // close mobile menu if open while hiding
      } else {
        // Scrolling up
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-4 pt-4 transition-transform duration-700 ease-in-out sm:px-6 ${
        visible ? "translate-y-0" : "-translate-y-[calc(100%+2rem)]"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full border border-gray-100 bg-white/95 px-3 shadow-xl shadow-black/10 backdrop-blur-md">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
        >
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-gray-100">
            <Image
              src="/Logo.jpeg"
              alt="Stem Innovation Nepal logo"
              fill
              sizes="44px"
              priority
              className="object-cover"
            />
          </div>
          <span className="hidden text-base font-bold leading-none text-charcoal sm:block">
            Stem Innovation Nepal
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  active
                    ? "bg-light-gray text-blue"
                    : "text-slate hover:bg-light-gray hover:text-blue"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        {pathname !== "/contact" && (
          <Link
            href="/contact"
            className="hidden items-center gap-2 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-teal hover:shadow-md md:inline-flex"
          >
            Book a Workshop
            <ArrowRight size={16} />
          </Link>
        )}

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="rounded-full p-2 text-charcoal transition-colors hover:bg-light-gray hover:text-blue md:hidden"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`mx-auto mt-2 grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-black/10 transition-all duration-300 ease-in-out md:hidden ${
          menuOpen
            ? "grid-rows-[1fr] border border-gray-100 opacity-100"
            : "grid-rows-[0fr] border-transparent opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col px-4 py-4">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-light-gray text-blue"
                      : "text-slate hover:bg-light-gray hover:text-blue"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            <Link
              href="/contact"
              className="mt-3 flex items-center justify-center gap-2 rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal"
            >
              Book a Workshop
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}


