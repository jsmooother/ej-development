"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  investorHeroPosterSrc,
  investorHeroVideoSrc,
  villaElysiaPlotSqm,
} from "@/data/investor-data";

const heroMediaClassName =
  "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover";

const heroMediaStyle = {
  minHeight: "100vh",
  minWidth: "177.78vh",
  width: "100vw",
  height: "56.25vw",
} as const;

function useAutoplayVideo(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  onPlaying: () => void
) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const markPlaying = () => onPlaying();

    const tryPlay = () => {
      if (!video.paused) return;
      void video.play().then(markPlaying).catch(() => {
        // Autoplay can be blocked until a user gesture; retries continue below.
      });
    };

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      tryPlay();
    }

    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("canplaythrough", tryPlay);
    video.addEventListener("playing", markPlaying);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const onUserInteraction = () => tryPlay();
    document.addEventListener("pointerdown", onUserInteraction, { once: true });
    document.addEventListener("keydown", onUserInteraction, { once: true });

    const retryTimer = window.setInterval(tryPlay, 750);
    const stopRetryTimer = window.setTimeout(() => {
      window.clearInterval(retryTimer);
    }, 20_000);

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("canplaythrough", tryPlay);
      video.removeEventListener("playing", markPlaying);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("pointerdown", onUserInteraction);
      document.removeEventListener("keydown", onUserInteraction);
      window.clearInterval(retryTimer);
      window.clearTimeout(stopRetryTimer);
    };
  }, [videoRef, onPlaying]);
}

export function InvestorHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const handleVideoPlaying = useCallback(() => setVideoPlaying(true), []);
  useAutoplayVideo(videoRef, handleVideoPlaying);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const rawTextY = useTransform(scrollYProgress, [0, 0.6, 1], [0, -36, -96]);
  const rawTextOpacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 0.82, 0.55]);

  // Smooth scroll-linked motion to avoid jitter while keeping effect visible.
  const textY = useSpring(rawTextY, { stiffness: 110, damping: 24, mass: 0.35 });
  const textOpacity = useSpring(rawTextOpacity, { stiffness: 110, damping: 24, mass: 0.35 });

  return (
    <section ref={sectionRef} className="relative min-h-[90vh] overflow-hidden">
      {/* Keep the video layer untransformed — transforms on parents break Safari playback. */}
      <div className="absolute inset-0 overflow-hidden bg-black">
        <Image
          src={investorHeroPosterSrc}
          alt=""
          aria-hidden
          fill
          priority
          className={`object-cover transition-opacity duration-700 ${
            videoPlaying ? "opacity-0" : "opacity-100"
          }`}
          sizes="100vw"
        />
        <video
          ref={videoRef}
          className={`${heroMediaClassName} transition-opacity duration-700 ${
            videoPlaying ? "opacity-100" : "opacity-0"
          }`}
          style={heroMediaStyle}
          src={investorHeroVideoSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-label="AMES Arquitectos · Villa Elysia hero film"
        />
      </div>
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
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1], delay: 0.08 }}
          style={{ y: textY, opacity: textOpacity }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
        >
          A 5-bedroom AMES villa with a full spa, cinema and gym level on a{" "}
          {villaElysiaPlotSqm.toLocaleString("en-GB")} m² plot in gated El Madroñal. Land and design
          fully funded.
        </motion.p>
      </div>
    </section>
  );
}
