"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight, FileDown } from "lucide-react";
import { motion } from "framer-motion";
import {
  sitePlanningHeroCarouselSlides,
  sitePlanningSurveyCarouselSlides,
  villaElysiaFloorBreakdown,
  villaElysiaAmesClosedBuilt,
  villaElysiaExternalElements,
  villaElysiaAreaFootnotes,
} from "@/data/investor-data";

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

type HeroSlide = (typeof sitePlanningHeroCarouselSlides)[number];
type SurveySlide = (typeof sitePlanningSurveyCarouselSlides)[number];

function SiteHeroCarousel() {
  const [index, setIndex] = useState(0);
  const n = sitePlanningHeroCarouselSlides.length;
  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + n) % n);
    },
    [n]
  );

  const slide = sitePlanningHeroCarouselSlides[index]!;

  return (
    <div className="w-full space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-sm">
        <div
          className="relative isolate w-full bg-muted/20"
          style={{ minHeight: "clamp(220px, 42vw, 560px)" }}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className={
              slide.objectFit === "cover"
                ? "object-cover"
                : "object-contain object-center p-2 sm:p-4"
            }
            sizes="(max-width: 768px) 100vw, 1152px"
            priority={index === 0}
          />
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 sm:px-3">
          <button
            type="button"
            onClick={() => go(-1)}
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/95 text-foreground shadow-md backdrop-blur transition hover:bg-background"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 sm:px-3">
          <button
            type="button"
            onClick={() => go(1)}
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/95 text-foreground shadow-md backdrop-blur transition hover:bg-background"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground sm:max-w-[70%]">{slide.caption}</p>
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/80">
          {index + 1} / {n}
        </p>
      </div>
      <div
        className="flex justify-center gap-1.5"
        role="tablist"
        aria-label="Villa renders"
      >
        {sitePlanningHeroCarouselSlides.map((s: HeroSlide, i) => (
          <button
            key={s.key}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show: ${s.caption}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-foreground" : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function SiteSurveyCarousel() {
  const [index, setIndex] = useState(0);
  const n = sitePlanningSurveyCarouselSlides.length;
  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + n) % n);
    },
    [n]
  );

  const slide = sitePlanningSurveyCarouselSlides[index]!;

  return (
    <div className="mt-10 w-full space-y-4">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Topographic survey
      </p>
      <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-sm">
        <div
          className="relative isolate w-full bg-muted/20"
          style={{ minHeight: "clamp(200px, 36vw, 480px)" }}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className={
              slide.objectFit === "cover"
                ? "object-cover"
                : "object-contain object-center p-2 sm:p-4"
            }
            sizes="(max-width: 768px) 100vw, 1152px"
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 sm:px-3">
          <button
            type="button"
            onClick={() => go(-1)}
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/95 text-foreground shadow-md backdrop-blur transition hover:bg-background"
            aria-label="Previous survey image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 sm:px-3">
          <button
            type="button"
            onClick={() => go(1)}
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/95 text-foreground shadow-md backdrop-blur transition hover:bg-background"
            aria-label="Next survey image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground sm:max-w-[70%]">{slide.caption}</p>
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/80">
          {index + 1} / {n}
        </p>
      </div>
      <div
        className="flex justify-center gap-1.5"
        role="tablist"
        aria-label="Topographic survey"
      >
        {sitePlanningSurveyCarouselSlides.map((s: SurveySlide, i) => (
          <button
            key={s.key}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show: ${s.caption}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-foreground" : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function InvestorSitePlanning() {
  return (
    <section id="site" className="scroll-mt-24 border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground">
            Site & planning
          </p>
          <h2 className="mt-4 font-serif text-3xl font-light text-foreground md:text-4xl">
            Villa Elysia · El Madroñal · Plot 102B
          </h2>
          <p className="mt-6 max-w-3xl text-muted-foreground">
            The plot&apos;s steep topography becomes a selling point: a terraced villa that stacks
            entrance, ground, and first levels into a clear sequence of arrival, living, and private
            zones—each with its own relationship to the land. A central courtyard and vertical light
            shaft thread daylight through the plan and tie the volume to long views, giving Villa
            Elysia a distinctive, premium spatial story that stands out in El Madroñal.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="mt-10 w-full"
        >
          <SiteHeroCarousel />
          <SiteSurveyCarousel />
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href="/investor/251106-altimetria.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <FileDown className="h-3.5 w-3.5" />
              View full topography survey (PDF)
            </Link>
            <span className="text-xs text-muted-foreground/80">
              Two renders above; topographic survey crop below
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-16"
        >
          <div className="mx-auto max-w-2xl space-y-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Verified site facts
              </p>
              <div className="mt-3 space-y-2">
                {verifiedFacts.map((s, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-1 border-b border-border/50 py-2 md:flex-row md:items-start md:justify-between md:gap-4"
                  >
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
                  <div
                    key={i}
                    className="flex flex-col gap-1 border-b border-border/50 py-2 md:flex-row md:items-start md:justify-between md:gap-4"
                  >
                    <span className="text-sm text-muted-foreground">{s.label}</span>
                    <span className="text-sm font-medium text-foreground md:max-w-[60%] md:text-right">
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-20 space-y-12 border-t border-border pt-16"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground">
              Architectural areas
            </p>
            <h3 className="mt-3 font-serif text-2xl font-light text-foreground md:text-3xl">
              Villa Elysia · Schedules and closed built
            </h3>
            <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
              Working drawings (Mar 2026). The floor “In” column, closed-built bands, and external
              element list are reconciled to the same schedule rounded totals (803 m² enclosed, 605 m²
              external).
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card/30 p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Floor breakdown (m²)
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[260px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border/50 text-xs text-muted-foreground">
                      <th className="py-2 pr-3 text-left font-medium">Level</th>
                      <th className="w-[4.25rem] py-2 text-right font-medium font-mono tabular-nums">
                        In
                      </th>
                      <th className="w-[4.25rem] py-2 text-right font-medium font-mono tabular-nums">
                        Out
                      </th>
                      <th className="w-[4.25rem] py-2 pl-1 text-right font-medium font-mono tabular-nums">
                        Σ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {villaElysiaFloorBreakdown.map((row, i) => (
                      <tr
                        key={i}
                        className={`border-b border-border/50 ${
                          row.isTotal ? "font-semibold text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        <td className={`py-2 pr-3 ${row.isTotal ? "text-foreground" : ""}`}>
                          {row.level}
                        </td>
                        <td className="w-[4.25rem] py-2 text-right font-mono tabular-nums text-foreground">
                          {row.insideSqm}
                        </td>
                        <td className="w-[4.25rem] py-2 text-right font-mono tabular-nums text-foreground">
                          {row.outsideSqm}
                        </td>
                        <td className="w-[4.25rem] py-2 pl-1 text-right font-mono tabular-nums text-foreground">
                          {row.totalSqm}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card/30 p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Closed built
              </p>
              <div className="mt-4 space-y-2">
                {villaElysiaAmesClosedBuilt.map((row, i) => (
                  <div
                    key={i}
                    className={`flex justify-between gap-4 border-b border-border/50 py-2 ${
                      row.bold ? "font-semibold text-foreground" : ""
                    }`}
                  >
                    <span className="text-sm text-muted-foreground">{row.line}</span>
                    <span className="w-[4.25rem] shrink-0 font-mono text-sm text-right tabular-nums text-foreground">
                      {row.sqm}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card/30 p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                External elements
              </p>
              <div className="mt-4 space-y-2">
                {villaElysiaExternalElements.map((row, i) => (
                  <div
                    key={i}
                    className={`flex justify-between gap-4 border-b border-border/50 py-2 ${
                      row.bold ? "font-semibold text-foreground" : ""
                    }`}
                  >
                    <span className="text-sm text-muted-foreground">{row.element}</span>
                    <span className="w-[4.25rem] shrink-0 font-mono text-sm text-right tabular-nums text-foreground">
                      {row.sqm}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Methodology notes
            </p>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              {villaElysiaAreaFootnotes.map((line, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
