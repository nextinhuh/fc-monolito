import { z } from "zod"
import Address, { addressSchema } from "../../../@shared/domain/value-object/address"


export interface AddClientInputDtoSchema {
  id?: string
  name: string
  email: string
  document: string
  address: Address
}

export const addClientInputDtoSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3).max(255),
  email: z.string().email(),
  document: z.string().min(11).max(14),
  address: addressSchema,
})

export interface AddClientOutputDtoSchema {
  id: string
  name: string
  email: string
  document: string
  address: Address
  createdAt: Date
  updatedAt: Date
}

export const addClientOutputDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  document: z.string(),
  address: addressSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type AddClientInputDto = z.infer<typeof addClientInputDtoSchema>;
export type AddClientOutputDto = z.infer<typeof addClientOutputDtoSchema>;