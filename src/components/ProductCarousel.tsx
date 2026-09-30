import { useQuery } from "@tanstack/react-query";
import { getProductsByCategory, getProductsByMaterial } from "../core/database";
import { ProductCard } from "./ProductCard";
import { ProductDialog } from "./ProductDialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { PageLoader } from "./ui/spinner";

type ProductCarouselProps = {
  title: string;
} & (
  | { category: string; material?: never }
  | { material: string; category?: never }
);

/** Sección de la página de inicio: productos filtrados por categoría o material. */
export function ProductCarousel({
  title,
  category,
  material,
}: ProductCarouselProps) {
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", { category, material }],
    queryFn: () =>
      category
        ? getProductsByCategory(category)
        : getProductsByMaterial(material!),
  });

  // Si no hay productos en esta sección, no se muestra.
  if (isError || (!isLoading && !products?.length)) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      {isLoading ? (
        <PageLoader />
      ) : (
        <Carousel opts={{ align: "start", loop: true }} className="mx-12">
          <CarouselContent>
            {products!.map((product) => (
              <CarouselItem
                key={product.id}
                className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <ProductDialog product={product}>
                  <ProductCard product={product} />
                </ProductDialog>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </section>
  );
}
