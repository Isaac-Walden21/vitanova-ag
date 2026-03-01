import { Hero } from "@/components/sections/Hero";
import { StatsBar } from "@/components/sections/StatsBar";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { Mission } from "@/components/sections/Mission";
import { CtaBlock } from "@/components/sections/CtaBlock";

export default function Page() {
  return (
    <>
      <Hero />
      <StatsBar />
      <ProductGrid />
      <Mission />
      <CtaBlock />
    </>
  );
}
