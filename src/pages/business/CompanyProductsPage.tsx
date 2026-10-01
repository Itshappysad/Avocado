/**
 * Mis productos (ruta "/company/products"): lista y edición de productos.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus, Shirt } from "lucide-react";
import { getCompanyProducts } from "../../core/database";
import type { Product } from "../../core/types";
import { useMyCompany } from "../../hooks/useMyCompany";
import { ProductCard } from "../../components/ProductCard";
import { ProductForm } from "../../components/ProductForm";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../components/ui/dialog";
import { EmptyState } from "../../components/ui/empty-state";
import { PageHeader } from "../../components/ui/page-header";
import { PageLoader } from "../../components/ui/spinner";

/**
 * Productos de la empresa. Al hacer clic en uno se abre un diálogo con el
 * formulario de edición.
 */
export default function CompanyProductsPage() {
  const { data: company } = useMyCompany();
  const [editing, setEditing] = useState<Product | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", "company", company?.id],
    queryFn: () => getCompanyProducts(company!.id),
    enabled: !!company,
  });

  return (
    <>
      <PageHeader
        title="Mis productos"
        description="Haz clic en un producto para editarlo"
      >
        <Button asChild>
          <Link to="/company/add-product">
            <Plus className="mr-2 size-4" />
            Añadir producto
          </Link>
        </Button>
      </PageHeader>

      {isLoading ? (
        <PageLoader />
      ) : !products?.length ? (
        <EmptyState
          icon={<Shirt className="size-10" />}
          title="Aún no tienes productos"
          description="Publica tu primera prenda para que aparezca en la tienda."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => setEditing(product)}
            />
          ))}
        </div>
      )}

      <Dialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent className="max-h-[90dvh] max-w-4xl overflow-y-auto">
          <DialogTitle>Editar producto</DialogTitle>
          <DialogDescription className="sr-only">
            Modifica los datos del producto
          </DialogDescription>
          {editing && company && (
            <ProductForm
              key={editing.id}
              companyId={company.id}
              product={editing}
              onSaved={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
