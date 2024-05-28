import { DialogTrigger } from "@radix-ui/react-dialog";
import { Product } from "../../core/types";
import { Dialog, DialogContent } from "../ui/dialog";
import EditItemForm from "../edit-item-form";
import { useQuery } from "@tanstack/react-query";
import { getProductImage } from "../../core/storage";
import LoadingIcon from "../icons/loading";

type Props = React.ComponentPropsWithRef<typeof Dialog> & {
  product: Product;
};

function CompanyProdDialog({ product, children, ...props }: Props) {
  const { data: imageUrl, isLoading } = useQuery({
    queryKey: ["product-img", product.id],
    queryFn: async () => {
      const img = await getProductImage(product.id);

      if (!img) {
        throw new Error("Image not found");
      }

      return img;
    },
  });

  return (
    <Dialog {...props}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        {isLoading ? (
          <LoadingIcon className="text-2xl" />
        ) : (
          imageUrl && <EditItemForm product={product} img={imageUrl} />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CompanyProdDialog;
