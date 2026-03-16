"use client";

import { motion } from "framer-motion";

const thesis = [
  "Development with land and design fully funded",
  "Established high-end gated hillside submarket (El Madroñal)",
  "Limited new supply due to planning and plot scarcity",
  "Design-led product targeting international luxury buyers",
  "Attractive construction-to-exit value spread",
];

export function InvestorWhyThisProject() {
  return (
    <section id="why" className="scroll-mt-24 border-t border-border bg-muted/20 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground">
            Investment thesis
          </p>
          <h2 className="mt-4 font-serif text-3xl font-light text-foreground md:text-4xl">
            Why this project
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Structure with meaningful capital already committed to land and design.
            Design-led product in a controlled, risk-managed execution framework.
          </p>
          <ul className="mt-10 space-y-4">
            {thesis.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-4 border-l-2 border-border pl-4"
              >
                <span className="font-serif text-xl font-light text-muted-foreground/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
