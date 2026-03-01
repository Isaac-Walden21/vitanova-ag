import { brand, mission, values } from "@/content/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `About — ${brand.name}`,
  description: brand.description,
};

export default function AboutPage() {
  return (
    <div className="pt-24">
      {/* Header */}
      <section className="section-shell section-cream">
        <div className="grid-narrow text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-sage font-medium">
            About Us
          </span>
          <h1
            className="mt-5 text-display text-soil"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            {mission.headline}
          </h1>
          <p className="mt-6 text-base text-stone leading-[1.8] sm:text-lg">
            {mission.body}
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="section-shell section-white">
        <div className="grid-shell">
          <div className="grid-narrow">
            <h2
              className="text-center text-2xl text-soil mb-12"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              What we stand for
            </h2>
            {values.map((value, i) => (
              <div
                key={value.title}
                className="flex gap-6 py-8 border-t border-border first:border-t-0"
              >
                <span className="text-2xl font-light text-sage/40 tabular-nums shrink-0 w-8">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-medium text-soil tracking-tight">
                    {value.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-stone leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
