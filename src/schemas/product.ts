/**
 * Validación (Zod) del formulario de producto (crear y editar).
 */
import { z } from "zod";

/**
 * Datos de un producto. Tallas, categorías y colores deben tener al menos un
 * elemento; el precio se convierte a número entero positivo.
 */
export const productFormSchema = z.object({
  name: z.string().trim().min(1, "Campo requerido"),
  price: z.coerce
    .number({ invalid_type_error: "Ingresa un número" })
    .int("Sin decimales")
    .positive("Debe ser mayor a 0"),
  materials: z.string().min(1, "Selecciona un material"),
  sizes: z.array(z.string()).min(1, "Selecciona al menos una talla"),
  categories: z.array(z.string()).min(1, "Selecciona al menos una categoría"),
  colors: z.array(z.string()).min(1, "Agrega al menos un color"),
});

/** Valores del formulario de producto (ya validados). */
export type ProductFormValues = z.infer<typeof productFormSchema>;
