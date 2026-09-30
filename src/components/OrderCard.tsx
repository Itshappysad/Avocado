import { ORDER_STATES } from "../core/constants";
import { cn, formatCurrency } from "../core/utils";
import type { CartItem, OrderState } from "../core/types";
import { CartLine } from "./CartLine";

const stateStyles: Record<OrderState, string> = {
  pendiente: "bg-amber-100 text-amber-800",
  enviado: "bg-sky-100 text-sky-800",
  recibido: "bg-brand-100 text-brand-800",
};

export function OrderStateBadge({ state }: { state: OrderState }) {
  const label = ORDER_STATES.find((s) => s.value === state)?.label ?? state;
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-sm font-semibold",
        stateStyles[state] ?? "bg-neutral-100",
      )}
    >
      {label}
    </span>
  );
}

type OrderCardProps = {
  orderedAt: Date;
  items: CartItem[];
  address: string;
  /** Normalmente el estado del pedido (un badge o un selector). */
  status: React.ReactNode;
};

/** Tarjeta de un pedido, usada en el historial del cliente y en la empresa. */
export function OrderCard({
  orderedAt,
  items,
  address,
  status,
}: OrderCardProps) {
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <article className="rounded-2xl border bg-white p-5 shadow-sm">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div>
          <p className="text-lg font-bold">
            {orderedAt.toLocaleDateString("es-CO", {
              dateStyle: "long",
            })}
          </p>
          <p className="text-sm text-neutral-500">Envío a: {address}</p>
        </div>
        {status}
      </header>
      <div className="space-y-4">
        {items.map((item) => (
          <CartLine key={item.id} item={item} />
        ))}
      </div>
      <p className="mt-4 border-t pt-4 text-right font-bold">
        Total productos: {formatCurrency(total)}
      </p>
    </article>
  );
}
