"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cta } from "@/content/site";

export function CtaBlock() {
  return (
    <section className="section-soil relative overflow-hidden">
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(124, 154, 110, 0.08), transparent 55%)",
        }}
      />

      <div className="grid-narrow relative z-10 text-center" style={{ paddingBlock: "clamp(5rem, 12vw, 9rem)" }}>
        <motion.h2
          className="text-display text-cream"
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontStyle: "italic",
            fontWeight: 400,
          }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
        >
          {cta.headline}
        </motion.h2>
        <motion.p
          className="mt-5 text-base text-cream/60 sm:text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {cta.subhead}
        </motion.p>
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Link
            href={cta.href}
            className="rounded-full bg-wheat px-8 py-3.5 text-sm font-medium text-soil transition-all duration-300 hover:bg-wheat-light hover:scale-[1.02]"
          >
            {cta.buttonLabel}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
