/**
 * Añadir producto (ruta "/company/add-product").
 */
import { useNavigate } from "react-router-dom";
import { useMyCompany } from "../../hooks/useMyCompany";
import { ProductForm } from "../../components/ProductForm";
import { PageHeader } from "../../components/ui/page-header";

/** Formulario para publicar un producto; al guardar lleva a "Mis productos". */
export default function AddProductPage() {
  const { data: company } = useMyCompany();
  const navigate = useNavigate();

  if (!company) return null;

  return (
    <>
      <PageHeader
        title="Añadir producto"
        description="Publica una nueva prenda en la tienda"
      />
      <ProductForm
        companyId={company.id}
        onSaved={() => navigate("/company/products")}
      />
    </>
  );
}
