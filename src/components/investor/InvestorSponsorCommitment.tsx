"use client";

import { motion } from "framer-motion";
import { sponsorCommitment } from "@/data/investor-data";

export function InvestorSponsorCommitment() {
  return (
    <section id="sponsor" className="scroll-mt-24 border-t border-border bg-muted/20 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground">
            Capital committed
          </p>
          <h2 className="mt-4 font-serif text-3xl font-light text-foreground md:text-4xl">
            Capital stack
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Land and design are already funded. EJ Development is not asking
            partners to fund everything from zero.
          </p>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card/30 p-8">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Funded to date
              </p>
              <div className="mt-6 space-y-4">
                {sponsorCommitment.map((row, i) => (
                  <div
                    key={i}
                    className={`flex justify-between border-b border-border/50 py-3 ${
                      row.bold ? "font-semibold text-foreground" : ""
                    }`}
                  >
                    <span className="text-sm text-muted-foreground">
                      {row.line}
                      {row.note && (
                        <span className="ml-1 text-muted-foreground/80">{row.note}</span>
                      )}
                    </span>
                    <span className="font-mono text-sm text-foreground">{row.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card/30 p-8">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Capital structure
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex gap-4">
                  <span className="font-mono text-sm text-muted-foreground">1</span>
                  <span className="text-sm text-foreground">
                    Project capital: land + design + early-stage project costs
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="font-mono text-sm text-muted-foreground">2</span>
                  <span className="text-sm text-foreground">
                    External capital sought: construction financing and build-phase funding
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="font-mono text-sm text-muted-foreground">3</span>
                  <span className="text-sm text-foreground">Exit: sale of completed villa</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
