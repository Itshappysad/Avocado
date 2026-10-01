/**
 * Resumen del pedido en el checkout (productos, subtotal, envío y total).
 */
import { SHIPPING_COST } from "../../core/constants";
import { formatCurrency } from "../../core/utils";
import type { CartItem } from "../../core/types";
import { CartLine } from "../CartLine";

type OrderSummaryProps = {
  /** Líneas del carrito. */
  items: CartItem[];
  /** Suma de los productos sin envío. */
  subtotal: number;
};

/**
 * Columna derecha del checkout: productos, subtotal, envío (SHIPPING_COST) y
 * total. En pantallas grandes queda fija al hacer scroll.
 */
export function OrderSummary({ items, subtotal }: OrderSummaryProps) {
  return (
    <aside className="h-fit space-y-6 rounded-2xl bg-neutral-100 p-6 lg:sticky lg:top-24">
      <h2 className="text-xl font-bold">Resumen del pedido</h2>

      <div className="space-y-4">
        {items.map((item) => (
          <CartLine key={item.id} item={item} />
        ))}
      </div>

      <dl className="space-y-2 border-t border-neutral-300 pt-4">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd className="font-semibold">{formatCurrency(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Envío</dt>
          <dd className="font-semibold">{formatCurrency(SHIPPING_COST)}</dd>
        </div>
        <div className="flex justify-between pt-2 text-lg font-bold">
          <dt>Total</dt>
          <dd>{formatCurrency(subtotal + SHIPPING_COST)}</dd>
        </div>
      </dl>
    </aside>
  );
}
