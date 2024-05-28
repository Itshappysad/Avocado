import { useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { type EditUser, editUserSchema } from "../../schemas/edit";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../components/input";
import { Button } from "../../components/ui/button";
import { editUser } from "../../core/database";
import { toast } from "sonner";
import ProfilePicture from "../../components/ProfilePic";
import ProfilePictureButtons from "../../components/ProfileButton";

function EditUser() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<EditUser>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      address: user?.address,
      postalcode: user?.postalcode,
    },
  });

  useEffect(() => {
    if (!user) {
      navigate("/signUp");
    }
  }, [user, navigate]);

  const onSubmit: SubmitHandler<EditUser> = async (data) => {
    if (!user) return;

    const res = await editUser({ email: user.email, userData: data });

    if (!res) {
      return toast.error("Ha ocurrido un error");
    }

    toast.success("Modificado correctamente");
  };

  return (
    <div className="h-full ">
      <div className="px-10">
        <h2 className="font-bold">Mi perfil</h2>
        <p>Aqui puedes editar toda la informacion sobre ti y tu perfil</p>
      </div>
      <form
        className="px-10 flex flex-col gap-1"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex gap-6">
          <div className="flex-col">
            {user && (
              <>
                <ProfilePicture id={user.id} />
                <ProfilePictureButtons id={user.id} />
                {/* Te lo juro que si hay un ID */}
              </>
            )}
          </div>

          <div className="flex flex-col ">
            <div>
              <label className="font-bold py-2" htmlFor="name">
                Nombre:
              </label>
              <Input {...register("name")} />
              <p className="font-extralight py-1">
                Aqui puedes cambiar todos los datos sobre tu nombre y como se
                muestra a la pagina
              </p>
            </div>
            <div>
              <label className="font-bold py-2" htmlFor="email">
                Email:
              </label>
              <Input {...register("email")} />
              <p className="font-extralight py-1">
                Aqui puedes cambiar los datos sobre tu correo electronico
              </p>
            </div>
            <div>
              <label className="font-bold py-2" htmlFor="address">
                Dirrección:
              </label>
              <Input {...register("address")} />
              <p className="font-extralight py-1">
                Aqui puedes cambiar los datos sobre tu dirrecion
              </p>
            </div>
            <div>
              <label className="font-bold py-2" htmlFor="postalcode">
                Codigo Postal:
              </label>
              <Input {...register("postalcode", { valueAsNumber: true })} />
              <p className="font-extralight py-1">
                Aqui puedes cambiar los datos sobre tu codigo postal
              </p>
            </div>
            <div className="mt-10">
              <Button className="px-60" disabled={isSubmitting}>
                Editar informacion
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
export default EditUser;
