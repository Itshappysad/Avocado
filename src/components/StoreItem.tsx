import { Card } from "react-bootstrap";
import { formatCurrency } from "../utilities/formatCurrency";
import { Product } from "../core/types";
import StoreDialog from "./StoreDialog";
import { ProductImage } from "./product-img";

type StoreItemProps = {
  product: Product;
};

export function StoreItem({ product }: StoreItemProps) {
  const { name, price, id } = product;

  return (
    <StoreDialog product={product}>
      <Card className="d-flex flex-column align-items-center">
        <ProductImage id={id} name={name} className="size-[450px]" />
        <Card.Body className="d-flex flex-column">
          <Card.Title className="d-flex flex-column align-items-baseline mb-4">
            <span className="ms-3">{name}</span>
            <span className="ms-2 text-muted">{formatCurrency(price)}</span>
          </Card.Title>
        </Card.Body>
      </Card>
    </StoreDialog>
  );
}
