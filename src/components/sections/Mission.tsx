"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { mission, values } from "@/content/site";

export function Mission() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="section-shell section-cream">
      <div className="grid-shell" ref={ref}>
        {/* Statement */}
        <motion.div
          className="grid-narrow text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
        >
          <h2
            className="text-display text-soil"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            {mission.headline}
          </h2>
          <p className="mt-6 text-base text-stone leading-[1.8] sm:text-lg">
            {mission.body}
          </p>
        </motion.div>

        {/* Values */}
        <div className="grid-narrow">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              className="group flex gap-6 py-8 border-t border-border first:border-t-0"
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.3 + i * 0.1,
                ease: [0.25, 1, 0.5, 1],
              }}
            >
              <span className="text-2xl font-light text-sage/40 tabular-nums shrink-0 w-8">
                0{i + 1}
              </span>
              <div>
                <h3 className="text-lg font-medium text-soil tracking-tight group-hover:text-forest transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="mt-1.5 text-sm text-stone leading-relaxed">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
