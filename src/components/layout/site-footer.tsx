import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Studio</p>
          <p className="font-serif text-lg leading-tight text-foreground">
            Marbella · Costa del Sol
          </p>
          <p className="text-sm text-muted-foreground">
            Precision property development where every square meter is optimized with timeless design and refined luxury.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Contact</p>
          <div className="space-y-1 text-sm text-muted-foreground">
            <Link href="mailto:hello@ejproperties.com" className="block hover:text-foreground">
              hello@ejproperties.com
            </Link>
            <Link href="tel:+34600123456" className="block hover:text-foreground">
              +34 600 123 456
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Connect</p>
          <div className="space-y-1 text-sm text-muted-foreground">
            <Link href="https://instagram.com/ejdevelopment" className="block hover:text-foreground">
              Instagram
            </Link>
            <Link href="#contact" scroll className="block hover:text-foreground">
              Enquiries
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border bg-card px-6 py-6">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            © {new Date().getFullYear()} EJ Properties. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-xs">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
