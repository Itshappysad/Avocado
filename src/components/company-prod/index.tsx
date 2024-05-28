import { Product } from "../../core/types";
import { ProductImage } from "../product-img";
import { Card, CardDescription, CardTitle } from "../ui/card";
import CompanyProdDialog from "./dialog";

function CompanyProd({ product }: { product: Product }) {
  const { id, name, price } = product;

  return (
    <CompanyProdDialog product={product}>
      <Card className="flex flex-col justify-center items-center p-4">
        <ProductImage className="size-52" id={id} name={name} />
        <CardTitle>{name}</CardTitle>
        <CardDescription>Precio: {price}</CardDescription>
      </Card>
    </CompanyProdDialog>
  );
}

export default CompanyProd;
