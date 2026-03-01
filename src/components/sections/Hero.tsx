"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import BlurText from "@/components/animations/BlurText";
import { hero } from "@/content/site";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-cream">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233D2B1F' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
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

          {/* Headline */}
          <h1 className="text-hero text-soil">
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
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cream to-transparent pointer-events-none" />
    </section>
  );
}
