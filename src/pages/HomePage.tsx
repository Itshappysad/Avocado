/**
 * Página de inicio (ruta "/"): portada y carruseles por categoría y material.
 */
import { Hero } from "../components/Hero";
import { ProductCarousel } from "../components/ProductCarousel";

/**
 * Inicio. Cada ProductCarousel se oculta solo si no tiene productos, así que
 * se pueden agregar secciones nuevas sin miedo a que se vean vacías.
 */
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
