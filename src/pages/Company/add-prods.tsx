import { useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import { Link, useNavigate } from "react-router-dom";
import AddItemForm from "../../components/add-item-form";
import { useQuery } from "@tanstack/react-query";
import { getAccountBusiness } from "../../core/database";
import { Button } from "../../components/ui/button";
import LoadingIcon from "../../components/icons/loading";

function AddItem() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/signUp");
    }
  }, [user, navigate]);

  const { data, isLoading } = useQuery({
    queryKey: ["company-add"],
    queryFn: async () => {
      if (!user) return null;
      const company = await getAccountBusiness(user.id);
      return company;
    },
    refetchInterval: 1000 * 20,
  });

  if (!data) {
    navigate("/createcompany");
    return (
      <Button asChild>
        <Link to="/createcompany">Crea tu empresa</Link>
      </Button>
    );
  }

  return (
    <div className="mt-10">
      <div className="text-center">
        <h2 className="font-bold ">Añadir productos</h2>
        <p>Aqui tu puedes crear productos en la tienda</p>
      </div>
      {isLoading && <LoadingIcon className="text-5xl" />}
      <AddItemForm company={data} />
    </div>
  );
}
export default AddItem;
