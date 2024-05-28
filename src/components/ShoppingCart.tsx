import { Offcanvas, Stack } from "react-bootstrap";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { formatCurrency } from "../utilities/formatCurrency";
import { CartItem } from "./CartItem";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import type { Item } from "../core/types";
import { useEffect, useState } from "react";
import { getCartItems } from "../core/database";

type ShoppingCartProps = {
  isOpen: boolean;
};

export function ShoppingCart({ isOpen }: ShoppingCartProps) {
  const { closeCart, cartItems } = useShoppingCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    const run = async () => {
      const prods = await getCartItems();
      setItems(prods);
    };
    run();
  }, [cartItems]);

  return (
    <Offcanvas show={isOpen} onHide={closeCart} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Carro de compras</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="d-flex justify-content-between align-items-center mt-2 border-top pt-1"></div>
        <Stack gap={3}>
          {items &&
            cartItems.map((item) => {
              const prod = items.find((i) => i.id === item.id);

              if (prod) {
                return (
                  <CartItem
                    key={item.id}
                    quantity={item.quantity}
                    item={prod}
                  />
                );
              }
            })}

          <div className="ms-auto fw-bold fs-5">
            Total{" "}
            {items &&
              formatCurrency(
                cartItems.reduce((total, cartItem) => {
                  const item = items.find((i) => i.id === cartItem.id);
                  return total + (item?.price || 0) * cartItem.quantity;
                }, 0),
              )}
          </div>
          <div className="flex justify-center mt-8">
            <button
              onClick={() => {
                if (!user) {
                  navigate("/signUp");
                }
                navigate("/payment");
                //TODO: Do the payment
              }}
              className="
               py-2 px-3 bg-blue-600 font-bold rounded-x1 text-white transition-transform 
                hover:bg-blue-500
                active:scale-85 
                absolute inset-x-0 bottom-0 h16 
              "
            >
              Pagar
            </button>
          </div>
        </Stack>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
