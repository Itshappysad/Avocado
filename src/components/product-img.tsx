import { useQuery } from "@tanstack/react-query";
import { getProductImage } from "../core/storage";
import LoadingIcon from "./icons/loading";
import { cn } from "../core/utils";

export const ProductImage = ({
  id,
  name,
  className,
}: {
  id: string;
  name: string;
  className?: string;
}) => {
  const {
    data: imageUrl,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product-img", id],
    queryFn: async () => {
      const img = await getProductImage(id);

      if (!img) {
        throw new Error("Image not found");
      }

      return img;
    },
  });

  return (
    <>
      {isLoading ? (
        <LoadingIcon className="text-2xl" />
      ) : (
        imageUrl && (
          <img
            src={imageUrl}
            alt={name}
            className={cn("size-64 bg-white object-cover", className)}
          />
        )
      )}
      {error && (
        <p className="p-1 bg-red-200 text-red-600">{error.toString()}</p>
      )}
    </>
  );
};
