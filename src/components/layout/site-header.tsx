"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; condition?: boolean };

const BASE_NAV_ITEMS: Array<{ href: string; label: string; requiresListings?: boolean }> = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/editorials", label: "Editorials" },
  { href: "/listings", label: "Listings", requiresListings: true },
  { href: "/instagram", label: "Instagram" },
  { href: "/studio", label: "Studio" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasListings, setHasListings] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Check if there are any published listings
    async function checkListings() {
      try {
        const response = await fetch('/api/content/status', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setHasListings(data.hasListings || false);
        }
      } catch (error) {
        console.error('Error checking listings:', error);
      }
    }
    checkListings();
  }, []);

  // Filter nav items based on conditions
  const navItems = BASE_NAV_ITEMS.filter(item => {
    if (item.requiresListings) {
      return hasListings;
    }
    return true;
  });

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-colors",
        isScrolled ? "backdrop-blur bg-background/90 shadow-sm" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-serif text-xl uppercase tracking-[0.3em]">
          EJ Properties
        </Link>

        <nav className="hidden items-center gap-8 text-sm uppercase tracking-[0.3em] text-muted-foreground md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              scroll
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Toggle navigation"
          className="inline-flex items-center justify-center rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col gap-1 px-6 py-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                scroll
                className="py-2 transition-colors hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
