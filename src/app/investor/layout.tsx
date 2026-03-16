import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Investor Portal | EJ Development",
  description:
    "El Madroñal Villa Development — Investor project portal. Confidential materials for approved investors.",
  robots: { index: false, follow: false },
};

export default function InvestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-serif text-sm uppercase tracking-[0.3em] text-muted-foreground">
            EJ Development · Investor Portal
          </span>
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to site
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
