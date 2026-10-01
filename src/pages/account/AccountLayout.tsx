/**
 * Layout del panel "Mi cuenta" (ruta "/account").
 */
import { History, UserRound } from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

/** Menú lateral de "Mi cuenta": perfil e historial de compras. */
export default function AccountLayout() {
  return (
    <DashboardLayout
      title="Mi cuenta"
      links={[
        {
          to: "/account/edit",
          label: "Mi perfil",
          icon: <UserRound className="size-4" />,
        },
        {
          to: "/account/history",
          label: "Mis compras",
          icon: <History className="size-4" />,
        },
      ]}
    />
  );
}
