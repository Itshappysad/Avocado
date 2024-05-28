import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { getProductsByCategory, getProductsByMaterial } from "../core/database";
import { ProductImage } from "./product-img";
import { formatCurrency } from "../utilities/formatCurrency";
import StoreDialog from "./StoreDialog";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "../core/types";

type Props =
  | { category: string; material?: undefined }
  | {
      category?: undefined;
      material: string;
    };

const CarouselSize = ({ category, material }: Props) => {
  const {
    data: storeItems,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["carrusel-filter", category, material],
    queryFn: async () => {
      let products: Product[] | null = null;

      if (category) {
        products = await getProductsByCategory(category);
      } else if (material) {
        products = await getProductsByMaterial(material);
      }
      if (!products) {
        throw new Error(
          `No se encontraron productos en la categoría [${category}]`,
        );
      }

      return products;
    },
  });

  if (error) {
    return <div className="errorMessage">Error: {error.toString()}</div>;
  }

  if (!storeItems || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  {
    return (
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full h-full"
      >
        <CarouselContent>
          {storeItems.map((item) => (
            <StoreDialog product={item} key={item.id}>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-4 gap-2">
                      <ProductImage
                        className="rounded-lg"
                        id={item.id}
                        name={item.name}
                      />
                      <CardTitle>{item.name}</CardTitle>
                      <CardDescription>
                        Precio: {formatCurrency(item.price)}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            </StoreDialog>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );
  }
};

export default CarouselSize;
