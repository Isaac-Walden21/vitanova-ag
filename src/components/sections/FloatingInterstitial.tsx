"use client";

import dynamic from "next/dynamic";

const ScrollFloat = dynamic(() => import("@/components/animations/ScrollFloat"), {
  ssr: false,
});

export function FloatingInterstitial() {
  return (
    <section className="section-forest relative overflow-hidden">
      <div className="grid-shell flex items-center justify-center" style={{ paddingBlock: "clamp(2.5rem, 6vw, 4rem)" }}>
        <ScrollFloat
          className="text-center"
          textClassName="text-cream/90"
          animationDuration={1.2}
          ease="back.inOut(1.5)"
          scrollStart="top bottom"
          scrollEnd="center center"
          stagger={0.02}
        >
          Rooted in science.
        </ScrollFloat>
      </div>
    </section>
  );
}
