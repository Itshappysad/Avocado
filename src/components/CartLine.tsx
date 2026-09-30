import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../core/database";
import { formatCurrency } from "../core/utils";
import type { CartItem } from "../core/types";
import { ProductImage } from "./ProductImage";

type CartLineProps = {
  item: CartItem;
  /** Controles extra (botones de cantidad, eliminar, etc.). */
  actions?: React.ReactNode;
};

/** Una línea de producto: usada en el carrito, el resumen de pago y los pedidos. */
export function CartLine({ item, actions }: CartLineProps) {
  const { data: product } = useQuery({
    queryKey: ["product", item.productId],
    queryFn: () => getProductById(item.productId),
    staleTime: 5 * 60 * 1000,
  });

  const sizes = item.sizes.join(", ");

  return (
    <div className="flex items-center gap-3 text-left">
      <ProductImage
        productId={item.productId}
        name={product?.name ?? "Producto"}
        className="size-16 shrink-0 rounded-md"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">
          {product?.name ?? "Producto no disponible"}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
          {sizes && <span>Talla {sizes}</span>}
          {item.colors.map((color) => (
            <span
              key={color}
              title={color}
              className="inline-block size-3.5 rounded-full border"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <p className="text-sm text-neutral-500">
          {item.quantity} × {formatCurrency(item.price)}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="font-semibold">
          {formatCurrency(item.price * item.quantity)}
        </span>
        {actions}
      </div>
    </div>
  );
}
