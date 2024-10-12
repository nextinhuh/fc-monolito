import { Sequelize } from "sequelize-typescript"
import { InvoiceModel } from "../repository/invoice.model"
import { InvoiceItemsModel } from "../repository/invoice-items.model"
import InvoiceFacadeFactory from "../factory/invoice.facade.factory"
import Address from "../../@shared/domain/value-object/address"
import { GenerateInvoiceFacadeInputDto } from "./invoice.facade.interface"
import Id from "../../@shared/domain/value-object/id.value-object"

describe("Client Adm Facade test", () => {
  
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
    const facade = InvoiceFacadeFactory.create()
    
    const input: GenerateInvoiceFacadeInputDto = {
      name: "Lucian",
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888",
      items: [
        {
          id: "1",
          name: "item 1",
          price: 100
        },
        {
          id: "2",
          name: "item 2",
          price: 200
        }
      ]
    }
    
    const invoiceCreated = await facade.generate(input)
    
    expect(invoiceCreated).toBeDefined()
    expect(invoiceCreated.name).toBe(input.name)
    expect(invoiceCreated.document).toBe(input.document)
    expect(invoiceCreated.street).toBe(input.street)
    expect(invoiceCreated.number).toBe(input.number)
    expect(invoiceCreated.complement).toBe(input.complement)
    expect(invoiceCreated.city).toBe(input.city)
    expect(invoiceCreated.state).toBe(input.state)
    expect(invoiceCreated.zipCode).toBe(input.zipCode)
    expect(invoiceCreated.items).toHaveLength(input.items.length)
  })

  it("should find a invoice", async () => {
    const facade = InvoiceFacadeFactory.create()
    
    const input: GenerateInvoiceFacadeInputDto = {
      name: "Lucian",
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888",
      items: [
        {
          id: "1",
          name: "item 1",
          price: 100
        },
        {
          id: "2",
          name: "item 2",
          price: 200
        }
      ]
    }
    
    const invoiceCreated = await facade.generate(input)
    
    const invoiceFound = await facade.find({
      id: invoiceCreated.id,
    })
    
    expect(invoiceFound).toBeDefined()
    expect(invoiceFound.id).toBe(invoiceFound.id)
    expect(invoiceFound.name).toBe(invoiceFound.name)
    expect(invoiceFound.document).toBe(invoiceFound.document)
    expect(invoiceFound.address.street).toBe(invoiceFound.address.street)
    expect(invoiceFound.address.number).toBe(invoiceFound.address.number)
    expect(invoiceFound.address.complement).toBe(invoiceFound.address.complement)
    expect(invoiceFound.address.city).toBe(invoiceFound.address.city)
    expect(invoiceFound.address.state).toBe(invoiceFound.address.state)
    expect(invoiceFound.address.zipCode).toBe(invoiceFound.address.zipCode)
    expect(invoiceFound.items).toHaveLength(invoiceFound.items.length)
  })
})