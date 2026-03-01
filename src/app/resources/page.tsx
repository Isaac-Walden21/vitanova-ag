import { brand } from "@/content/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Resources — ${brand.name}`,
  description: "Agronomic guides, seasonal tips, and field insights from the VitaNova team.",
};

const articles = [
  {
    title: "Understanding Your Soil Test Results",
    category: "Soil Health",
    excerpt: "How to read your soil test and turn the numbers into a real fertility plan.",
  },
  {
    title: "Pre-Emerge vs. Post-Emerge: When to Spray",
    category: "Crop Protection",
    excerpt: "Timing is everything. Here's how to decide which application window fits your fields.",
  },
  {
    title: "2026 Seed Selection Guide",
    category: "Seed",
    excerpt: "Our top-performing varieties for this season — based on local trial data.",
  },
  {
    title: "Building a Fertility Plan That Pays",
    category: "Fertilizer",
    excerpt: "How to balance yield goals with input costs and build a plan that pencils out.",
  },
];

export default function ResourcesPage() {
  return (
    <div className="pt-24">
      <section className="section-shell section-cream">
        <div className="grid-narrow text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-sage font-medium">
            Resources
          </span>
          <h1
            className="mt-5 text-display text-soil"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            Field-tested knowledge.
          </h1>
          <p className="mt-5 text-base text-stone leading-relaxed sm:text-lg">
            Guides, insights, and seasonal tips from our agronomy team.
          </p>
        </div>
      </section>

      <section className="section-shell section-white">
        <div className="grid-shell">
          <div className="grid gap-6 sm:grid-cols-2">
            {articles.map((article) => (
              <article
                key={article.title}
                className="group rounded-xl border border-border bg-cream/50 p-8 transition-all duration-300 hover:border-sage/40 cursor-pointer"
              >
                <span className="text-xs uppercase tracking-[0.2em] text-sage font-medium">
                  {article.category}
                </span>
                <h3 className="mt-3 text-xl font-medium text-soil tracking-tight group-hover:text-forest transition-colors">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-stone leading-relaxed">
                  {article.excerpt}
                </p>
                <span className="mt-4 inline-block text-xs text-sage font-medium uppercase tracking-[0.15em]">
                  Read More &rarr;
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
