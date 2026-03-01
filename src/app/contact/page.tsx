import { brand } from "@/content/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Contact — ${brand.name}`,
  description: "Get in touch with the VitaNova agronomy team.",
};

export default function ContactPage() {
  return (
    <div className="pt-24">
      <section className="section-shell section-cream">
        <div className="grid-narrow text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-sage font-medium">
            Contact
          </span>
          <h1
            className="mt-5 text-display text-soil"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            Let&apos;s talk about your operation.
          </h1>
          <p className="mt-5 text-base text-stone leading-relaxed sm:text-lg">
            Whether you need a full crop plan or just have a quick question —
            we&apos;re here.
          </p>
        </div>
      </section>

      <section className="section-shell section-white">
        <div className="grid-shell">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Contact form */}
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-soil mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-border bg-cream px-4 py-3 text-sm text-soil placeholder:text-stone/50 focus:outline-none focus:ring-2 focus:ring-sage/40"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-soil mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-border bg-cream px-4 py-3 text-sm text-soil placeholder:text-stone/50 focus:outline-none focus:ring-2 focus:ring-sage/40"
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-soil mb-2">
                  How can we help?
                </label>
                <textarea
                  rows={5}
                  className="w-full rounded-lg border border-border bg-cream px-4 py-3 text-sm text-soil placeholder:text-stone/50 focus:outline-none focus:ring-2 focus:ring-sage/40 resize-none"
                  placeholder="Tell us about your operation, what you're looking for, or any questions..."
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-forest px-8 py-3 text-sm font-medium text-cream transition-all duration-300 hover:bg-forest/90 hover:scale-[1.02]"
              >
                Send Message
              </button>
            </form>

            {/* Contact info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-medium text-soil uppercase tracking-[0.15em] mb-3">
                  Email
                </h3>
                <p className="text-base text-stone">info@vitanova.ag</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-soil uppercase tracking-[0.15em] mb-3">
                  Office Hours
                </h3>
                <p className="text-base text-stone">
                  Monday – Friday, 7:00 AM – 5:00 PM
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-soil uppercase tracking-[0.15em] mb-3">
                  Season Hours
                </h3>
                <p className="text-base text-stone">
                  During planting and application season, we&apos;re available
                  7 days a week.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
