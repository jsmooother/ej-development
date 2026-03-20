"use client";

import Image from "next/image";
import Link from "next/link";
import { FileDown } from "lucide-react";
import { motion } from "framer-motion";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const asset = (path: string) =>
  supabaseUrl ? `${supabaseUrl}/storage/v1/object/public/images/${path}` : `/${path}`;

const verifiedFacts = [
  { label: "Plot size", value: "3,038 m²" },
  { label: "Classification", value: "Urban land" },
  { label: "Cadastral", value: "0644927UF2404S0000GQ" },
  { label: "Address", value: "Plot 102B, UR Madroñal EL 102[B], 29679 Benahavís, Málaga" },
  { label: "Survey note", value: "Parcel not cleared on measurement day" },
  { label: "Survey", value: "Nov 2025 · ETRS-89, UTM Zone 30" },
];

const planningParams = [
  { label: "Buildability", value: "0.20 m²/m²" },
  { label: "Max buildable", value: "607.6 m²" },
  { label: "Max height", value: "7 m" },
  { label: "Max floors", value: "2" },
];

const openItems = [
  "Geotechnical implications",
  "Retaining / structural complexity",
  "Vegetation / arborist constraints",
  "Permit taxes and municipal fee detail",
  "Utilities confirmation",
];

export function InvestorSitePlanning() {
  return (
    <section id="site" className="scroll-mt-24 border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="grid gap-12 lg:grid-cols-2 lg:gap-16"
        >
          <div className="order-2 lg:order-1 space-y-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
              <Image
                src={asset("investor/plot-plan.png")}
                alt="Plot plan · Aerial view · El Madroñal Plot 102B"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/30">
              <Image
                src={asset("investor/altimetria-crop.png")}
                alt="Topographic survey · Altimetría · Parcela 102(B)"
                width={800}
                height={600}
                className="w-full object-contain"
                sizes="(max-width: 768px) 100vw, 520px"
                unoptimized
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Plot plan · Topographic survey · Nov 2025
            </p>
            <Link
              href={asset("investor/251106-altimetria.pdf")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <FileDown className="h-3.5 w-3.5" />
              View full topography survey (PDF)
            </Link>
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground">
              Site & planning
            </p>
            <h2 className="mt-4 font-serif text-3xl font-light text-foreground md:text-4xl">
              Urbanización El Madroñal · Plot 102B
            </h2>
            <p className="mt-6 text-muted-foreground">
              Natural slope allows basement construction and terraced landscaping.
              Setbacks: 3m public, 6m private. Risk is identified and managed early.
            </p>

            <div className="mt-10 space-y-8">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Verified site facts
                </p>
                <div className="mt-3 space-y-2">
                  {verifiedFacts.map((s, i) => (
                    <div key={i} className="flex flex-col gap-1 border-b border-border/50 py-2 md:flex-row md:items-start md:justify-between md:gap-4">
                      <span className="text-sm text-muted-foreground">{s.label}</span>
                      <span className="text-sm font-medium text-foreground md:max-w-[60%] md:text-right">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Planning parameters
                </p>
                <div className="mt-3 space-y-2">
                  {planningParams.map((s, i) => (
                    <div key={i} className="flex flex-col gap-1 border-b border-border/50 py-2 md:flex-row md:items-start md:justify-between md:gap-4">
                      <span className="text-sm text-muted-foreground">{s.label}</span>
                      <span className="text-sm font-medium text-foreground md:max-w-[60%] md:text-right">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Open diligence items
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  To be confirmed / refined:
                </p>
                <ul className="mt-2 space-y-1">
                  {openItems.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
