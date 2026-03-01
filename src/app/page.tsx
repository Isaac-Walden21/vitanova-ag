import { Hero } from "@/components/sections/Hero";
import { StatsBar } from "@/components/sections/StatsBar";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { PlantGrowth } from "@/components/sections/PlantGrowth";
import { FloatingInterstitial } from "@/components/sections/FloatingInterstitial";
import { Mission } from "@/components/sections/Mission";
import { RibbonCta } from "@/components/sections/RibbonCta";

export default function Page() {
  return (
    <>
      <Hero />
      <StatsBar />
      <ProductGrid />
      <PlantGrowth />
      <FloatingInterstitial />
      <Mission />
      <RibbonCta />
    </>
  );
}
