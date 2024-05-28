import Input from "./input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUser, createUserSchema } from "../schemas/register";
import { createUserWithEmail } from "../core/auth";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../core/database";

function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreateUser>({
    resolver: zodResolver(createUserSchema),
  });
  const navigate = useNavigate();

  return (
    <form
      onSubmit={handleSubmit(async ({ email, password, name }) => {
        const user = await createUserWithEmail(email, password);
        console.log("entro");
        if (!user) return;
        const res = await registerUser({
          id: user.uid,
          name,
          email,
          password,
        });
        if (!res) {
          console.error("Firebase error");
        }
        navigate("/");
      })}
      className="flex flex-col px-10"
    >
      <div className="flex flex-col gap-4">
        <Input {...register("name")} placeholder="Nombre" error={errors.name} />
        <Input
          {...register("email")}
          placeholder="Correo"
          error={errors.email}
        />
        <div className="flex gap-10 lg:flex-row flex-col [&>div]:flex-1">
          <Input
            className=""
            {...register("password")}
            placeholder="Contraseña"
            error={errors.password}
            type="password"
          />
          <Input
            {...register("confirmPassword")}
            placeholder="Confirmar contraseña"
            error={errors.confirmPassword}
            type="password"
          />
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <button
          className="
            py-2 px-3 bg-gray-800 font-bold rounded-xl text-white transition-transform
            hover:bg-gray-400
            active:scale-95
            disabled:bg-lime-900
          "
          disabled={isSubmitting}
        >
          REGISTRARSE
        </button>
      </div>
    </form>
  );
}
export default SignUpForm;
