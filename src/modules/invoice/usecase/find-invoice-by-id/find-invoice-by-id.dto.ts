import { z } from "zod";

export const findInvoiceUseCaseInputDtoSchema = z.object({
  id: z.string().uuid(),
});

export type FindInvoiceUseCaseInputDTO = z.infer<typeof findInvoiceUseCaseInputDtoSchema>;

export const findInvoiceUseCaseOutputDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  document: z.string(),
  address: z.object({
    street: z.string(),
    number: z.string(),
    complement: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
  }),
  items: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      price: z.number(),
    })
  ),
  total: z.number(),
  createdAt: z.date(),
});

export type FindInvoiceUseCaseOutputDTO = z.infer<typeof findInvoiceUseCaseOutputDtoSchema>;