"use client";

import { motion } from "framer-motion";
import { executiveSummary } from "@/data/investor-data";

export function InvestorExecutiveSummary() {
  return (
    <section className="border-y border-border bg-card/30 py-10 md:py-12">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-4 lg:grid-cols-4"
        >
          {executiveSummary.map((item) => (
            <div key={item.label} className="border-b border-border/50 pb-3">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">{item.value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
