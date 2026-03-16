"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export type NavItem = {
  id: string;
  title: string;
};

type InvestorNavProps = {
  items: NavItem[];
  className?: string;
};

export function InvestorNav({ items, className }: InvestorNavProps) {
  if (items.length === 0) return null;

  return (
    <nav
      className={cn(
        "sticky top-20 hidden shrink-0 self-start lg:block",
        className
      )}
    >
      <div className="space-y-1 border-l border-border pl-6">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Sections
        </p>
        {items.map((item) => (
          <Link
            key={item.id}
            href={`#${item.id}`}
            className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </nav>
  );
}
