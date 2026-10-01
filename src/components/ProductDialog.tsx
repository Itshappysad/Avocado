/**
 * Diálogo de detalle de un producto: elegir talla y color y agregar al carrito.
 */
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { MATERIAL_OPTIONS } from "../core/constants";
import { cn, formatCurrency, isLightColor } from "../core/utils";
import type { Product } from "../core/types";
import { ProductImage } from "./ProductImage";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type ProductDialogProps = {
  product: Product;
  /** Elemento que abre el diálogo (normalmente un ProductCard). */
  children: React.ReactNode;
};

/** Detalle del producto: elegir talla y color y agregar al carrito. */
export function ProductDialog({ product, children }: ProductDialogProps) {
  const { add, getProductQuantity, setOpen: setCartOpen } = useCart();
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const inCart = getProductQuantity(product.id);
  const material =
    MATERIAL_OPTIONS.find((m) => m.value === product.materials)?.label ??
    product.materials;

  const handleAdd = async () => {
    if (!size) return toast.error("Selecciona una talla");
    if (!color) return toast.error("Selecciona un color");

    setIsAdding(true);
    await add({
      productId: product.id,
      price: product.price,
      sizes: [size],
      colors: [color],
    });
    setIsAdding(false);
    toast.success(`${product.name} agregado al carrito`, {
      action: { label: "Ver carrito", onClick: () => setCartOpen(true) },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90dvh] max-w-4xl overflow-y-auto p-0 sm:grid-cols-2">
        <ProductImage
          productId={product.id}
          name={product.name}
          className="sm:h-full sm:rounded-l-lg"
        />

        <div className="flex flex-col gap-6 p-6">
          <div>
            <DialogTitle className="text-3xl">{product.name}</DialogTitle>
            <DialogDescription className="mt-1">
              Material: {material}
            </DialogDescription>
            <p className="mt-4 text-2xl font-bold">
              {formatCurrency(product.price)}
            </p>
          </div>

          <fieldset>
            <legend className="mb-2 font-semibold">Talla</legend>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={size === s}
                  onClick={() => setSize(s)}
                  className={cn(
                    "min-w-12 rounded-md border px-3 py-2 font-semibold transition",
                    size === s
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "hover:border-neutral-900",
                  )}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 font-semibold">Color</legend>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Color ${c}`}
                  aria-pressed={color === c}
                  onClick={() => setColor(c)}
                  className={cn(
                    "grid size-10 place-items-center rounded-full border-2 transition",
                    color === c
                      ? "border-neutral-900 ring-2 ring-neutral-900 ring-offset-2"
                      : "border-neutral-200",
                  )}
                  style={{ backgroundColor: c }}
                >
                  {color === c && (
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        isLightColor(c) ? "bg-black" : "bg-white",
                      )}
                    />
                  )}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-auto space-y-2">
            <Button
              size="lg"
              className="w-full"
              onClick={handleAdd}
              disabled={isAdding}
            >
              <ShoppingBag className="mr-2 size-4" />
              Agregar al carrito
            </Button>
            {inCart > 0 && (
              <p className="text-center text-sm text-neutral-500">
                Ya tienes {inCart} en el carrito
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
