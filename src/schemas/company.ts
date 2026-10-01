/**
 * Validación (Zod) del formulario de empresa (crear y editar).
 */
import { z } from "zod";

/**
 * Datos de una empresa. Los campos de texto se recortan (trim) antes de
 * validar y el código postal se convierte a número.
 */
export const companyFormSchema = z.object({
  name: z.string().trim().min(2, "Mínimo 2 caracteres"),
  nit: z
    .string()
    .trim()
    .regex(/^\d{4,}(\.\d+)?-\d$/, "Ingresa un NIT válido (ej: 900123456-7)"),
  bankType: z.string().min(1, "Selecciona un banco"),
  bankAccount: z
    .string()
    .trim()
    .regex(/^\d{10,20}$/, "Debe tener entre 10 y 20 dígitos"),
  address: z.string().trim().min(1, "Campo requerido"),
  postalcode: z.coerce
    .number({ invalid_type_error: "Ingresa un número" })
    .int()
    .min(10000, "Código postal inválido")
    .max(999999, "Código postal inválido"),
  email: z.string().trim().email("Ingresa un correo válido"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?\d{10,13}$/, "Ingresa un teléfono válido"),
});

/** Valores del formulario de empresa (ya validados). */
export type CompanyFormValues = z.infer<typeof companyFormSchema>;
