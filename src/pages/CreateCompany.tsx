import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Button } from "../components/ui/button";
import Input from "../components/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterCompanyForm,
  registerCompanyFormSchema,
} from "../schemas/company";
import { createCompanyForUser } from "../core/database";
import { toast } from "sonner";

export function CreateCompany() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterCompanyForm>({
    resolver: zodResolver(registerCompanyFormSchema),
    defaultValues: {
      name: "",
      nit: "",
      bankType: "",
      bankAccount: "",
      email: "",
      phone: "",
      address: user?.address,
    },
  });

  useEffect(() => {
    if (!user) {
      navigate("/signUp");
    }
  }, [user, navigate]);

  const onSubmit: SubmitHandler<RegisterCompanyForm> = async (data) => {
    try {
      if (!user) {
        throw new Error("Usuario no autenticado");
      }
      const success = await createCompanyForUser({
        userId: user.id,
        companyData: data,
      });

      if (success) {
        toast.success("Empresa creada exitosamente!");
        //navigate('')
      } else {
        throw new Error("Error al crear la empresa");
      }
    } catch (error) {
      toast.error("Error al crear la empresa");
    }
  };
  return (
    <div className="h-full">
      <div className="px-10 text-center">
        <h2 className="font-bold ">Crea tu empresa</h2>
        <p>
          Aqui tu puedes crear tu propia empresa para poder crear items en la
          tienda
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-10 flex flex-col gap-1"
      >
        <div>
          <div className="flex gap-6">
            {/* <div className="flex-col rounded-sm h-32 w-1/2">
              <CompanyPicture id="" />
              <CompanyPictureButtons id="" />
            </div> */}

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
