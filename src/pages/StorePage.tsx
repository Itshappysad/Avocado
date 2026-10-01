/**
 * Tienda (ruta "/store"): todos los productos con búsqueda y filtro por categoría.
 */
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Shirt } from "lucide-react";
import { getProducts } from "../core/database";
import { CATEGORY_OPTIONS } from "../core/constants";
import { cn } from "../core/utils";
import { ProductCard } from "../components/ProductCard";
import { ProductDialog } from "../components/ProductDialog";
import { EmptyState } from "../components/ui/empty-state";
import { Input } from "../components/ui/input";
import { PageHeader } from "../components/ui/page-header";
import { PageLoader } from "../components/ui/spinner";

/**
 * Catálogo completo. La búsqueda y el filtro se aplican en el navegador sobre
 * la lista ya cargada (useMemo), sin volver a consultar la base de datos.
 */
export default function StorePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", "all"],
    queryFn: getProducts,
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (products ?? []).filter(
      (p) =>
        (!term || p.name.toLowerCase().includes(term)) &&
        (!category || p.categories.includes(category)),
    );
  }, [products, search, category]);

  return (
    <>
      <PageHeader
        title="Tienda"
        description="Todas las prendas publicadas por nuestras marcas"
      />

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            aria-label="Buscar productos"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {[{ value: null, label: "Todas" }, ...CATEGORY_OPTIONS].map((c) => (
            <button
              key={c.label}
              type="button"
              aria-pressed={category === c.value}
              onClick={() => setCategory(c.value)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-semibold transition",
                category === c.value
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "hover:border-neutral-900",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : isError ? (
        <EmptyState
          title="No pudimos cargar los productos"
          description="Revisa tu conexión e intenta de nuevo."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Shirt className="size-10" />}
          title="No hay productos para mostrar"
          description={
            products?.length
              ? "Prueba con otra búsqueda o categoría."
              : "Aún no se ha publicado ningún producto."
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductDialog key={product.id} product={product}>
              <ProductCard product={product} />
            </ProductDialog>
          ))}
        </div>
      )}
    </>
  );
}
