"use client";

import { motion } from "framer-motion";
import { villaElysiaBuiltAreaSqm } from "@/data/investor-data";

const valueDrivers = [
  "Tailored to the plot—each villa is uniquely designed for its site",
  "Site integration—topography and vegetation guide placement and form",
  "Dialogue with landscape—architecture and environment become one",
  "Premium materials and bespoke craftsmanship",
  "Targets international turnkey-buyer expectations",
];

const program = [
  {
    floor: "Entrance / basement level",
    items: [
      "Garage and arrival court",
      "Staff apartment",
      "Spa, hamman, sauna, and massage suite",
      "Cinema, gym, office, and games room",
      "Bar, wine storage, and service core",
    ],
  },
  {
    floor: "Ground floor",
    items: [
      "Open living, kitchen, and dining opening to the terrace",
      "Dedicated staff kitchen (back-of-house)",
      "Guest suite and courtyard light shaft",
      "Infinity pool, gazebo, and outdoor dining",
      "Porches, terraces, and landscaped garden",
    ],
  },
  {
    floor: "First floor",
    items: ["Master suite with bath and wardrobe", "Guest suites with en-suites", "Circulation and lift core"],
  },
];

export function InvestorDevelopmentConcept() {
  return (
    <section id="concept" className="scroll-mt-24 border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="grid gap-12 lg:grid-cols-2 lg:gap-20"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground">
              Development concept
            </p>
            <h2 className="mt-4 font-serif text-3xl font-light text-foreground md:text-4xl">
              Design supports value
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              The scheme uses a central courtyard and vertical light shaft to draw daylight deep into
              the plan; gym, office, and games room sit in the basement zone where retaining walls are
              not required—reducing cost in the steepest part of the plot. AMES tailors every villa to
              its plot—topography, slope, and vegetation guide the design—integrating architecture with
              the landscape, premium materials, and international turnkey expectations.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Economics use {villaElysiaBuiltAreaSqm} m² built area (Scheme 2); Site & planning
              reconciles floor schedules,
              closed built, and external lines to the same rounded totals.
            </p>
            <div className="mt-8">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Value drivers
              </p>
              <ul className="mt-3 space-y-2">
                {valueDrivers.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Estimated program
            </p>
            <div className="mt-6 space-y-4">
              {program.map((p, i) => (
                <div key={i} className="rounded-xl border border-border bg-card/30 p-5">
                  <p className="font-medium text-foreground">{p.floor}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {p.items.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
