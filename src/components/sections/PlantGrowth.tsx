"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";

const PlantScene = dynamic(() => import("@/components/3d/PlantScene"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-cream-dark" />,
});

const stages = [
  {
    range: [0, 0.2] as [number, number],
    label: "Premium Seed Genetics",
    description: "It starts underground. High-performance varieties selected for your specific soil type and climate zone.",
    side: "right" as const,
  },
  {
    range: [0.2, 0.4] as [number, number],
    label: "Soil Health Biologicals",
    description: "Microbes and amendments that build the root zone — feeding the plant from the ground up.",
    side: "left" as const,
  },
  {
    range: [0.4, 0.6] as [number, number],
    label: "Custom Fertility Blends",
    description: "Nitrogen, phosphorus, potassium — dialed to your soil test. No guessing, no waste.",
    side: "right" as const,
  },
  {
    range: [0.6, 0.8] as [number, number],
    label: "Crop Protection",
    description: "The right chemistry at the right time. Herbicides, fungicides, and insecticides that keep your stand clean.",
    side: "left" as const,
  },
  {
    range: [0.8, 1.0] as [number, number],
    label: "Harvest-Ready Yields",
    description: "Every input builds on the last. The result: a crop that performs and a bottom line that proves it.",
    side: "right" as const,
  },
];

function Callout({
  stage,
  scrollProgress,
}: {
  stage: (typeof stages)[0];
  scrollProgress: import("framer-motion").MotionValue<number>;
}) {
  const opacity = useTransform(scrollProgress, (p) => {
    const mid = (stage.range[0] + stage.range[1]) / 2;
    const dist = Math.abs(p - mid);
    const halfWidth = (stage.range[1] - stage.range[0]) / 2;
    if (dist > halfWidth) return 0;
    return 1 - dist / halfWidth;
  });

  const y = useTransform(scrollProgress, (p) => {
    const mid = (stage.range[0] + stage.range[1]) / 2;
    return (p - mid) * -80;
  });

  return (
    <motion.div
      className={`absolute top-1/2 w-[280px] sm:w-[320px] ${
        stage.side === "left" ? "left-6 sm:left-12 lg:left-[8%]" : "right-6 sm:right-12 lg:right-[8%]"
      }`}
      style={{ opacity, y }}
    >
      <div className="border-l-2 border-forest/40 pl-5">
        <span className="text-[10px] uppercase tracking-[0.3em] text-sage font-medium">
          {stage.label}
        </span>
        <p className="mt-2 text-sm text-stone leading-relaxed">{stage.description}</p>
      </div>
    </motion.div>
  );
}

export function PlantGrowth() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={containerRef} className="relative" style={{ height: "400vh" }}>
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden bg-cream-dark">
        {/* Progress bar */}
        <motion.div
          className="absolute top-0 left-0 h-1 bg-forest/30 z-20"
          style={{ width: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
        />

        {/* 3D Plant */}
        <div className="absolute inset-0 z-0">
          <PlantScene scrollProgress={scrollYProgress} />
        </div>

        {/* Soil line */}
        <motion.div
          className="absolute inset-x-0 z-10 pointer-events-none"
          style={{
            bottom: "30%",
            height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(92, 61, 46, 0.2), transparent)",
            opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]),
          }}
        />

        {/* Callout annotations */}
        {stages.map((stage) => (
          <Callout key={stage.label} stage={stage} scrollProgress={scrollYProgress} />
        ))}

        {/* Section label */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-center"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [1, 0.4, 0.4, 0]) }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-stone/50">
            Scroll to grow
          </span>
        </motion.div>
      </div>
    </section>
  );
}
