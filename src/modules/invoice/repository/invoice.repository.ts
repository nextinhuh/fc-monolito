import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../domain/invoice-item.entity";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceItemsModel } from "./invoice-items.model";
import { InvoiceModel } from "./invoice.model";

export default class invoiceRepository implements InvoiceGateway {
    
    async generate(invoice: Invoice): Promise<Invoice> {
        
        const createdInvoice = await InvoiceModel.create({
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipcode: invoice.address.zipCode,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt
        });
        
        await Promise.all(invoice.items.map(item => {
            return InvoiceItemsModel.create({
                id: item.id.id,
                name: item.name,
                price: item.price,
                invoiceId: createdInvoice.id,
            });
        }));

        return new Invoice({
            id: new Id(createdInvoice.id),
            name: createdInvoice.name,
            document: createdInvoice.document,
            address: new Address(
                createdInvoice.street,
                createdInvoice.number,
                createdInvoice.complement,
                createdInvoice.city,
                createdInvoice.state,
                createdInvoice.zipcode,
            ),
            items: invoice.items,
            createdAt: createdInvoice.createdAt,
            updatedAt: createdInvoice.updatedAt
        });
    }
    
    async find(id: string): Promise<Invoice> {
        
        const invoice = await
        InvoiceModel.findOne({ where: { id }, include: [InvoiceItemsModel] })
        
        if (!invoice) {
            throw new Error("Invoice not found")
        }
        
        return new Invoice({
            id: new Id(invoice.id),
            name: invoice.name,
            document: invoice.document,
            address: new Address(
                invoice.street,
                invoice.number,
                invoice.complement,
                invoice.city,
                invoice.state,
                invoice.zipcode,
            ),
            items: invoice.items.map(item => new InvoiceItem({
                id: new Id(item.id),
                name: item.name,
                price: item.price
            })),
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt
        })
    }
}