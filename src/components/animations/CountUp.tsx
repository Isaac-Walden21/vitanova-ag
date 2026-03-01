"use client";

import { useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useCallback } from "react";

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  className?: string;
  separator?: string;
  suffix?: string;
}

export default function CountUp({
  to,
  from = 0,
  duration = 2,
  className = "",
  separator = ",",
  suffix = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(from);

  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);

  const springValue = useSpring(motionValue, { damping, stiffness });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const formatValue = useCallback(
    (latest: number) => {
      const rounded = Math.round(latest);
      const formatted = new Intl.NumberFormat("en-US", {
        useGrouping: !!separator,
      }).format(rounded);
      return separator
        ? formatted.replace(/,/g, separator) + suffix
        : formatted + suffix;
    },
    [separator, suffix]
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = formatValue(from);
    }
  }, [from, formatValue]);

  useEffect(() => {
    if (isInView) {
      motionValue.set(to);
    }
  }, [isInView, motionValue, to]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = formatValue(latest);
      }
    });
    return () => unsubscribe();
  }, [springValue, formatValue]);

  return <span className={className} ref={ref} />;
}
