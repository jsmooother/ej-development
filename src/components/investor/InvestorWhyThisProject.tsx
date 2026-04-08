"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useCallback, useEffect, useId, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { villaElysiaContextMapSrc, villaElysiaImages } from "@/data/investor-data";

const thesis = [
  "Development with land and design fully funded",
  "Established high-end gated hillside submarket (El Madroñal)",
  "Limited new supply due to planning and plot scarcity",
  "Design-led product targeting international luxury buyers",
  "Attractive construction-to-exit value spread",
];

const siteContextImage = villaElysiaImages.find((i) => i.src === villaElysiaContextMapSrc)!;

function ContextMapLightbox({
  open,
  onClose,
  titleId,
}: {
  open: boolean;
  onClose: () => void;
  titleId: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleBackdropClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={handleBackdropClick}
    >
      <div className="relative max-h-[min(92vh,1200px)] max-w-[min(96vw,1600px)]">
        <h2 id={titleId} className="sr-only">
          {siteContextImage.alt}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-1 -top-10 rounded-md px-2 py-1 text-sm text-white/90 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:left-full sm:right-auto sm:top-2 sm:ml-3"
        >
          Close
        </button>
        <Image
          src={siteContextImage.src}
          alt={siteContextImage.alt}
          width={2400}
          height={1600}
          className="max-h-[min(92vh,1200px)] max-w-[min(96vw,1600px)] w-auto object-contain"
          sizes="96vw"
        />
      </div>
    </div>,
    document.body,
  );
}

export function InvestorWhyThisProject() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const lightboxTitleId = useId();

  return (
    <section id="why" className="scroll-mt-24 border-t border-border bg-muted/20 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14"
        >
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground">
              Investment thesis
            </p>
            <h2 className="mt-4 font-serif text-3xl font-light text-foreground md:text-4xl">
              Why this project
            </h2>
            <p className="mt-6 max-w-2xl text-muted-foreground">
              Meaningful capital is already committed to land and design, reducing
              early-stage project risk.
              <br />
              <br />
              The project is underwritten to deliver a strong margin at exit.
              Construction will be procured on a fixed-cost basis, which limits cost
              overrun risk and improves downside protection for financing partners.
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
          </div>

          <div className="min-w-0 lg:sticky lg:top-28">
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="group relative block w-full overflow-hidden rounded-2xl border border-border bg-background/80 text-left transition-[border-color,box-shadow] hover:border-muted-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={`Open larger view: ${siteContextImage.alt}`}
              >
                <Image
                  src={siteContextImage.src}
                  alt={siteContextImage.alt}
                  width={1200}
                  height={800}
                  className="w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 480px"
                  priority
                />
                <span className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-background/90 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground shadow-sm opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  Click to enlarge
                </span>
              </button>
              <p className="text-xs text-muted-foreground">{siteContextImage.caption}</p>
            </div>
            <ContextMapLightbox
              open={lightboxOpen}
              onClose={() => setLightboxOpen(false)}
              titleId={lightboxTitleId}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
