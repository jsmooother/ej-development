"use client";

import { motion } from "framer-motion";

const HERO_VIDEO =
  "https://player.vimeo.com/video/1125999153?background=1&autoplay=1&loop=1&muted=1";

export function InvestorHero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* AMES hero video from amesarquitectos.com - same as their homepage */}
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          src={HERO_VIDEO}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            minHeight: "100vh",
            minWidth: "177.78vh",
            width: "100vw",
            height: "56.25vw",
          }}
          allow="autoplay; fullscreen"
          allowFullScreen
          title="AMES Arquitectos"
        />
      </div>
      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-[85vh] flex-col justify-end px-6 pb-20 pt-32 md:px-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
          className="max-w-4xl"
        >
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground">
            EJ Development · Urbanización El Madroñal · Benahavís
          </p>
          <h1 className="mt-4 font-serif text-4xl font-light leading-[1.1] text-foreground md:text-5xl lg:text-6xl">
            Construction funding
            <br />
            <span className="text-foreground/80">El Madroñal Villa</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Project development fully funded for land and design. 3,038 m² plot ·
            800 m² target build. Construction funding sought.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
