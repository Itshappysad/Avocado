import { useStorageImage } from "../hooks/useStorageImage";
import { imagePaths } from "../core/storage";
import { Spinner } from "./ui/spinner";
import { cn } from "../core/utils";

/** Imagen por defecto cuando un producto no tiene foto. */
const PLACEHOLDER = "/imgs/placeholder-product.svg";

type ProductImageProps = {
  productId: string;
  name: string;
  className?: string;
};

/** Imagen de un producto con estado de carga y respaldo si no existe. */
export function ProductImage({
  productId,
  name,
  className,
}: ProductImageProps) {
  const { url, isLoading } = useStorageImage(imagePaths.product(productId));

  return (
    <div
      className={cn(
        "grid aspect-square w-full place-items-center overflow-hidden bg-neutral-100",
        className,
      )}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <img
          src={url ?? PLACEHOLDER}
          alt={url ? name : `${name} (sin imagen)`}
          loading="lazy"
          className="size-full object-cover"
          // Si la imagen no carga (enlace roto, sin internet), se usa la de respaldo.
          onError={(e) => {
            if (!e.currentTarget.src.endsWith(PLACEHOLDER)) {
              e.currentTarget.src = PLACEHOLDER;
            }
          }}
        />
      )}
    </div>
  );
}
