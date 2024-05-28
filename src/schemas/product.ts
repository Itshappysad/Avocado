import { z } from "zod";

export const registerProductFormSchema = z.object({
  name: z.string().min(1),
  price: z.number().int().positive().min(1),
  materials: z.string().min(1),
});

export const registerProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().int().positive().min(1),
  colors: z.string().array().min(1),
  materials: z.string().min(1),
  sizes: z.string().array().min(1),
  categories: z.string().array().min(1),
  image: z.instanceof(File),
});

export type RegisterProductForm = z.infer<typeof registerProductFormSchema>;
export type RegisterProduct = z.infer<typeof registerProductSchema>;
