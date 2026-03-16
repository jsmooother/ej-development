"use client";

import { motion } from "framer-motion";
import {
  sponsorCommitment,
  preliminaryBudget,
  preliminaryRevenue,
  fundingMilestones,
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

          <div className="mt-12 rounded-2xl border border-border bg-muted/20 p-8">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Funding drawdown · Milestones
            </p>
            <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
              Capital is drawn down at agreed project milestones rather than
              upfront, reducing execution and deployment risk. EJ Development
              provides its project ownership as security to the funding party.
            </p>
            <div className="mt-10">
              <div className="relative mx-auto max-w-2xl">
                {/* Vertical line - centered */}
                <div
                  className="absolute left-1/2 top-3 bottom-3 w-px -translate-x-px bg-border"
                  aria-hidden
                />
                <ul className="space-y-0">
                  {fundingMilestones.map((m, i) => {
                    const isLeft = i % 2 === 0;
                    return (
                      <li
                        key={i}
                        className="relative flex items-center gap-4 pb-10 last:pb-0"
                      >
                        {/* Left content (odd) or spacer */}
                        <div className={`min-w-0 flex-1 ${isLeft ? "pr-4" : ""}`}>
                          {isLeft && (
                            <div className="ml-auto max-w-[220px] rounded-xl border border-border bg-card/30 p-4 text-right">
                              <p className="font-medium text-foreground">
                                {m.milestone}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {m.description}
                              </p>
                              <p className="mt-2 font-mono text-sm text-foreground">
                                {m.amount}
                              </p>
                            </div>
                          )}
                        </div>
                        {/* Center node */}
                        <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-background">
                          <span className="text-[10px] font-medium text-foreground">
                            {i + 1}
                          </span>
                        </div>
                        {/* Right content (even) or spacer */}
                        <div className={`min-w-0 flex-1 ${!isLeft ? "pl-4" : ""}`}>
                          {!isLeft && (
                            <div className="mr-auto max-w-[220px] rounded-xl border border-border bg-card/30 p-4 text-left">
                              <p className="font-medium text-foreground">
                                {m.milestone}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {m.description}
                              </p>
                              <p className="mt-2 font-mono text-sm text-foreground">
                                {m.amount}
                              </p>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
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
