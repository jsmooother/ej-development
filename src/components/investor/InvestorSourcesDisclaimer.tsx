"use client";

import Link from "next/link";
import { marketSources } from "@/data/investor-data";

export function InvestorSourcesDisclaimer() {
  return (
    <footer id="sources" className="scroll-mt-24 border-t border-border bg-background py-16 text-foreground">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground">
              Sources
            </p>
            <ul className="mt-4 space-y-2">
              {marketSources.map((s, i) => (
                <li key={i} className="text-sm">
                  <Link
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground underline decoration-muted-foreground/50 underline-offset-2 transition-colors hover:text-foreground"
                  >
                    {s.name}
                  </Link>
                  <span className="ml-2 text-xs text-muted-foreground/80">
                    ({s.type})
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground">
              Disclaimer
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              This material is preliminary and for discussion purposes only. It
              does not constitute final offering material. Some assumptions are
              subject to verification and refinement. Not investment advice.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-8 border-t border-border pt-12 md:flex-row">
          <div className="text-center">
            <p className="font-serif text-xl uppercase tracking-[0.2em] text-foreground">
              EJ Properties
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              El Madroñal Villa · Construction funding opportunity · Confidential
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <Link
              href="mailto:info@ejproperties.es"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              info@ejproperties.es
            </Link>
            <Link
              href="/"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Back to site
            </Link>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground/80">
          Urbanización El Madroñal · Plot 102B · 29679 Benahavís · Málaga · Spain
        </p>
      </div>
    </footer>
  );
}
