import { Sequelize } from "sequelize-typescript"
import { OrderModel } from "./order.model"
import { OrderProductModel } from "./order-products.model"
import { ProductModel } from "../../product-adm/repository/product.model"
import CheckoutRepository from "./checkout.repository"
import Id from "../../@shared/domain/value-object/id.value-object"
import Address from "../../@shared/domain/value-object/address"
import Client from "../domain/client.entity"
import Product from "../domain/product.entity"
import Order from "../domain/order.entity"
import { ClientModel } from "../../client-adm/repository/client.model"

describe("Checkout Repository test", () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([OrderModel, OrderProductModel, ProductModel, ClientModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it("should create an order", async () => {
    await ClientModel.create({
      id: "1",
      name: "Client 1",
      email: "client@example.com",
      document: "123456",
      street: "Street 1",
      number: "123",
      complement: "Complement",
      city: "City",
      state: "State",
      zipcode: "12345-678",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const client = new Client({
      id: new Id("1"),
      name: "Client 1",
      email: "client@example.com",
      address: new Address(
        "Street 1",
        "123",
        "Complement",
        "City",
        "State",
        "12345-678"
      )
    })

    const product = new Product({
      id: new Id("1"),
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 100
    })

    const order = new Order({
      id: new Id("1"),
      client: client,
      products: [product]
    })

    const repository = new CheckoutRepository()
    await repository.addOrder(order)

    const orderDb = await OrderModel.findOne({ 
      where: { id: "1" },
      include: [{
        model: OrderProductModel,
        include: ["product"]
      }]
    })

    expect(orderDb).toBeDefined()
    expect(orderDb.id).toBe(order.id.id)
    expect(orderDb.clientId).toBe(client.id.id)
    expect(orderDb.orderProducts).toHaveLength(1)
    expect(orderDb.orderProducts[0].productId).toBe(product.id.id)
  })

  it("should find an order", async () => {
    await ClientModel.create({
      id: "1",
      name: "Client 1",
      email: "client@example.com",
      document: "123456",
      street: "Street 1",
      number: "123",
      complement: "Complement",
      city: "City",
      state: "State",
      zipcode: "12345-678",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const client = new Client({
      id: new Id("1"),
      name: "Client 1",
      email: "client@example.com",
      address: new Address(
        "Street 1",
        "123",
        "Complement",
        "City",
        "State",
        "12345-678"
      )
    })

    const product = new Product({
      id: new Id("1"),
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 100
    })

    const order = new Order({
      id: new Id("1"),
      client: client,
      products: [product]
    })

    const repository = new CheckoutRepository()
    await repository.addOrder(order)
    const result = await repository.findOrder("1")

    expect(result).toBeDefined()
    expect(result.id.id).toBe(order.id.id)
    expect(result.client.id.id).toBe(client.id.id)
    expect(result.client.name).toBe(client.name)
    expect(result.client.email).toBe(client.email)
    expect(result.client.address.street).toBe(client.address.street)
    expect(result.client.address.number).toBe(client.address.number)
    expect(result.client.address.complement).toBe(client.address.complement)
    expect(result.client.address.city).toBe(client.address.city)
    expect(result.client.address.state).toBe(client.address.state)
    expect(result.client.address.zipCode).toBe(client.address.zipCode)
    expect(result.products).toBeDefined()
    expect(result.products).toHaveLength(1)
    expect(result.products[0].id.id).toBe(product.id.id)
  })
})