import { useState } from "react";
import { useShoppingCart } from "../context/ShoppingCartContext";
import type { Product } from "../core/types";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { toast } from "sonner";
import { cn } from "../core/utils";
import { formatCurrency } from "../utilities/formatCurrency";
import { ProductImage } from "./product-img";

type Props = React.ComponentPropsWithRef<typeof Dialog> & {
  product: Product;
};

function StoreDialog({
  children,
  product: { name, sizes, colors, id, price, materials },
  ...props
}: Props) {
  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
  } = useShoppingCart();
  const quantity = getItemQuantity(id);

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  return (
    <Dialog {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="h-[80dvh] w-[70dvw] max-w-[95dvw] flex z-[80]">
        <div className="p-4 flex flex-col items-center justify-center gap-3">
          <ProductImage id={id} name={name} className="aspect-square size-96" />
          <h1 className="text-4xl">{name}</h1>
          <h2 className="text-xl">Material: {materials}</h2>
        </div>
        <div className="flex-1 flex flex-col gap-4 justify-center">
          <p className="text-center text-2xl font-bold">
            Precio: {formatCurrency(price)}
          </p>
          <div className="flex gap-2 justify-center items-center">
            <strong className="text-xl">Tallas: </strong>
            <div className="flex gap-3">
              {sizes.map((s, i) => (
                <button
                  className={cn(
                    "p-1 bg-black w-20 text-white rounded-md shadow-sm hover:scale-105 ease-in-out transition-transform",
                    {
                      "bg-green-500": selectedSizes.some((si) => si === s),
                    },
                  )}
                  key={i}
                  onClick={() => {
                    const size = selectedSizes.find((si) => si === s);

                    if (size) {
                      return setSelectedSizes((prev) => {
                        const index = prev.indexOf(s);
                        return prev.toSpliced(index, 1);
                      });
                    }

                    setSelectedSizes((prev) => [...prev, s]);
                  }}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 justify-center items-center">
            <strong className="text-xl">Colores: </strong>
            <div className="flex gap-3">
              {colors.map((c, i) => {
                return (
                  <button
                    className={cn(
                      "p-1 bg-black text-white rounded-md shadow-sm hover:scale-105 ease-in-out transition-transform",
                      {
                        "bg-green-500": selectedColors.some((co) => co === c),
                      },
                    )}
                    key={i}
                    onClick={() => {
                      const color = selectedColors.find((co) => co === c);

                      if (color) {
                        return setSelectedColors((prev) => {
                          const index = prev.indexOf(c);
                          return prev.toSpliced(index, 1);
                        });
                      }

                      setSelectedColors((prev) => [...prev, c]);
                    }}
                  >
                    <div
                      className="size-10 rounded-sm"
                      style={{ backgroundColor: c }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-2 justify-center text-xl">
            {quantity === 0 ? (
              <Button
                className="border border-black rounded-md"
                variant="outline"
                onClick={async () => {
                  if (selectedSizes.length === 0) {
                    return toast.error("Selecciona al menos una talla");
                  }

                  if (selectedColors.length === 0) {
                    return toast.error("Selecciona al menos un color");
                  }

                  await increaseCartQuantity({
                    colors: selectedColors,
                    sizes: selectedSizes,
                    price,
                    productId: id,
                    quantity,
                  });
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M10 0v4H8l4 4l4-4h-2V0M1 2v2h2l3.6 7.6L5.2 14c-.1.3-.2.6-.2 1c0 1.1.9 2 2 2h12v-2H7.4c-.1 0-.2-.1-.2-.2v-.1l.9-1.7h7.4c.7 0 1.4-.4 1.7-1l3.9-7l-1.7-1l-3.9 7h-7L4.3 2M7 18c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m10 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2"
                  />
                </svg>{" "}
                Añadir al carrito
              </Button>
            ) : (
              <div
                className="d-flex align-items-center flex-column"
                style={{ gap: ".5rem" }}
              >
                <div
                  className="d-flex align-items-center justify-content-center "
                  style={{ gap: ".5rem" }}
                >
                  <Button onClick={() => decreaseCartQuantity(id)}>-</Button>
                  <div>
                    <span className="fs-3">{quantity}</span> en el carro
                  </div>
                  <Button
                    onClick={async () => {
                      await increaseCartQuantity({
                        colors: selectedColors,
                        sizes: selectedSizes,
                        price,
                        productId: id,
                        quantity,
                      });
                    }}
                  >
                    +
                  </Button>
                </div>

                <Button
                  onClick={() => removeFromCart(id)}
                  variant="destructive"
                  size="sm"
                >
                  {" "}
                  Remover
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default StoreDialog;
