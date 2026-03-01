"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { cta } from "@/content/site";

const Ribbons = dynamic(() => import("@/components/animations/Ribbons"), {
  ssr: false,
});

export function RibbonCta() {
  return (
    <section className="relative overflow-hidden bg-soil" style={{ minHeight: "70vh" }}>
      {/* Ribbons background */}
      <div className="absolute inset-0 pointer-events-auto">
        <Ribbons
          colors={["#7C9A6E", "#C4A94D", "#2D5016", "#A3B899", "#5C3D2E"]}
          baseSpring={0.025}
          baseFriction={0.92}
          baseThickness={25}
          offsetFactor={0.06}
          pointCount={60}
          speedMultiplier={0.5}
        />
      </div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-soil/60 pointer-events-none" />

      {/* Content */}
      <div
        className="grid-narrow relative z-10 text-center flex flex-col items-center justify-center"
        style={{ minHeight: "70vh", paddingBlock: "clamp(5rem, 12vw, 9rem)" }}
      >
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
          className="mt-5 text-base text-cream/50 sm:text-lg"
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
