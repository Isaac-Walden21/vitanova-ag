import Link from "next/link";
import { brand, nav, footer, productCategories } from "@/content/site";

export function Footer() {
  return (
    <footer className="section-soil">
      <div
        className="grid-shell"
        style={{ paddingBlock: "clamp(3rem, 8vw, 5rem)" }}
      >
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <p
              className="text-xl font-semibold text-cream tracking-tight"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {brand.name}
            </p>
            <p className="mt-3 text-sm text-cream/50 leading-relaxed">
              {footer.tagline}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-cream/30 mb-5">
              Navigation
            </p>
            <ul className="space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-cream/60 transition-colors duration-300 hover:text-cream"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-cream/30 mb-5">
              Products
            </p>
            <ul className="space-y-3">
              {productCategories.map((cat) => (
                <li key={cat.title}>
                  <Link
                    href={cat.href}
                    className="text-sm text-cream/60 transition-colors duration-300 hover:text-cream"
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-cream/30 mb-5">
              Contact
            </p>
            <p className="text-sm text-cream/60">{footer.email}</p>
            <Link
              href="/contact"
              className="mt-4 inline-block text-sm text-sage-light transition-colors duration-300 hover:text-cream"
            >
              Talk to Us &rarr;
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-6 border-t border-cream/10">
          <p className="text-xs text-cream/30">
            &copy; {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
