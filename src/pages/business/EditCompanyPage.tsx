/**
 * Datos de la empresa (ruta "/company/edit").
 */
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateCompany } from "../../core/database";
import { useMyCompany } from "../../hooks/useMyCompany";
import { CompanyForm } from "../../components/CompanyForm";
import { PageHeader } from "../../components/ui/page-header";

/** Formulario con los datos de la empresa precargados para editarlos. */
export default function EditCompanyPage() {
  const { data: company } = useMyCompany();
  const queryClient = useQueryClient();

  if (!company) return null; // BusinessLayout ya garantiza que existe.

  return (
    <>
      <PageHeader
        title="Datos de la empresa"
        description="Modifica la información con la que se identifica tu empresa"
      />
      <CompanyForm
        submitLabel="Guardar cambios"
        defaultValues={company}
        onSubmit={async (data) => {
          try {
            await updateCompany(company.id, data);
            await queryClient.invalidateQueries({ queryKey: ["company"] });
            toast.success("Información actualizada");
          } catch (error) {
            console.error(error);
            toast.error("No se pudo actualizar la empresa");
          }
        }}
      />
    </>
  );
}
