"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const locationBenefits = [
  "Limited supply of plots with strong views",
  "Adjacency to ultra-prime La Zagaleta",
  "Strong international buyer demand",
  "Clear regulatory framework and buildability",
];

const driveTimes = [
  { destination: "San Pedro & Puerto Banús", time: "~10–15 min" },
  { destination: "Marbella", time: "~20 min" },
  { destination: "Málaga International Airport", time: "<1 hour" },
];

export function InvestorLocationInvestmentCase() {
  return (
    <section id="location" className="scroll-mt-24 border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="grid gap-12 lg:grid-cols-5 lg:gap-16"
        >
          <div className="lg:col-span-3 space-y-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground">
                Location
              </p>
              <h2 className="mt-4 font-serif text-3xl font-light text-foreground md:text-4xl">
                Investment case
              </h2>
            </div>
            <p className="text-muted-foreground">
              El Madroñal represents a highly defensible luxury real estate investment driven by
              scarcity, planning certainty, and prime positioning within one of Marbella&apos;s most
              established high-end residential corridors.
            </p>
            <p className="text-muted-foreground">
              El Madroñal is a low-density, gated hillside community with 24/7 security, positioned
              directly adjacent to La Zagaleta, one of Europe&apos;s most exclusive residential estates.
              This proximity creates a strong pricing anchor while allowing access to a broader buyer
              market.
            </p>
            <p className="text-muted-foreground">
              At the same time, the location offers a rare balance between privacy and accessibility.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              {driveTimes.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                  <span>
                    {item.time} to {item.destination}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground">
              This combination of seclusion, security, and connectivity is a key driver of sustained
              international demand.
            </p>
          </div>

          <div className="min-w-0 lg:col-span-2 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-border bg-muted/20 p-8">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Location benefits
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                In summary, the location benefits from:
              </p>
              <ul className="mt-6 space-y-3">
                {locationBenefits.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 border-b border-border/50 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="mt-0.5 flex h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-muted-foreground">
                This creates a robust foundation for a design-led luxury development with both
                downside protection and long-term value potential.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
