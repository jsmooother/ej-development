import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investor Portal | EJ Properties",
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
    <div data-theme="investor" className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">{children}</main>
    </div>
  );
}
