"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AnimatedWordmark from "@/components/AnimatedWordmark";

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur transition-[transform,background] duration-500 ${
        scrolled ? "header--scrolled" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" aria-label="EJ Development" className="no-underline">
          <AnimatedWordmark
            text="EJ DEVELOPMENT"
            className={`tracking-[0.18em] text-[#1a1a1a] ${
              scrolled ? "wordmark--small" : "wordmark--large"
            }`}
          />
        </Link>
        <nav className="hidden items-center gap-8 text-sm uppercase tracking-[0.18em] text-[#1a1a1a]/70 md:flex">
          <a href="#about" className="transition hover:text-[#1a1a1a]">About</a>
          <a href="#properties" className="transition hover:text-[#1a1a1a]">Properties</a>
          <a href="#blog" className="transition hover:text-[#1a1a1a]">Editorial</a>
          <a href="#instagram" className="transition hover:text-[#1a1a1a]">Instagram</a>
          <a href="#contact" className="transition hover:text-[#1a1a1a]">Contact</a>
        </nav>
      </div>
    </header>
  );
}
