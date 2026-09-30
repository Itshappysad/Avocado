import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { updateUser } from "../../core/database";
import { editUserSchema, type EditUserValues } from "../../schemas/user";
import { ProfilePicture } from "../../components/ProfilePicture";
import { Button } from "../../components/ui/button";
import { Field } from "../../components/ui/field";
import { Input } from "../../components/ui/input";
import { PageHeader } from "../../components/ui/page-header";

export default function EditProfilePage() {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EditUserValues>({
    resolver: zodResolver(editUserSchema),
    // "values" mantiene el formulario sincronizado si el perfil cambia.
    values: {
      name: user?.name ?? "",
      address: user?.address ?? "",
      postalcode: user?.postalcode ?? undefined,
    },
  });

  if (!user) return null;

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateUser(user.id, values);
      toast.success("Perfil actualizado");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo actualizar el perfil");
    }
  });

  return (
    <>
      <PageHeader
        title="Mi perfil"
        description="Edita tu información personal y tu foto"
      />
      <div className="grid gap-10 lg:grid-cols-[auto_1fr]">
        <ProfilePicture userId={user.id} editable />

        <form onSubmit={onSubmit} noValidate className="grid max-w-xl gap-5">
          <Field label="Nombre" htmlFor="name" error={errors.name?.message}>
            <Input id="name" invalid={!!errors.name} {...register("name")} />
          </Field>
          <Field
            label="Correo"
            htmlFor="email"
            hint="El correo está ligado a tu inicio de sesión y no se puede cambiar aquí."
          >
            <Input id="email" value={user.email} disabled readOnly />
          </Field>
          <Field
            label="Dirección"
            htmlFor="address"
            error={errors.address?.message}
            hint="Se usará para completar tus pedidos"
          >
            <Input id="address" {...register("address")} />
          </Field>
          <Field
            label="Código postal"
            htmlFor="postalcode"
            error={errors.postalcode?.message}
          >
            <Input
              id="postalcode"
              inputMode="numeric"
              invalid={!!errors.postalcode}
              {...register("postalcode")}
            />
          </Field>
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting || !isDirty}
            className="justify-self-start"
          >
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
      </div>
    </>
  );
}
