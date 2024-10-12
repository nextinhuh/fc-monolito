import { InvoiceModel } from "./invoice.model"
import { InvoiceItemsModel } from "./invoice-items.model"
import { Sequelize } from "sequelize-typescript"
import InvoiceRepository from "./invoice.repository"
import Invoice from "../domain/invoice.entity"
import Id from "../../@shared/domain/value-object/id.value-object"
import Address from "../../@shared/domain/value-object/address"
import InvoiceItem from "../domain/invoice-item.entity"

describe("Client Repository test", () => {
    
    let sequelize: Sequelize
    
    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        })
        
        sequelize.addModels([InvoiceModel, InvoiceItemsModel])
        await sequelize.sync()
    })
    
    afterEach(async () => {
        await sequelize.close()
    })
    
    it("should create a invoice", async () => {
        const invoice = new Invoice({
            id: new Id("1"),
            name: "Lucian",
            document: "1234-5678",
            address: new Address(
                "Rua 123",
                "99",
                "Casa Verde",
                "Criciúma",
                "SC",
                "88888-888"
            ),
            items: [
                new InvoiceItem({
                    id: new Id("1"),
                    name: "item 1",
                    price: 100
                }),
                new InvoiceItem({
                    id: new Id("2"),
                    name: "item 2",
                    price: 200
                })
            ]
        })
        
        const repository = new InvoiceRepository()
        await repository.generate(invoice)

        const invoiceDb = await InvoiceModel.findOne({ where: { id: "1" }, include: [InvoiceItemsModel] })

        expect(invoiceDb).toBeDefined()
        expect(invoiceDb.id).toEqual(invoice.id.id)
        expect(invoiceDb.name).toEqual(invoice.name)
        expect(invoiceDb.document).toEqual(invoice.document)
        expect(invoiceDb.street).toEqual(invoice.address.street)
        expect(invoiceDb.number).toEqual(invoice.address.number)
        expect(invoiceDb.complement).toEqual(invoice.address.complement)
        expect(invoiceDb.city).toEqual(invoice.address.city)
        expect(invoiceDb.state).toEqual(invoice.address.state)
        expect(invoiceDb.zipcode).toEqual(invoice.address.zipCode)
        expect(invoiceDb.items.length).toEqual(2)
        expect(invoiceDb.createdAt).toStrictEqual(invoice.createdAt)
        expect(invoiceDb.updatedAt).toStrictEqual(invoice.updatedAt)
    })

    it("should find a invoice", async () => {
        const invoice = new Invoice({
            id: new Id("1"),
            name: "Lucian",
            document: "1234-5678",
            address: new Address(
                "Rua 123",
                "99",
                "Casa Verde",
                "Criciúma",
                "SC",
                "88888-888"
            ),
            items: [
                new InvoiceItem({
                    id: new Id("1"),
                    name: "item 1",
                    price: 100
                }),
                new InvoiceItem({
                    id: new Id("2"),
                    name: "item 2",
                    price: 200
                })
            ]
        })

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
        
        const repository = new InvoiceRepository()
        const invoiceFinded = await repository.find(invoice.id.id)

        expect(invoiceFinded).toBeDefined()
        expect(invoiceFinded.id.id).toEqual(invoice.id.id)
        expect(invoiceFinded.name).toEqual(invoice.name)
        expect(invoiceFinded.document).toEqual(invoice.document)
        expect(invoiceFinded.address.street).toEqual(invoice.address.street)
        expect(invoiceFinded.address.number).toEqual(invoice.address.number)
        expect(invoiceFinded.address.complement).toEqual(invoice.address.complement)
        expect(invoiceFinded.address.city).toEqual(invoice.address.city)
        expect(invoiceFinded.address.state).toEqual(invoice.address.state)
        expect(invoiceFinded.address.zipCode).toEqual(invoice.address.zipCode)
        expect(invoiceFinded.items.length).toEqual(2)
        expect(invoiceFinded.createdAt).toStrictEqual(invoice.createdAt)
        expect(invoiceFinded.updatedAt).toStrictEqual(invoice.updatedAt)
    })
    
})