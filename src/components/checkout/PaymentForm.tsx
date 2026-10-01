/**
 * Formulario de contacto y entrega del checkout.
 */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SHIPPING_COST } from "../../core/constants";
import { formatCurrency } from "../../core/utils";
import { paymentSchema, type PaymentValues } from "../../schemas/payment";
import { Button } from "../ui/button";
import { Field } from "../ui/field";
import { Input } from "../ui/input";
import { NativeSelect } from "../ui/native-select";

type PaymentFormProps = {
  /** Valores precargados (correo, nombre y dirección del perfil). */
  defaultValues?: Partial<PaymentValues>;
  /** Recibe los datos validados; el botón se desactiva mientras se ejecuta. */
  onSubmit: (values: PaymentValues) => Promise<void>;
};

/**
 * Formulario de contacto y entrega del checkout (validado con `paymentSchema`).
 * No pide datos de tarjeta: la app registra el pedido sin cobrar.
 */
export function PaymentForm({ defaultValues, onSubmit }: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { pais: "Colombia", ...defaultValues },
  });

  // Pequeño atajo para no repetir id, error e invalid en cada campo.
  const field = (name: keyof PaymentValues) => ({
    id: name,
    invalid: !!errors[name],
    ...register(name),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-10">
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Contacto</h2>
        <Field
          label="Correo electrónico"
          htmlFor="email"
          error={errors.email?.message}
        >
          <Input type="email" autoComplete="email" {...field("email")} />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Entrega</h2>
        <Field
          label="País / Región"
          htmlFor="pais"
          error={errors.pais?.message}
        >
          <NativeSelect {...field("pais")}>
            <option value="Colombia">Colombia</option>
          </NativeSelect>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre" htmlFor="nombre" error={errors.nombre?.message}>
            <Input autoComplete="given-name" {...field("nombre")} />
          </Field>
          <Field
            label="Apellidos"
            htmlFor="apellidos"
            error={errors.apellidos?.message}
          >
            <Input autoComplete="family-name" {...field("apellidos")} />
          </Field>
        </div>
        <Field
          label="Número de cédula"
          htmlFor="cedula"
          error={errors.cedula?.message}
        >
          <Input inputMode="numeric" {...field("cedula")} />
        </Field>
        <Field
          label="Dirección"
          htmlFor="direccion"
          error={errors.direccion?.message}
        >
          <Input autoComplete="street-address" {...field("direccion")} />
        </Field>
        <Field
          label="Detalles de la dirección (opcional)"
          htmlFor="detalles_direccion"
          hint="Apartamento, torre, barrio…"
        >
          <Input {...field("detalles_direccion")} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Ciudad" htmlFor="ciudad" error={errors.ciudad?.message}>
            <Input autoComplete="address-level2" {...field("ciudad")} />
          </Field>
          <Field
            label="Departamento"
            htmlFor="departamento"
            error={errors.departamento?.message}
          >
            <Input autoComplete="address-level1" {...field("departamento")} />
          </Field>
          <Field
            label="Código postal"
            htmlFor="codigo_postal"
            error={errors.codigo_postal?.message}
          >
            <Input
              inputMode="numeric"
              autoComplete="postal-code"
              {...field("codigo_postal")}
            />
          </Field>
        </div>
        <Field
          label="Teléfono"
          htmlFor="telefono"
          error={errors.telefono?.message}
        >
          <Input type="tel" autoComplete="tel" {...field("telefono")} />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Método de envío</h2>
        <div className="flex items-center justify-between rounded-lg border-2 border-neutral-900 bg-neutral-50 p-4">
          <span>Envío en Colombia</span>
          <span className="font-semibold">{formatCurrency(SHIPPING_COST)}</span>
        </div>
      </section>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Procesando pedido..." : "Realizar pedido"}
      </Button>
    </form>
  );
}
