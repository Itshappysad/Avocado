/**
 * Pedidos (ruta "/company/orders"): pedidos recibidos y cambio de estado.
 */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { ORDER_STATES } from "../../core/constants";
import { getCompanyOrders, updateOrderState } from "../../core/database";
import type { CompanyOrder, OrderState } from "../../core/types";
import { useMyCompany } from "../../hooks/useMyCompany";
import { OrderCard } from "../../components/OrderCard";
import { EmptyState } from "../../components/ui/empty-state";
import { NativeSelect } from "../../components/ui/native-select";
import { PageHeader } from "../../components/ui/page-header";
import { PageLoader } from "../../components/ui/spinner";

/**
 * Pedidos recibidos por la empresa. Cambiar el selector de estado actualiza
 * el pedido y la compra del cliente al mismo tiempo.
 */
export default function CompanyOrdersPage() {
  const { data: company } = useMyCompany();
  const queryClient = useQueryClient();
  const queryKey = ["orders", company?.id];

  const { data: orders, isLoading } = useQuery({
    queryKey,
    queryFn: () => getCompanyOrders(company!.id),
    enabled: !!company,
  });

  const changeState = async (order: CompanyOrder, state: OrderState) => {
    if (!company) return;
    try {
      await updateOrderState({ companyId: company.id, order, state });
      await queryClient.invalidateQueries({ queryKey });
      toast.success("Estado del pedido actualizado");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo actualizar el pedido");
    }
  };

  return (
    <>
      <PageHeader
        title="Pedidos"
        description="Actualiza el estado de los pedidos de tus clientes"
      />
      {isLoading ? (
        <PageLoader />
      ) : !orders?.length ? (
        <EmptyState
          icon={<ClipboardList className="size-10" />}
          title="Aún no tienes pedidos"
        />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              orderedAt={order.orderedAt}
              items={order.items}
              address={order.address}
              status={
                <label className="flex items-center gap-2 font-semibold">
                  Estado:
                  <NativeSelect
                    className="w-40"
                    defaultValue={order.state}
                    onChange={(e) =>
                      changeState(order, e.target.value as OrderState)
                    }
                  >
                    {ORDER_STATES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </NativeSelect>
                </label>
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
