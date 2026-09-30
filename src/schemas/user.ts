import { z } from "zod";

export const editUserSchema = z.object({
  name: z.string().trim().min(1, "Campo requerido"),
  address: z.string().trim().optional(),
  // Campo opcional: si se deja vacío no se valida.
  postalcode: z.preprocess(
    (value) => (value === "" || value == null ? undefined : Number(value)),
    z
      .number({ invalid_type_error: "Ingresa un número" })
      .int()
      .min(10000, "Código postal inválido")
      .max(999999, "Código postal inválido")
      .optional(),
  ),
});

export type EditUserValues = z.infer<typeof editUserSchema>;
