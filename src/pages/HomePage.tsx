import { Hero } from "../components/Hero";
import { ProductCarousel } from "../components/ProductCarousel";

export default function HomePage() {
  return (
    <div className="space-y-16">
      <Hero />
      <ProductCarousel title="Camisas" category="Camisa" />
      <ProductCarousel title="Pantalones" category="Pantalon" />
      <ProductCarousel title="Prendas de seda" material="seda" />
      <ProductCarousel title="Prendas de poliéster" material="poliester" />
      <ProductCarousel title="Prendas de algodón" material="algodon" />
    </div>
  );
}
