import { Button, Stack } from "react-bootstrap";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { formatCurrency } from "../utilities/formatCurrency";
import type { Item, ItemData } from "../core/types";
import { useEffect, useState } from "react";
import { getProductImage } from "../core/storage";
import { getProductById } from "../core/database";
import LoadingIcon from "./icons/loading";

type CartItemProps = {
  quantity: number;
  item: Item;
};

export function CartItem({ item, quantity }: CartItemProps) {
  const { removeFromCart } = useShoppingCart();

  const [image, setImage] = useState<string | null>(null);
  const [productInfo, setProductInfo] = useState<ItemData | null>(null);

  useEffect(() => {
    const run = async () => {
      const itemProd = await getProductById(item.productId);

      if (!itemProd) return;

      const img = await getProductImage(itemProd.id);

      setProductInfo({ ...item, ...itemProd, itemId: item.productId });
      setImage(img);
    };

    run();
  }, []);

  return productInfo ? (
    <Stack direction="horizontal" gap={2} className="d-flex align-items-center">
      <img
        src={image ?? undefined}
        alt="product"
        style={{ width: "125px", height: "75px", objectFit: "cover" }}
      />
      <div className="me-auto">
        <div>
          {productInfo.name}{" "}
          {quantity > 1 && (
            <span className="text-muted" style={{ fontSize: ".65rem" }}>
              x{quantity}
            </span>
          )}
        </div>
        <div className="text-muted" style={{ fontSize: ".75rem" }}>
          {formatCurrency(productInfo.price)}
        </div>
      </div>
      <div> {formatCurrency(productInfo.price * quantity)}</div>
      <Button
        variant="outline-danger"
        size="sm"
        onClick={() => removeFromCart(productInfo.itemId)}
      >
        &times;
      </Button>
    </Stack>
  ) : (
    <LoadingIcon className="text-2xl" />
  );
}
