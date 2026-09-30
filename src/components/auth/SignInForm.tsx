import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getAuthErrorMessage, signInWithEmail } from "../../core/auth";
import { signInSchema, type SignInValues } from "../../schemas/auth";
import { Button } from "../ui/button";
import { Field } from "../ui/field";
import { Input } from "../ui/input";

export function SignInForm({ onSuccess }: { onSuccess: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    try {
      await signInWithEmail(email, password);
      onSuccess();
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <Field
        label="Correo"
        htmlFor="signin-email"
        error={errors.email?.message}
      >
        <Input
          id="signin-email"
          type="email"
          autoComplete="email"
          invalid={!!errors.email}
          {...register("email")}
        />
      </Field>
      <Field
        label="Contraseña"
        htmlFor="signin-password"
        error={errors.password?.message}
      >
        <Input
          id="signin-password"
          type="password"
          autoComplete="current-password"
          invalid={!!errors.password}
          {...register("password")}
        />
      </Field>
      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
      </Button>
    </form>
  );
}
