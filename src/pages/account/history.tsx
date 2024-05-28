import { useQuery } from "@tanstack/react-query";
import { getPurchaseHistory } from "../../core/database";
import { useAuth } from "../../context/useAuth";
import LoadingIcon from "../../components/icons/loading";
import { PurchaseItem } from "../../components/PurchaseItem";

function UserHistory() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["purchase-his"],
    queryFn: async () => {
      if (!user) return [];
      const pur = await getPurchaseHistory(user.id);
      return pur;
    },
  });

  return (
    <div className="mt-5">
      {!isLoading && data ? (
        data.map((pur) => (
          <div className="text-center rounded-lg bg-gray-100" key={pur.id}>
            <h3 className="py-2 pl-6 font-bold text-3xl">
              {pur.orderedAt.toDate().toLocaleDateString()}
            </h3>
            <h4>
              <strong>Estado:</strong> {pur.state}
            </h4>
            <div className="space-x-3">
              {pur.items.map((i) => (
                <PurchaseItem key={i.id} item={i} quantity={i.quantity} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <LoadingIcon className="text-2xl" />
      )}
    </div>
  );
}

export default UserHistory;
