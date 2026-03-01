import { brand } from "@/content/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Team — ${brand.name}`,
  description: "Meet the agronomy and operations team behind VitaNova.",
};

const team = [
  {
    name: "Team Member",
    role: "Lead Agronomist",
    bio: "15+ years of experience in crop science and fertility management.",
  },
  {
    name: "Team Member",
    role: "Operations Manager",
    bio: "Ensures every order ships on time and every grower is taken care of.",
  },
  {
    name: "Team Member",
    role: "Sales & Support",
    bio: "Your first point of contact — here to make sure you get exactly what you need.",
  },
];

export default function TeamPage() {
  return (
    <div className="pt-24">
      <section className="section-shell section-cream">
        <div className="grid-narrow text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-sage font-medium">
            Our Team
          </span>
          <h1
            className="mt-5 text-display text-soil"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            People who know the dirt.
          </h1>
        </div>
      </section>

      <section className="section-shell section-white">
        <div className="grid-shell">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.role}
                className="rounded-xl border border-border bg-cream/50 p-8"
              >
                <div className="w-16 h-16 rounded-full bg-sage/20 mb-6" />
                <h3 className="text-lg font-medium text-soil">{member.name}</h3>
                <p className="text-sm text-sage font-medium">{member.role}</p>
                <p className="mt-3 text-sm text-stone leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
