import { useMemo } from "react";
import FormPayment from "../components/FormPayment/FormPayment";
import ResumnPay from "../components/ResumnPay";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { useAuth } from "../context/useAuth";
import { purchase } from "../core/database";

const Payment = () => {
  const { cartItems } = useShoppingCart();

  const { user } = useAuth();

  const subTotal = useMemo(() => {
    return cartItems.reduce((total, cartItem) => {
      return total + cartItem.price * cartItem.quantity;
    }, 0);
  }, [cartItems]);

  return (
    <div className="w-full h-[100vh]">
      <div className="row">
        <div className="col-6">
          <FormPayment
            handlePay={async (values) => {
              if (!user) {
                return {
                  success: false,
                };
              }

              const success = await purchase({
                address: values.direccion,
                items: cartItems,
                userId: user.id,
              });

              return {
                success,
              };
            }}
          />
        </div>
        <div className="col-6">
          <ResumnPay items={cartItems} paymentData={{ subTotal }} />
        </div>
      </div>
    </div>
  );
};

export default Payment;
