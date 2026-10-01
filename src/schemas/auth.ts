/**
 * Validaciones (Zod) de los formularios de inicio de sesión y registro.
 */
import { z } from "zod";

/** Inicio de sesión: correo válido y contraseña no vacía. */
export const signInSchema = z.object({
  email: z.string().trim().email("Ingresa un correo válido"),
  password: z.string().min(1, "Campo requerido"),
});

/**
 * Registro: nombre, correo, contraseña de al menos 10 caracteres y
 * confirmación que debe coincidir.
 */
export const signUpSchema = z
  .object({
    name: z.string().trim().min(1, "Campo requerido"),
    email: z.string().trim().email("Ingresa un correo válido"),
    password: z
      .string()
      .min(10, "La contraseña debe tener al menos 10 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((fields) => fields.password === fields.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

/** Valores del formulario de inicio de sesión. */
export type SignInValues = z.infer<typeof signInSchema>;
/** Valores del formulario de registro. */
export type SignUpValues = z.infer<typeof signUpSchema>;
