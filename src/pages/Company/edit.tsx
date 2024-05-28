import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { Button } from "../../components/ui/button";
import Input from "../../components/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditCompanyForm, editCompanyFormSchema } from "../../schemas/company";
import { editCompany, getAccountBusiness } from "../../core/database";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import LoadingIcon from "../../components/icons/loading";

function CompanyEdit() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: company,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["company-e"],
    queryFn: async () => {
      if (!user) return;

      const company = await getAccountBusiness(user.id);

      if (!company) {
        throw new Error("No company");
      }

      return company;
    },
    refetchInterval: 1000 * 20,
  });

  useEffect(() => {
    console.log(company);
  }, [company]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<EditCompanyForm>({
    resolver: zodResolver(editCompanyFormSchema),
    defaultValues: {
      name: company?.name,
      nit: company?.nit,
      bankType: company?.bankType,
      bankAccount: company?.bankAccount,
      email: company?.email,
      phone: company?.phone,
      address: company?.address,
      postalcode: company?.postalcode,
    },
  });

  useEffect(() => {
    if (!user) {
      navigate("/signUp");
    }
  }, [user, navigate]);

  const onSubmit: SubmitHandler<EditCompanyForm> = async (data) => {
    try {
      if (!user) {
        throw new Error("Usuario no autenticado");
      }
      const success = await editCompany({
        companyData: data,
        userId: user.id,
      });
      if (success) {
        toast.success("Información modificada exitosamente!");
      } else {
        throw new Error("Error al modificar la empresa");
      }
    } catch (error) {
      toast.error("Error al modificar la empresa");
    }
  };

  if (error) {
    return <p className="p-1 bg-red-200 text-red-600">{error.toString()}</p>;
  }

  return isLoading ? (
    <LoadingIcon className="text-4xl" />
  ) : (
    <div className="mt-10">
      <div className="px-10 text-center">
        <h2 className="font-bold ">Edita la información de tu empresa</h2>
        <p>Aqui tu puedes modificar la información que reconoce a tu empresa</p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-10 flex flex-col gap-1"
      >
        <div>
          <div className="flex gap-6">
            <div className=" flex-col ">
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <label className="font-bold py-2" htmlFor="name">
                    Nombre de la Empresa:
                  </label>
                  <Input {...register("name")} />
                  <p className="font-extralight py-1">
                    Aqui puedes cambiar todos los datos sobre tu nombre y como
                    se muestra a la pagina
                  </p>
                </div>
                <div className="px-4">
                  <label className="font-bold py-2" htmlFor="nit">
                    NIT:
                  </label>
                  <Input {...register("nit")} className="w-54" />
                  <p className="font-extralight py-1">
                    Aqui puedes cambiar los datos sobre tu numero de identidad
                  </p>
                </div>
                <div className=" ">
                  <label className="font-bold py-2 block" htmlFor="Banktype">
                    Tipo de banco:
                  </label>
                  <select
                    {...register("bankType")}
                    className="border-1   border-gray-400 rounded-md w-full h-9 focus:border-blue-500 focus:border-4"
                  >
                    <option value="">Elegir...</option>
                    <option value="Bancolombia">Bancolombia</option>
                    <option value="BBVA">BBVA Colombia</option>
                    <option value="Visa">VISA Dedito</option>
                    <option value="BancoBogota">Banco de Bogota</option>
                    <option value="Davivienda">Davivienda</option>
                    <option value="Citibank">Citibank Colombia</option>
                    <option value="Colpatria">Scotiabank Colpatria</option>
                  </select>
                </div>
                <div className="px-4 ">
                  <label className="font-bold py-2 " htmlFor="bankAccount">
                    Numero de Cuenta Bancaria:
                  </label>
                  <Input {...register("bankAccount")} className="w-38 " />
                </div>

                <div>
                  <label className="font-bold py-2 " htmlFor="address">
                    Direccion:
                  </label>
                  <Input {...register("address")} />
                </div>
                <div className="px-4">
                  <label className="font-bold py-2 " htmlFor="postalcode">
                    Codigo Postal:
                  </label>
                  <Input
                    {...register("postalcode", { valueAsNumber: true })}
                    className="w-38"
                  />
                </div>
                <div>
                  <label className="font-bold py-2" htmlFor="email">
                    Gmail:
                  </label>
                  <Input {...register("email")} />
                  <p className="font-extralight py-1">
                    Aqui puedes cambiar los datos sobre tu correo electronico
                  </p>
                </div>
                <div className="px-4">
                  <label className="font-bold py-2" htmlFor="phone">
                    Telefono:
                  </label>
                  <Input {...register("phone")} className="w-38" />
                  <p className="font-extralight py-1">
                    Aqui puedes cambiar los datos sobre tu numero telefonico
                  </p>
                </div>
              </div>
              <div className="py-4">
                <Button disabled={isSubmitting} className="px-60">
                  Subir informacion
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CompanyEdit;
