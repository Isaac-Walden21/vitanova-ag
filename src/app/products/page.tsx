import { productCategories, brand } from "@/content/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Products — ${brand.name}`,
  description: "Seed, fertilizer, crop protection, and soil health products for every operation.",
};

export default function ProductsPage() {
  return (
    <div className="pt-24">
      {/* Header */}
      <section className="section-shell section-cream">
        <div className="grid-narrow text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-sage font-medium">
            Product Catalog
          </span>
          <h1
            className="mt-5 text-display text-soil"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            Built for your ground.
          </h1>
          <p className="mt-5 text-base text-stone leading-relaxed sm:text-lg">
            Every product we carry has been vetted by our agronomy team. If it
            doesn&apos;t perform, we don&apos;t sell it.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="section-shell section-white">
        <div className="grid-shell">
          <div className="grid gap-12">
            {productCategories.map((cat) => (
              <div
                key={cat.title}
                id={cat.icon}
                className="scroll-mt-24 border-t border-border pt-10"
              >
                <h2 className="text-2xl font-medium text-soil tracking-tight">
                  {cat.title}
                </h2>
                <p className="mt-3 max-w-2xl text-base text-stone leading-relaxed">
                  {cat.description}
                </p>
                <p className="mt-6 text-sm text-sage font-medium">
                  Contact us for current availability and pricing &rarr;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
