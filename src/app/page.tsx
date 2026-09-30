import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import Bestsellers from "@/components/home/Bestsellers";
import EditorialSection from "@/components/home/EditorialSection";
import ShopByConcern from "@/components/home/ShopByConcern";
import CustomerReviewsSection from "@/components/home/CustomerReviewsSection";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <CategoryGrid />
      <Bestsellers />
      <EditorialSection />
      <ShopByConcern />
      <CustomerReviewsSection />
    </div>
  );
}
