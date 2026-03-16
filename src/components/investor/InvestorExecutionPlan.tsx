"use client";

import { motion } from "framer-motion";
import { executionPhases } from "@/data/investor-data";

export function InvestorExecutionPlan() {
  return (
    <section id="execution" className="scroll-mt-24 border-t border-border bg-muted/20 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground">
            Execution plan
          </p>
          <h2 className="mt-4 font-serif text-3xl font-light text-foreground md:text-4xl">
            Timeline & sequencing
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Project control and sequencing. Design development underway; permit,
            funding close, construction, and exit to follow.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {executionPhases.map((phase, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 rounded-xl border border-border bg-card/30 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{phase.phase}</span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      phase.status === "In progress"
                        ? "bg-foreground/10 text-foreground"
                        : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {phase.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Est. delivery: {phase.estimatedDelivery}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
