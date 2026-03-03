"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/*  Growth stages — image + product callout data                      */
/* ------------------------------------------------------------------ */

const stages = [
  {
    image: "/images/growth/01-seedling.jpg",
    label: "Premium Seed Genetics",
    description:
      "It starts underground. High-performance varieties selected for your specific soil type and climate zone.",
    position: { top: "55%", left: "8%" } as const,
    side: "left" as const,
  },
  {
    image: "/images/growth/02-young-plant.jpg",
    label: "Soil Health Biologicals",
    description:
      "Microbes and amendments that build the root zone — feeding the plant from the ground up.",
    position: { top: "40%", right: "6%" } as const,
    side: "right" as const,
  },
  {
    image: "/images/growth/03-stalk.jpg",
    label: "Custom Fertility Blends",
    description:
      "Nitrogen, phosphorus, potassium — dialed to your soil test. No guessing, no waste.",
    position: { top: "45%", left: "6%" } as const,
    side: "left" as const,
  },
  {
    image: "/images/growth/03b-mature.jpg",
    label: "Crop Protection",
    description:
      "The right chemistry at the right time. Herbicides, fungicides, and insecticides that keep your stand clean.",
    position: { top: "35%", right: "6%" } as const,
    side: "right" as const,
  },
  {
    image: "/images/growth/04-ear.jpg",
    label: "Peak Performance",
    description:
      "Full ears, packed kernels, clean husks. This is what dialed-in agronomy looks like at the plant level.",
    position: { top: "45%", left: "6%" } as const,
    side: "left" as const,
  },
  {
    image: "/images/growth/05-harvest.jpg",
    label: "Harvest-Ready Yields",
    description:
      "Every input builds on the last. The result: a crop that performs and a bottom line that proves it.",
    position: { top: "40%", right: "8%" } as const,
    side: "right" as const,
  },
];

const STAGE_COUNT = stages.length;

/* ------------------------------------------------------------------ */
/*  Single growth stage — image layer + callout                       */
/* ------------------------------------------------------------------ */

function GrowthStage({
  stage,
  index,
  scrollProgress,
}: {
  stage: (typeof stages)[number];
  index: number;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const start = index / STAGE_COUNT;
  const end = (index + 1) / STAGE_COUNT;
  const mid = (start + end) / 2;

  // Image: wipe-up reveal via clip-path, first image starts fully visible
  const clipTop = useTransform(
    scrollProgress,
    index === 0
      ? [0, 0] // first image always visible
      : [start, start + 0.04],
    index === 0 ? [0, 0] : [100, 0]
  );

  const clipPath = useTransform(clipTop, (v) => `inset(${v}% 0 0 0)`);

  // Image scale: slight zoom out as you scroll through
  const scale = useTransform(scrollProgress, [start, end], [1.15, 1.0]);

  // Callout: fade + slide in after image reveals, fade out before next stage
  const calloutOpacity = useTransform(
    scrollProgress,
    [start + 0.04, start + 0.08, end - 0.04, end - 0.01],
    [0, 1, 1, 0]
  );

  const calloutX = useTransform(
    scrollProgress,
    [start + 0.04, start + 0.08],
    [stage.side === "left" ? -40 : 40, 0]
  );

  const calloutY = useTransform(scrollProgress, [mid - 0.06, mid + 0.06], [10, -10]);

  // Stage number pulse
  const numberOpacity = useTransform(
    scrollProgress,
    [start + 0.02, start + 0.06, end - 0.06, end - 0.02],
    [0, 0.15, 0.15, 0]
  );

  return (
    <>
      {/* Image layer */}
      <motion.div
        className="absolute inset-0"
        style={{
          clipPath,
          zIndex: index + 1,
        }}
      >
        <motion.div className="w-full h-full" style={{ scale }}>
          <Image
            src={stage.image}
            alt={stage.label}
            fill
            className="object-cover"
            sizes="100vw"
            priority={index < 2}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </motion.div>

      {/* Large stage number watermark */}
      <motion.span
        className="absolute text-[20vw] font-bold text-white pointer-events-none select-none"
        style={{
          opacity: numberOpacity,
          zIndex: index + STAGE_COUNT + 1,
          top: "20%",
          ...(stage.side === "left" ? { right: "8%" } : { left: "8%" }),
          fontFamily: "var(--font-playfair), Georgia, serif",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </motion.span>

      {/* Product callout annotation */}
      <motion.div
        className="absolute z-30 w-[320px] sm:w-[380px] max-w-[85vw]"
        style={{
          opacity: calloutOpacity,
          x: calloutX,
          y: calloutY,
          ...stage.position,
        }}
      >
        <div className="relative">
          {/* Accent line */}
          <div
            className={`absolute top-0 ${
              stage.side === "left" ? "left-0" : "right-0"
            } w-10 h-[2px] bg-wheat`}
          />
          <div className="pt-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-wheat/80 font-medium">
              Stage {String(index + 1).padStart(2, "0")}
            </span>
            <h3
              className="mt-2 text-xl sm:text-2xl text-white font-normal"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {stage.label}
            </h3>
            <p className="mt-3 text-sm text-white/70 leading-relaxed">
              {stage.description}
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main section — sticky viewport with stacked image layers          */
/* ------------------------------------------------------------------ */

export function PlantGrowth() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Progress bar at top
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Scroll indicator opacity — fade out after first scroll
  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: `${STAGE_COUNT * 100}vh` }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Progress bar */}
        <motion.div
          className="absolute top-0 left-0 h-[2px] bg-wheat/60 z-40"
          style={{ width: progressWidth }}
        />

        {/* Stacked image layers + callouts */}
        {stages.map((stage, i) => (
          <GrowthStage
            key={stage.label}
            stage={stage}
            index={i}
            scrollProgress={scrollYProgress}
          />
        ))}

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 text-center"
          style={{ opacity: hintOpacity }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">
              Scroll to grow
            </span>
            <motion.div
              className="w-[1px] h-6 bg-white/30"
              animate={{ scaleY: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
