import HeroBanner from "@/components/storefront/HeroBanner";
import CategorySection from "@/components/storefront/CategorySection";
import ProductSection from "@/components/storefront/ProductSection";
import PromotionalBanner from "@/components/storefront/PromotionalBanner";
import FeaturedProducts from "@/components/storefront/FeaturedProducts";
import BenefitsSection from "@/components/storefront/BenefitsSection";

export default function HomePage() {
  return (
    <div>
      <HeroBanner />
      <CategorySection />
      <ProductSection />
      <PromotionalBanner />
      <FeaturedProducts />
      <BenefitsSection />
    </div>
  );
}
