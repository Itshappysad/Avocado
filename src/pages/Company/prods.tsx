import { useQuery } from "@tanstack/react-query";
import { getCompanyProducts } from "../../core/database";
import LoadingIcon from "../../components/icons/loading";
import CompanyProd from "../../components/company-prod";
import { useAuth } from "../../context/useAuth";

function CompanyProducts() {
  const { user } = useAuth();

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["com-prods"],
    queryFn: async () => {
      if (!user) return null;

      const products = await getCompanyProducts(user.id);

      if (!products) {
        throw new Error("No products");
      }

      return products;
    },
  });

  return (
    <div className="mt-10 flex gap-4 p-3">
      {isLoading ? (
        <LoadingIcon className="text-xl" />
      ) : (
        products?.map((prod) => <CompanyProd product={prod} key={prod.id} />)
      )}
      {error && (
        <p className="p-1 bg-red-200 text-red-600">{error.toString()}</p>
      )}
    </div>
  );
}

export default CompanyProducts;
