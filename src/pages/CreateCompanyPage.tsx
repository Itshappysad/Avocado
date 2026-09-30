import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { createCompany } from "../core/database";
import { useMyCompany } from "../hooks/useMyCompany";
import { CompanyForm } from "../components/CompanyForm";
import { PageHeader } from "../components/ui/page-header";
import { PageLoader } from "../components/ui/spinner";

export default function CreateCompanyPage() {
  const { user } = useAuth();
  const { data: company, isLoading } = useMyCompany();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // Evita que el redireccionamiento de abajo gane al que se hace al crearla.
  const [justCreated, setJustCreated] = useState(false);

  if (isLoading) return <PageLoader />;
  // Si el usuario ya tenía empresa, no tiene sentido crear otra.
  if (company && !justCreated) return <Navigate to="/company" replace />;

  return (
    <>
      <PageHeader
        title="Crea tu empresa"
        description="Registra tu marca para poder publicar productos en la tienda."
      />
      <CompanyForm
        submitLabel="Crear empresa"
        defaultValues={{
          address: user?.address ?? "",
          email: user?.email ?? "",
          postalcode: user?.postalcode ?? undefined,
        }}
        onSubmit={async (values) => {
          try {
            await createCompany(user!.id, values);
            setJustCreated(true);
            await queryClient.invalidateQueries({ queryKey: ["company"] });
            toast.success("¡Empresa creada!");
            navigate("/company/add-product");
          } catch (error) {
            console.error(error);
            toast.error(
              error instanceof Error
                ? error.message
                : "No se pudo crear la empresa",
            );
          }
        }}
      />
    </>
  );
}
