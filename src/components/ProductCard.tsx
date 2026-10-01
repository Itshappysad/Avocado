/**
 * Tarjeta de producto para las grillas y carruseles.
 */
import { forwardRef } from "react";
import { formatCurrency } from "../core/utils";
import type { Product } from "../core/types";
import { ProductImage } from "./ProductImage";

type ProductCardProps = React.ComponentPropsWithoutRef<"button"> & {
  /** Producto a mostrar (imagen, nombre y precio). */
  product: Product;
};

/**
 * Tarjeta de producto. Es un botón (con forwardRef) para poder usarse como
 * disparador del diálogo de detalle.
 */
export const ProductCard = forwardRef<HTMLButtonElement, ProductCardProps>(
  function ProductCard({ product, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className="group flex w-full flex-col overflow-hidden rounded-xl border bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        {...props}
      >
        <ProductImage
          productId={product.id}
          name={product.name}
          className="transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="flex flex-col gap-0.5 p-4">
          <span className="truncate font-semibold">{product.name}</span>
          <span className="text-neutral-600">
            {formatCurrency(product.price)}
          </span>
        </div>
      </button>
    );
  },
);
