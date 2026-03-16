"use client";

import { motion } from "framer-motion";
import { keyRisks } from "@/data/investor-data";

export function InvestorKeyRisks() {
  return (
    <section id="risks" className="scroll-mt-24 border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground">
            Risk management
          </p>
          <h2 className="mt-4 font-serif text-3xl font-light text-foreground md:text-4xl">
            Key risks & mitigations
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Identified, managed, and controlled. Topography and vegetation are
            project-specific priority risks.
          </p>

          <div className="mt-10 space-y-4">
            {keyRisks.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card/30 p-6"
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Risk
                    </p>
                    <p className="mt-1 font-medium text-foreground">{item.risk}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Why it matters
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.why}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Mitigation
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.mitigation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
