"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  investorHeroPosterSrc,
  investorHeroVideoSrc,
  villaElysiaBuiltAreaSqm,
  villaElysiaPlotSqm,
} from "@/data/investor-data";

function useAutoplayVideo(videoRef: React.RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      if (video.paused) {
        void video.play().catch(() => {
          // Autoplay can be blocked until a user gesture; retry on interaction.
        });
      }
    };

    tryPlay();
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("loadeddata", tryPlay);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const onUserInteraction = () => tryPlay();
    document.addEventListener("pointerdown", onUserInteraction, { once: true });

    return () => {
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("loadeddata", tryPlay);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("pointerdown", onUserInteraction);
    };
  }, [videoRef]);
}

export function InvestorHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  useAutoplayVideo(videoRef);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const rawTextY = useTransform(scrollYProgress, [0, 0.6, 1], [0, -36, -96]);
  const rawTextOpacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 0.82, 0.55]);
  const rawMediaY = useTransform(scrollYProgress, [0, 1], [0, 38]);

  // Smooth scroll-linked motion to avoid jitter while keeping effect visible.
  const textY = useSpring(rawTextY, { stiffness: 110, damping: 24, mass: 0.35 });
  const textOpacity = useSpring(rawTextOpacity, { stiffness: 110, damping: 24, mass: 0.35 });
  const mediaY = useSpring(rawMediaY, { stiffness: 110, damping: 24, mass: 0.35 });

  return (
    <section ref={sectionRef} className="relative min-h-[90vh] overflow-hidden">
      <motion.div className="absolute inset-0 overflow-hidden" style={{ y: mediaY }}>
        <video
          ref={videoRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover"
          style={{
            minHeight: "100vh",
            minWidth: "177.78vh",
            width: "100vw",
            height: "56.25vw",
          }}
          src={investorHeroVideoSrc}
          poster={investorHeroPosterSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-label="AMES Arquitectos · Villa Elysia hero film"
        />
      </motion.div>
      {/* Gradient keeps hero text readable without hiding the film */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/35 to-transparent"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-[85vh] flex-col justify-end px-6 pb-20 pt-32 md:px-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
          style={{ y: textY, opacity: textOpacity }}
          className="max-w-4xl"
        >
          <p className="text-sm font-medium text-muted-foreground">
            Villa Elysia by EJ Properties and AMES Arquitectos
          </p>
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.35em] text-muted-foreground/85">
            Urbanización El Madroñal · Benahavís
          </p>
          <h1 className="mt-4 font-serif text-4xl font-light leading-[1.1] text-foreground md:text-5xl lg:text-6xl">
            Construction funding
            <br />
            <span className="text-foreground/80">Villa Elysia</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Project development fully funded for land and design.{" "}
            {villaElysiaPlotSqm.toLocaleString("en-GB")} m² plot · {villaElysiaBuiltAreaSqm} m² built
            area (AMES Scheme 2). Construction funding sought.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
