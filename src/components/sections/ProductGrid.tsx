"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import SpotlightCard from "@/components/animations/SpotlightCard";
import { productCategories } from "@/content/site";

const icons: Record<string, React.ReactNode> = {
  seed: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32" stroke="currentColor" strokeWidth={1.5}>
      <path d="M16 28c0-8-6-14-12-14 0 8 6 14 12 14z" />
      <path d="M16 28c0-8 6-14 12-14 0 8-6 14-12 14z" />
      <path d="M16 28V12" />
    </svg>
  ),
  fertilizer: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32" stroke="currentColor" strokeWidth={1.5}>
      <path d="M8 28V14l8-10 8 10v14" />
      <path d="M12 28v-8h8v8" />
      <path d="M8 18h16" />
    </svg>
  ),
  protection: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32" stroke="currentColor" strokeWidth={1.5}>
      <path d="M16 4l10 4v8c0 6-4 10-10 12C10 26 6 22 6 16V8l10-4z" />
      <path d="M12 16l3 3 5-6" />
    </svg>
  ),
  soil: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32" stroke="currentColor" strokeWidth={1.5}>
      <path d="M4 20h24" />
      <path d="M8 24h16" />
      <path d="M6 28h20" />
      <circle cx="16" cy="12" r="6" />
      <path d="M16 6v-2M22 12h2M10 12H8M20.2 7.8l1.4-1.4M11.8 7.8l-1.4-1.4" />
    </svg>
  ),
};

export function ProductGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section className="section-shell section-white">
      <div className="grid-shell" ref={ref}>
        {/* Header */}
        <motion.div
          className="grid-narrow text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-sage font-medium">
            What We Carry
          </span>
          <h2
            className="mt-5 text-display text-soil"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            Everything your operation needs.
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {productCategories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.1 + i * 0.08,
                ease: [0.25, 1, 0.5, 1],
              }}
            >
              <Link href={cat.href}>
                <SpotlightCard className="h-full group cursor-pointer transition-all duration-300 hover:border-sage/40">
                  <div className="text-sage group-hover:text-forest transition-colors duration-300">
                    {icons[cat.icon]}
                  </div>
                  <h3 className="mt-5 text-lg font-medium text-soil tracking-tight">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-sm text-stone leading-relaxed">
                    {cat.description}
                  </p>
                  <span className="mt-4 inline-block text-xs text-sage font-medium uppercase tracking-[0.15em] group-hover:text-forest transition-colors">
                    Learn More &rarr;
                  </span>
                </SpotlightCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
