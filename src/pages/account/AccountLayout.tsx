import { History, UserRound } from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

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
