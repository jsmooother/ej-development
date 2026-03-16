"use client";

import { motion } from "framer-motion";
import {
  sponsorCommitment,
  preliminaryBudget,
  preliminaryRevenue,
} from "@/data/investor-data";

export function InvestorPreliminaryEconomics() {
  return (
    <section id="economics" className="scroll-mt-24 border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground">
            Preliminary economics
          </p>
          <h2 className="mt-4 font-serif text-3xl font-light text-foreground md:text-4xl">
            Working budget assumptions
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Early-stage numbers. Not a fully diligenced financial model. Subject to
            refinement. Permit fees, taxes, financing cost, and some soft costs
            remain to be refined.
          </p>

          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card/30 p-8">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                A. Funded to date
              </p>
              <div className="mt-6 space-y-3">
                {sponsorCommitment.map((row, i) => (
                  <div
                    key={i}
                    className={`flex justify-between border-b border-border/50 py-2 ${
                      row.bold ? "font-semibold text-foreground" : ""
                    }`}
                  >
                    <span className="text-sm text-muted-foreground">{row.line}</span>
                    <span className="font-mono text-sm text-foreground">{row.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card/30 p-8">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                B. Preliminary development budget
              </p>
              <div className="mt-6 space-y-3">
                {preliminaryBudget.map((row, i) => (
                  <div
                    key={i}
                    className="flex justify-between border-b border-border/50 py-2"
                  >
                    <span className="text-sm text-muted-foreground">{row.line}</span>
                    <span className="font-mono text-sm text-foreground">{row.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card/30 p-8">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                C. Indicative revenue framework
              </p>
              <div className="mt-6 space-y-3">
                {preliminaryRevenue.map((row, i) => (
                  <div
                    key={i}
                    className={`flex justify-between border-b border-border/50 py-2 ${
                      row.bold ? "font-semibold text-foreground" : ""
                    }`}
                  >
                    <span className="text-sm text-muted-foreground">{row.line}</span>
                    <span className="font-mono text-sm text-foreground">{row.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-8 rounded-xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
            <strong className="text-foreground">Disclaimer:</strong> Preliminary
            information for discussion purposes. Not final offering material.
            Some assumptions are subject to verification and refinement.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
