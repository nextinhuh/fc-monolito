import { z } from "zod";

export const addProductInputDtoSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3).max(255),
  description: z.string().min(3).max(255),
  purchasePrice: z.number().positive(),
  stock: z.number().int().nonnegative(),
});

export const addProductOutputDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  purchasePrice: z.number(),
  stock: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AddProductInputDto = z.infer<typeof addProductInputDtoSchema>;
export type AddProductOutputDto = z.infer<typeof addProductOutputDtoSchema>;