"use client";

import { motion } from "framer-motion";

export function InvestorFundingOpportunity() {
  return (
    <section id="funding" className="scroll-mt-24 border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground">
            Funding opportunity
          </p>
          <h2 className="mt-4 font-serif text-3xl font-light text-foreground md:text-4xl">
            Construction funding opportunity
          </h2>
          <div className="mt-8 space-y-6 text-muted-foreground">
            <p>
              EJ Development is seeking construction funding from private credit
              and structured investors. Land and design are already fully funded.
              We are structuring external capital for the build phase on attractive
              terms.
            </p>
            <p>
              This structure offers a different risk profile than a pure land-speculation
              or early-stage equity raise. Project development is funded through
              land and design. The
              opportunity is for construction lenders to participate in a controlled,
              well-positioned development with clear exit via sale of the completed
              villa.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
