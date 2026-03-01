"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import CountUp from "@/components/animations/CountUp";
import { stats } from "@/content/site";

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="section-forest">
      <div className="grid-shell" ref={ref}>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                ease: [0.25, 1, 0.5, 1],
              }}
            >
              <p className="text-4xl font-light text-cream md:text-5xl">
                <CountUp
                  to={stat.value}
                  duration={2.5}
                  separator=","
                  suffix={stat.suffix}
                />
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-sage-light/70">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
