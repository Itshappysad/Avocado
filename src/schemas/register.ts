import { z } from 'zod';

export const createUserSchema = z
  .object({
    name: z.string({ required_error: 'Campo requerido' }),
    email: z
      .string({ required_error: 'Campo requerido' })
      .email('Ingresa un correo valido'),
    password: z
      .string({ required_error: 'Campo requerido' })
      .min(10, 'La contraseña debe ser al menos de 10 caracteres'),
    confirmPassword: z.string({ required_error: 'Campo requerido' }),
  })
  .refine(fields => fields.password === fields.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type CreateUser = z.infer<typeof createUserSchema>;
