import { z } from "zod";

const required = z.string().trim().min(1, "Campo requerido");

export const paymentSchema = z.object({
  email: z.string().trim().email("Ingresa un correo válido"),
  pais: required,
  nombre: required,
  apellidos: required,
  cedula: z
    .string()
    .trim()
    .regex(/^\d{6,10}$/, "Ingresa una cédula válida"),
  direccion: required,
  detalles_direccion: z.string().trim().optional(),
  ciudad: required,
  departamento: required,
  codigo_postal: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Debe tener 6 dígitos"),
  telefono: z
    .string()
    .trim()
    .regex(/^\+?\d{10,13}$/, "Ingresa un teléfono válido"),
});

export type PaymentValues = z.infer<typeof paymentSchema>;
