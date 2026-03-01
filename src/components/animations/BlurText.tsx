"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "characters";
  direction?: "top" | "bottom";
  threshold?: number;
}

const BlurText = ({
  text = "",
  delay = 100,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
}: BlurTextProps) => {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current!);
        }
      },
      { threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  const from = useMemo(
    () =>
      direction === "top"
        ? { filter: "blur(10px)", opacity: 0, y: -30 }
        : { filter: "blur(10px)", opacity: 0, y: 30 },
    [direction]
  );

  return (
    <p
      ref={ref}
      className={className}
      style={{ display: "flex", flexWrap: "wrap" }}
    >
      {elements.map((segment, index) => (
        <motion.span
          className="inline-block will-change-[transform,filter,opacity]"
          key={index}
          initial={from}
          animate={
            inView
              ? {
                  filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
                  opacity: [0, 0.5, 1],
                  y: [from.y, direction === "top" ? 5 : -5, 0],
                }
              : from
          }
          transition={{
            duration: 0.6,
            delay: (index * delay) / 1000,
          }}
        >
          {segment === " " ? "\u00A0" : segment}
          {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </p>
  );
};

export default BlurText;
