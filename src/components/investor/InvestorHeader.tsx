"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { id: "funding", label: "Funding" },
  { id: "why", label: "Why This Project" },
  { id: "location", label: "Location" },
  { id: "site", label: "Site & Planning" },
  { id: "market", label: "Market Evidence" },
  { id: "concept", label: "Concept" },
  { id: "execution", label: "Execution" },
  { id: "risks", label: "Risks" },
  { id: "references", label: "References" },
  { id: "economics", label: "Economics" },
  { id: "sources", label: "Sources" },
];

type InvestorHeaderProps = {
  showNav?: boolean;
  onLogout?: () => void;
};

export function InvestorHeader({ showNav = false, onLogout }: InvestorHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <Link
            href="/"
            className="font-serif text-sm uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
          >
            EJ Development
          </Link>

          {showNav ? (
            <>
              <nav className="hidden items-center gap-1 overflow-x-auto md:flex">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.id}
                    href={`#${item.id}`}
                    className="shrink-0 rounded-full px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-2">
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="hidden rounded-full border border-border px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground md:block"
                  >
                    Exit
                  </button>
                )}
                <Link
                  href="/"
                  className="rounded-full border border-border px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  Back to site
                </Link>
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="flex items-center justify-center p-2 text-muted-foreground hover:text-foreground md:hidden"
                  aria-label="Toggle menu"
                >
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/"
              className="text-xs uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Back to site
            </Link>
          )}
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && showNav && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-background/95 backdrop-blur-md md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 pt-20">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMobileOpen(false)}
                  className="font-serif text-2xl font-light text-foreground"
                >
                  {item.label}
                </Link>
              ))}
              {onLogout && (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    onLogout();
                  }}
                  className="mt-8 font-serif text-xl font-light text-muted-foreground"
                >
                  Exit portal
                </button>
              )}
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="mt-4 text-sm text-muted-foreground"
              >
                Back to site
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
