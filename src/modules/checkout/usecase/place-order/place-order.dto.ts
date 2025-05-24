import e from "express";

export interface PlaceOrderInputDto {
    clientId: string;
    products: {
        productId: string;
    }[];
}

export const placeOrderInputDtoSchema = {
    clientId: String,
    products: Array({
        productId: String,
    }),
};

export type PlaceOrderInputDtoSchema = typeof placeOrderInputDtoSchema;

export interface PlaceOrderOutputDto {
    id: string;
    total: number;
    products: {
        productId: string;
    }[];
}

export const placeOrderOutputDtoSchema = {
    id: String,
    total: Number,
    products: Array({
        productId: String,
    }),
};
export type PlaceOrderOutputDtoSchema = typeof placeOrderOutputDtoSchema;