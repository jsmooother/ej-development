"use client";

import { motion } from "framer-motion";
import { fundingStructures } from "@/data/investor-data";

export function InvestorFundingStructure() {
  return (
    <section id="structure" className="scroll-mt-24 border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground">
            Funding structure options
          </p>
          <h2 className="mt-4 font-serif text-3xl font-light text-foreground md:text-4xl">
            Indicative structures under consideration
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Examples only—not final terms. No legal drafting; structure subject to
            discussion and refinement.
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {fundingStructures.map((struct, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card/30 p-8"
              >
                <p className="font-medium text-foreground">{struct.title}</p>
                <ul className="mt-6 space-y-3">
                  {struct.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
