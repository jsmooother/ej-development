"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { marketSources, marketComps, marketCompsListedAvgEurPerSqm } from "@/data/investor-data";
import { SourceNote } from "./SourceNote";

export function InvestorMarketEvidence() {
  return (
    <section id="market" className="scroll-mt-24 border-t border-border bg-muted/20 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground">
            Market evidence
          </p>
          <h2 className="mt-4 font-serif text-3xl font-light text-foreground md:text-4xl">
            Comparable villas
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Comparable listings for villas in El Madroñal and neighbouring Benahavís areas, plus
            Villa Elysia on an indicative basis. The table reflects where the market stands today;
            prices are more likely than not to move higher going forward. Broker-led exit pricing
            remains an underwriting assumption.
          </p>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Property
                  </th>
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Location
                  </th>
                  <th className="py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    €/m²
                  </th>
                  <th className="py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Build
                  </th>
                  <th className="py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {marketComps.map((row) => {
                  const isSubject = "subject" in row && row.subject;
                  return (
                  <tr
                    key={row.name}
                    className={`border-b border-border/50 ${
                      isSubject ? "bg-primary/10" : row.primeComp ? "bg-foreground/5" : ""
                    }`}
                  >
                    <td className="py-4">
                      {isSubject ? (
                        <span className="font-medium text-foreground">
                          {row.name}
                          <span className="ml-2 text-[10px] font-normal uppercase tracking-wider text-muted-foreground">
                            This project
                          </span>
                        </span>
                      ) : (
                        <Link
                          href={row.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-foreground underline decoration-muted-foreground/50 underline-offset-2 transition-colors hover:text-foreground"
                        >
                          {row.name}
                          {row.primeComp && (
                            <span className="ml-2 text-[10px] font-normal uppercase tracking-wider text-muted-foreground">
                              Prime comp
                            </span>
                          )}
                        </Link>
                      )}
                      {row.note && (
                        <p className="mt-0.5 text-xs text-muted-foreground">{row.note}</p>
                      )}
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">{row.location}</td>
                    <td className="py-4 text-right font-mono text-sm text-foreground">
                      {row.pricePerSqm}
                    </td>
                    <td className="py-4 text-right text-sm text-muted-foreground">
                      {row.build}
                    </td>
                    <td className="py-4 text-right font-mono text-sm text-foreground">
                      {row.price}
                    </td>
                  </tr>
                );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Listed comparables (excl. Villa Elysia): simple average asking ≈{" "}
            <span className="font-mono text-foreground">
              €{marketCompsListedAvgEurPerSqm.toLocaleString("en-GB")}/m²
            </span>
            . Casa de Canto (AMES, El Madroñal) from{" "}
            <Link
              href="https://3saestate.com/listings/casa-de-canto/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-muted-foreground/50 underline-offset-2 hover:text-foreground"
            >
              3SA Estate
            </Link>{" "}
            at €11.5m / 1,175 m² ≈ €9,787/m². Homerun listings as marked. Villa Elysia indicative
            €9.23m at €11,500/m² × 803 m² sits above that average on a smaller built footprint.
          </p>

          <div className="mt-8 space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Additional sources
            </p>
            {marketSources.map((s, i) => (
              <SourceNote key={i} label={s.name} type={s.type} href={s.url} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
