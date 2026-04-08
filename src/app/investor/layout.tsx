import type { Metadata } from "next";
import { buildOgImageUrl } from "@/lib/og";

export const metadata: Metadata = {
  title: "Investor Portal | EJ Properties",
  description:
    "Villa Elysia by EJ Properties and AMES Arquitectos — El Madroñal. Confidential investor materials.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "EJ Development - Investment Opportunity",
    description:
      "Exclusive Marbella development opportunity with design-led architecture and controlled execution.",
    url: "https://www.ejproperties.es/investor",
    type: "website",
    siteName: "EJ Development",
    images: [
      {
        url: buildOgImageUrl({
          title: "El Madronal Investment",
          subtitle: "Marbella · Design-led luxury development",
          highlight: "Exclusive · Architecture · Controlled Risk",
          badge: "Investment",
        }),
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EJ Development - Investment Opportunity",
    description:
      "Exclusive Marbella development opportunity with design-led architecture and controlled execution.",
    images: [
      buildOgImageUrl({
        title: "El Madronal Investment",
        subtitle: "Marbella · Design-led luxury development",
        highlight: "Exclusive · Architecture · Controlled Risk",
        badge: "Investment",
      }),
    ],
  },
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
