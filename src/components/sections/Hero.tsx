"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import BlurText from "@/components/animations/BlurText";
import { hero } from "@/content/site";

const Waves = dynamic(() => import("@/components/animations/Waves"), {
  ssr: false,
});

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-cream">
      {/* Interactive waves background */}
      <Waves
        lineColor="rgba(45, 80, 22, 0.12)"
        waveSpeedX={0.015}
        waveSpeedY={0.008}
        waveAmpX={40}
        waveAmpY={20}
        xGap={12}
        yGap={36}
        friction={0.92}
        tension={0.008}
        maxCursorMove={120}
      />

      {/* Soft green gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 40%, rgba(45, 80, 22, 0.06), transparent 60%)",
        }}
      />

      <div className="grid-shell relative z-10 pt-24 pb-16">
        <div className="max-w-3xl">
          {/* Overline */}
          <motion.span
            className="inline-block text-xs uppercase tracking-[0.3em] text-sage font-medium mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Seed &middot; Fertilizer &middot; Crop Protection
          </motion.span>

          {/* Headline — Playfair serif */}
          <h1 className="text-hero text-soil" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            <BlurText
              text={hero.headline}
              className="font-normal"
              delay={150}
              direction="bottom"
              animateBy="words"
            />
          </h1>

          {/* Subhead */}
          <motion.p
            className="mt-8 max-w-xl text-lg text-stone leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            {hero.subhead}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <Link
              href={hero.cta.href}
              className="rounded-full bg-forest px-8 py-3.5 text-sm font-medium text-cream transition-all duration-300 hover:bg-forest/90 hover:scale-[1.02] text-center"
            >
              {hero.cta.label}
            </Link>
            <Link
              href={hero.ctaSecondary.href}
              className="text-sm text-stone transition-colors hover:text-forest"
            >
              {hero.ctaSecondary.label} &rarr;
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cream to-transparent pointer-events-none z-10" />
    </section>
  );
}
