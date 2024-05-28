import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/useAuth";
import { PurchaseItem } from "../../components/PurchaseItem";
import LoadingIcon from "../../components/icons/loading";
import {
  getAccountBusiness,
  getOrders,
  modifyOrderState,
} from "../../core/database";

function CompanyOrders() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["purchase-his"],
    queryFn: async () => {
      if (!user) return [];

      const comp = await getAccountBusiness(user.id);
      if (!comp) return [];

      const pur = await getOrders(comp.id);
      return pur;
    },
  });

  const handleChange = async (purId: string, state: string) => {
    if (!user) return;

    const comp = await getAccountBusiness(user.id);
    if (!comp) return;

    await modifyOrderState({
      companyId: comp.id,
      orderId: purId,
      state,
      userId: user.id,
    });
  };

  return (
    <div className="mt-5">
      {!isLoading && data ? (
        data.map((pur) => (
          <div className="text-center rounded-lg bg-gray-100" key={pur.id}>
            <h3 className="py-2 pl-6 font-bold text-3xl">
              {pur.orderedAt.toDate().toLocaleDateString()}
            </h3>
            <h4>
              <strong>Estado:</strong>
              <select
                onChange={async (e) => {
                  const { value } = e.target;
                  await handleChange(pur.id, value);
                }}
                defaultValue={pur.state}
                name="state"
                id="state"
              >
                <option value="pendiente">Pendiente</option>
                <option value="enviado">Enviado</option>
                <option value="recibido">Recibido</option>
              </select>
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

export default CompanyOrders;
