import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().email("Ingresa un correo válido"),
  password: z.string().min(1, "Campo requerido"),
});

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

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
