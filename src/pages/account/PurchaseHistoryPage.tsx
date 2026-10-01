/**
 * Mis compras (ruta "/account/history"): historial de pedidos del cliente.
 */
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getPurchaseHistory } from "../../core/database";
import { OrderCard, OrderStateBadge } from "../../components/OrderCard";
import { Button } from "../../components/ui/button";
import { EmptyState } from "../../components/ui/empty-state";
import { PageHeader } from "../../components/ui/page-header";
import { PageLoader } from "../../components/ui/spinner";

/** Lista de compras del cliente con el estado que les puso cada empresa. */
export default function PurchaseHistoryPage() {
  const { user } = useAuth();

  const {
    data: purchases,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["purchases", user?.id],
    queryFn: () => getPurchaseHistory(user!.id),
    enabled: !!user,
  });

  return (
    <>
      <PageHeader title="Mis compras" description="Historial de tus pedidos" />
      {isLoading ? (
        <PageLoader />
      ) : isError ? (
        <EmptyState title="No pudimos cargar tus compras" />
      ) : !purchases?.length ? (
        <EmptyState
          icon={<Package className="size-10" />}
          title="Aún no has hecho compras"
          action={
            <Button asChild>
              <Link to="/store">Ir a la tienda</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          {purchases.map((p) => (
            <OrderCard
              key={p.id}
              orderedAt={p.orderedAt}
              items={p.items}
              address={p.address}
              status={<OrderStateBadge state={p.state} />}
            />
          ))}
        </div>
      )}
    </>
  );
}
