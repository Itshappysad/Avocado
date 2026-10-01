/**
 * Formulario con los datos de una empresa.
 */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BANK_OPTIONS } from "../core/constants";
import { companyFormSchema, type CompanyFormValues } from "../schemas/company";
import { Button } from "./ui/button";
import { Field } from "./ui/field";
import { Input } from "./ui/input";
import { NativeSelect } from "./ui/native-select";

type CompanyFormProps = {
  /** Valores iniciales (al editar, los datos actuales de la empresa). */
  defaultValues?: Partial<CompanyFormValues>;
  /** Texto del botón, ej: "Crear empresa" o "Guardar cambios". */
  submitLabel: string;
  /** Recibe los datos ya validados. El botón se desactiva mientras se ejecuta. */
  onSubmit: (values: CompanyFormValues) => Promise<void>;
};

/**
 * Formulario de datos de la empresa, validado con `companyFormSchema`.
 * Lo usan CreateCompanyPage (crear) y EditCompanyPage (editar).
 */
export function CompanyForm({
  defaultValues,
  submitLabel,
  onSubmit,
}: CompanyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: "",
      nit: "",
      bankType: "",
      bankAccount: "",
      address: "",
      email: "",
      phone: "",
      ...defaultValues,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid max-w-3xl gap-5 sm:grid-cols-2"
    >
      <Field
        label="Nombre de la empresa"
        htmlFor="name"
        error={errors.name?.message}
        hint="Así verán tu marca los clientes"
      >
        <Input id="name" invalid={!!errors.name} {...register("name")} />
      </Field>

      <Field
        label="NIT"
        htmlFor="nit"
        error={errors.nit?.message}
        hint="Con dígito de verificación, ej: 900123456-7"
      >
        <Input id="nit" invalid={!!errors.nit} {...register("nit")} />
      </Field>

      <Field label="Banco" htmlFor="bankType" error={errors.bankType?.message}>
        <NativeSelect
          id="bankType"
          invalid={!!errors.bankType}
          {...register("bankType")}
        >
          <option value="">Elegir...</option>
          {BANK_OPTIONS.map((bank) => (
            <option key={bank.value} value={bank.value}>
              {bank.label}
            </option>
          ))}
        </NativeSelect>
      </Field>

      <Field
        label="Número de cuenta"
        htmlFor="bankAccount"
        error={errors.bankAccount?.message}
      >
        <Input
          id="bankAccount"
          inputMode="numeric"
          invalid={!!errors.bankAccount}
          {...register("bankAccount")}
        />
      </Field>

      <Field
        label="Dirección"
        htmlFor="address"
        error={errors.address?.message}
      >
        <Input
          id="address"
          invalid={!!errors.address}
          {...register("address")}
        />
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

      <Field
        label="Correo de contacto"
        htmlFor="email"
        error={errors.email?.message}
      >
        <Input
          id="email"
          type="email"
          invalid={!!errors.email}
          {...register("email")}
        />
      </Field>

      <Field label="Teléfono" htmlFor="phone" error={errors.phone?.message}>
        <Input
          id="phone"
          type="tel"
          invalid={!!errors.phone}
          {...register("phone")}
        />
      </Field>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="sm:col-span-2 sm:justify-self-start"
      >
        {isSubmitting ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
