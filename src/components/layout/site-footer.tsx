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
            Tailored property development and project leadership across Andalusia.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Contact</p>
          <div className="space-y-1 text-sm text-muted-foreground">
            <Link href="mailto:hello@ejdevelopment.com" className="block hover:text-foreground">
              hello@ejdevelopment.com
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
      <div className="border-t border-border bg-card px-6 py-6 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
        © {new Date().getFullYear()} EJ Development. All rights reserved.
      </div>
    </footer>
  );
}
