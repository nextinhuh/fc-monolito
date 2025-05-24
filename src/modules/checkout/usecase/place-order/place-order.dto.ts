import { z } from "zod";

export const placeOrderInputDtoSchema = z.object({
    clientId: z.string(),
    products: z.array(
        z.object({
            productId: z.string(),
        })
    ),
});

export type PlaceOrderInputDto = z.infer<typeof placeOrderInputDtoSchema>;

export const placeOrderOutputDtoSchema = z.object({
    id: z.string(),
    total: z.number(),
    invoiceId: z.string().optional(),
    products: z.array(
        z.object({
            productId: z.string(),
        })
    ),
});

export type PlaceOrderOutputDto = z.infer<typeof placeOrderOutputDtoSchema>;