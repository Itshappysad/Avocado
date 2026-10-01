/**
 * Formulario de registro de una cuenta nueva.
 */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getAuthErrorMessage, signUpWithEmail } from "../../core/auth";
import { signUpSchema, type SignUpValues } from "../../schemas/auth";
import { Button } from "../ui/button";
import { Field } from "../ui/field";
import { Input } from "../ui/input";

/**
 * Formulario de registro. Valida con `signUpSchema` (contraseña de al menos
 * 10 caracteres y confirmación igual), crea la cuenta e inicia sesión.
 *
 * @param onSuccess Se llama al crear la cuenta (normalmente para redirigir).
 */
export function SignUpForm({ onSuccess }: { onSuccess: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema) });

  const onSubmit = handleSubmit(async ({ name, email, password }) => {
    try {
      await signUpWithEmail({ name, email, password });
      toast.success("¡Cuenta creada! Bienvenido/a");
      onSuccess();
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <Field label="Nombre" htmlFor="signup-name" error={errors.name?.message}>
        <Input
          id="signup-name"
          autoComplete="name"
          invalid={!!errors.name}
          {...register("name")}
        />
      </Field>
      <Field
        label="Correo"
        htmlFor="signup-email"
        error={errors.email?.message}
      >
        <Input
          id="signup-email"
          type="email"
          autoComplete="email"
          invalid={!!errors.email}
          {...register("email")}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Contraseña"
          htmlFor="signup-password"
          error={errors.password?.message}
        >
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            invalid={!!errors.password}
            {...register("password")}
          />
        </Field>
        <Field
          label="Confirmar contraseña"
          htmlFor="signup-confirm"
          error={errors.confirmPassword?.message}
        >
          <Input
            id="signup-confirm"
            type="password"
            autoComplete="new-password"
            invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
        </Field>
      </div>
      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
      </Button>
    </form>
  );
}
