/**
 * Finalizar compra (ruta "/checkout", requiere sesión).
 */
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { purchase } from "../core/database";
import type { PaymentValues } from "../schemas/payment";
import { OrderSummary } from "../components/checkout/OrderSummary";
import { PaymentForm } from "../components/checkout/PaymentForm";
import { Button } from "../components/ui/button";
import { EmptyState } from "../components/ui/empty-state";
import { PageHeader } from "../components/ui/page-header";

function formatAddress(v: PaymentValues) {
  return [
    v.direccion,
    v.detalles_direccion,
    `${v.ciudad}, ${v.departamento}`,
    v.codigo_postal,
  ]
    .filter(Boolean)
    .join(" · ");
}

/**
 * Checkout: formulario de entrega a la izquierda y resumen a la derecha.
 * Al confirmar llama a `purchase()`, que crea los pedidos y vacía el carrito,
 * y luego lleva al historial de compras.
 */
export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, subtotal } = useCart();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (!user) return null; // La ruta está protegida por <RequireAuth>.

  if (items.length === 0) {
    return (
      <EmptyState
        className="my-16"
        icon={<ShoppingBag className="size-10" />}
        title="No hay productos en tu carrito"
        action={
          <Button asChild>
            <Link to="/store">Ir a la tienda</Link>
          </Button>
        }
      />
    );
  }

  const handleSubmit = async (values: PaymentValues) => {
    const toastId = toast.loading("Realizando pedido...");
    try {
      await purchase({
        userId: user.id,
        items,
        address: formatAddress(values),
      });
      await queryClient.invalidateQueries({ queryKey: ["purchases"] });
      toast.success("¡Pedido realizado!", { id: toastId });
      navigate("/account/history");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo realizar el pedido",
        { id: toastId },
      );
    }
  };

  const [firstName, ...lastNames] = user.name.split(" ");

  return (
    <>
      <PageHeader title="Finalizar compra" />
      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        <PaymentForm
          onSubmit={handleSubmit}
          defaultValues={{
            email: user.email,
            nombre: firstName,
            apellidos: lastNames.join(" "),
            direccion: user.address ?? "",
            codigo_postal: user.postalcode?.toString() ?? "",
          }}
        />
        <OrderSummary items={items} subtotal={subtotal} />
      </div>
    </>
  );
}
