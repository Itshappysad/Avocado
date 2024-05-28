import { useEffect, useState } from "react";
import { getProductsByCategory } from "../core/database";
import { Product } from "../core/types";
import { getProductImage } from "../core/storage";

const Carousel2 = ({ category }: { category: string }) => {
  const [storeItems, setStoreItems] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProductsByCategory(category);

        if (!products) {
          setError(`No se encontraron productos en la categoría [${category}]`);
          return;
        }

        setStoreItems(products);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(`Error al buscar productos en la categoría [${category}]`);
      }
    };

    fetchProducts();
  }, [category]);

  if (error) {
    return <div className="errorMessage">Error: {error}</div>;
  }

  if (!storeItems) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="carousel relative w-full flex gap-6 snap-mandatory overflow-x-auto pb-14 h-72 rounded-lg shadow-sm place-items-stretch">
      <div className="snap-center shrink-0 first:pl-8 last:pr-8">
        {storeItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center items-align-center text-decoration"
          >
            <a
              className="text-decoration-none text-black"
              href={"/product/".concat(item.id)}
            >
              <ProductImage id={item.id} name={item.name} />
              <h6>{item.name}</h6>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductImage = ({ id, name }: { id: string; name: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const image = await getProductImage(id);
        setImageUrl(image);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage();
  }, [id]);

  return imageUrl ? (
    <img
      src={imageUrl}
      alt={name}
      className="w-56 h-64 rounded-lg shadow-xl bg-white"
    />
  ) : (
    <div>Loading...</div>
  );
};

export default Carousel2;
