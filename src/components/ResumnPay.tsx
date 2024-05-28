import type { Item } from "../core/types";
import { useQuery } from "@tanstack/react-query";
import { ProductImage } from "./product-img";
import { getProductById } from "../core/database";

const ResumnItem = ({ item: { sizes, productId } }: { item: Item }) => {
  const { data: product } = useQuery({
    queryKey: ["pur-product", productId],
    queryFn: async () => {
      const product = await getProductById(productId);
      return product;
    },
  });

  return (
    <div className="flex items-center p-2 rounded-lg">
      <div className="w-10 h-10 flex-shrink-0 border-2 border-solid ">
        {product && (
          <ProductImage
            className="size-24"
            id={productId}
            name={product.name}
          />
        )}
      </div>
      <div className="ml-4 text-start">
        <h3 className="text-[14px] font-semibold">{product?.name}</h3>
        <p className="text-gray-600 text-[12px]">{sizes[0]}</p>
      </div>
      <div className="ml-auto text-right">
        <p className="text-[14px] font-semibold text-gray-800">
          {product?.price}
        </p>
      </div>
    </div>
  );
};

const ResumnPay = ({
  items,
  paymentData,
}: {
  items: Item[];
  paymentData: { subTotal: number };
}) => {
  return (
    <div className="bg-gray-200 w-full h-full">
      <div className="p-4 border rounded-lg flex flex-col gap-2">
        <div className="col-8">
          {items &&
            items.map((item) => <ResumnItem key={item.id} item={item} />)}
        </div>

        <div className="col-8 mt-10">
          <div className="flex justify-between">
            <span className="text-[14px]">Subtotal</span>
            <span className="text-[14px] font-bold">
              {paymentData.subTotal || "$ 00"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[14px]">Métodos de envío</span>
            <span className="text-[14px] font-bold">$ 12.500,00</span>
          </div>
          <div className="flex justify-between mt-4 font-bold">
            <span className="text-[18px] font-bold">Total</span>
            <span className="text-[18px] font-bold">
              {paymentData.subTotal + 12500 || "$ 00"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumnPay;
