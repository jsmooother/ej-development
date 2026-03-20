import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { cn } from "@/lib/utils";
import { buildOgImageUrl } from "@/lib/og";

const sans = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ejproperties.es"),
  title: {
    default: "EJ Properties — Precision in Every Square Meter",
    template: "%s | EJ Properties",
  },
  description:
    "EJ Properties creates homes where every square meter is optimized with precision. We design spaces that feel effortless, harmonious, and perfectly balanced with understated luxury.",
  openGraph: {
    title: "EJ Development - El Madronal",
    description:
      "A private luxury villa in Marbella's most exclusive gated community.",
    url: "https://www.ejproperties.es",
    type: "website",
    siteName: "EJ Development",
    images: [
      {
        url: buildOgImageUrl({
          title: "EJ Development - El Madronal",
          subtitle: "Marbella · 700-800 sqm",
          highlight: "Private Estate · Panoramic Views",
          badge: "Exclusive",
        }),
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EJ Development - El Madronal",
    description:
      "A private luxury villa in Marbella's most exclusive gated community.",
    images: [
      buildOgImageUrl({
        title: "EJ Development - El Madronal",
        subtitle: "Marbella · 700-800 sqm",
        highlight: "Private Estate · Panoramic Views",
        badge: "Exclusive",
      }),
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f2ea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(sans.variable, serif.variable)} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
