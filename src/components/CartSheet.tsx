/**
 * Panel lateral del carrito de compras.
 */
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../core/utils";
import { CartLine } from "./CartLine";
import { Button } from "./ui/button";
import { EmptyState } from "./ui/empty-state";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";

/**
 * Panel lateral del carrito. Se abre desde el botón del carrito del navbar
 * (su estado abierto/cerrado vive en CartContext) y permite cambiar
 * cantidades, eliminar líneas e ir a pagar.
 */
export function CartSheet() {
  const { items, subtotal, isOpen, setOpen, increase, decrease, remove } =
    useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Carrito de compras</SheetTitle>
          <SheetDescription className="sr-only">
            Productos que has agregado al carrito
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<ShoppingBag className="size-10" />}
              title="Tu carrito está vacío"
              description="Explora la tienda y agrega las prendas que te gusten."
              action={
                <Button
                  asChild
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  <Link to="/store">Ver productos</Link>
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {items.map((item) => (
                <CartLine
                  key={item.id}
                  item={item}
                  actions={
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-7"
                        aria-label="Quitar una unidad"
                        onClick={() => decrease(item.id)}
                      >
                        <Minus className="size-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-7"
                        aria-label="Agregar una unidad"
                        onClick={() => increase(item.id)}
                      >
                        <Plus className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-red-600 hover:text-red-700"
                        aria-label="Eliminar del carrito"
                        onClick={() => remove(item.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  }
                />
              ))}
            </div>

            <div className="space-y-4 border-t p-6">
              <div className="flex justify-between text-lg font-bold">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <Button asChild size="lg" className="w-full">
                <Link to="/checkout" onClick={() => setOpen(false)}>
                  Ir a pagar
                </Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
