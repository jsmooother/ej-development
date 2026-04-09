"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { amesReferences } from "@/data/investor-data";

export function InvestorTeamReferences() {
  return (
    <section id="references" className="scroll-mt-24 border-t border-border bg-muted/20 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground">
            Team & references
          </p>
          <h2 className="mt-4 font-serif text-3xl font-light text-foreground md:text-4xl">
            AMES Arquitectos · Relevant precedents
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            <a
              href="https://amesarquitectos.com/practice"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
            >
              AMES Arquitectos
            </a>{" "}
            is a Marbella-based studio founded in 2011, co-led by principals Antonio Morillo and
            Esther Sánchez with a multidisciplinary team of 20+ collaborators. The practice
            delivers luxury villas, new builds, residential, and hospitality work—pairing technical
            precision with a refined, timeless design language and strong sensitivity to site and
            landscape. For this opportunity that profile de-risks execution on difficult topography
            and supports premium positioning; the precedents below stress local fit, slope handling,
            and comparable quality.{" "}
            <span className="text-foreground">Casa de Canto</span> (AMES, El Madroñal) remains the
            closest contextual match.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {amesReferences.map((project, i) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-2xl border border-border bg-card/50 transition-colors hover:border-border/80"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-medium text-foreground">{project.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{project.location}</p>
                    <p className="mt-2 text-xs italic text-muted-foreground">
                      {project.relevance}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
