/**
 * Layout del panel "Mi empresa" (ruta "/company").
 */
import { Navigate } from "react-router-dom";
import { ClipboardList, PackagePlus, Settings, Shirt } from "lucide-react";
import { useMyCompany } from "../../hooks/useMyCompany";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { PageLoader } from "../../components/ui/spinner";

/** Panel de la empresa. Si el usuario aún no tiene empresa, lo envía a crearla. */
export default function BusinessLayout() {
  const { data: company, isLoading } = useMyCompany();

  if (isLoading) return <PageLoader />;
  if (!company) return <Navigate to="/create-company" replace />;

  return (
    <DashboardLayout
      title={company.name}
      links={[
        {
          to: "/company/products",
          label: "Mis productos",
          icon: <Shirt className="size-4" />,
        },
        {
          to: "/company/add-product",
          label: "Añadir producto",
          icon: <PackagePlus className="size-4" />,
        },
        {
          to: "/company/orders",
          label: "Pedidos",
          icon: <ClipboardList className="size-4" />,
        },
        {
          to: "/company/edit",
          label: "Datos de la empresa",
          icon: <Settings className="size-4" />,
        },
      ]}
    />
  );
}
