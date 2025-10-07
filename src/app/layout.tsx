import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

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
  metadataBase: new URL("https://www.ejdevelopment.com"),
  title: {
    default: "EJ Development — Luxury Marbella Villas",
    template: "%s | EJ Development",
  },
  description:
    "EJ Development curates refined living experiences along the Costa del Sol. Explore our Marbella flagship villa, completed projects, and editorial insights.",
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
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans text-foreground", sans.variable, serif.variable)}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
