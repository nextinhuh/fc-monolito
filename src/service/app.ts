import express from 'express'
import { addProductInputDtoSchema } from '../modules/product-adm/usecase/add-product/add-product.dto'
import AddProductUseCase from '../modules/product-adm/usecase/add-product/add-product.usecase'
import ProductRepository from '../modules/product-adm/repository/product.repository'
import sequelize from '../lib/init-sequelize-db'
import ClientRepository from '../modules/client-adm/repository/client.repository'
import AddClientUseCase from '../modules/client-adm/usecase/add-client/add-client.usecase'
import { addClientInputDtoSchema } from '../modules/client-adm/usecase/add-client/add-client.usecase.dto'
import { placeOrderInputDtoSchema } from '../modules/checkout/usecase/place-order/place-order.dto'
import CheckoutRepository from '../modules/checkout/repository/checkout.repository'
import PlaceOrderUseCase from '../modules/checkout/usecase/place-order/place-order-usecase'
import ClientAdmFacadeFactory from '../modules/client-adm/factory/client-adm.facade.factory'
import ProductAdmFacadeFactory from '../modules/product-adm/factory/facade.factory'
import StoreCatalogFacadeFactory from '../modules/store-catalog/factory/facade.factory'
import { exceptionMiddleware } from './exception-middleware'
import InvoiceRepository from '../modules/invoice/repository/invoice.repository'
import FindInvoiceByIdUseCase from '../modules/invoice/usecase/find-invoice-by-id/find-invoice-by-id.usecase'
import Invoice from '../modules/invoice/domain/invoice.entity'
import InvoiceFacadeFactory from '../modules/invoice/factory/invoice.facade.factory'

const app = express()
app.use(express.json())

const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  return Promise.resolve(fn(req, res, next)).catch(next)
}

app.post('/products', asyncHandler(async (req: express.Request, res: express.Response) => {
  const producData = req.body
  const newProduct = addProductInputDtoSchema.safeParse(producData)

  if (!newProduct.success) {
    return res.status(400).json({
      message: 'Invalid product data',
      errors: newProduct.error.errors,
    })
  }

  const productRepository = new ProductRepository()
  const addProductUseCase = new AddProductUseCase(productRepository)
  const productCreated = await addProductUseCase.execute(newProduct.data)

  res.status(201).json(productCreated)
}))

app.post('/clients', asyncHandler(async (req: express.Request, res: express.Response) => {
  const clientData = req.body
  const newClient = addClientInputDtoSchema.safeParse(clientData)

  if (!newClient.success) {
    return res.status(400).json({
      message: 'Invalid client data',
      errors: newClient.error.errors,
    })
  }

  const clientRepository = new ClientRepository()
  const addClientUseCase = new AddClientUseCase(clientRepository)
  const clientCreated = await addClientUseCase.execute(newClient.data)

  res.status(201).json(clientCreated)
}))

app.post('/checkout', asyncHandler(async (req: express.Request, res: express.Response) => {
  const checkoutData = req.body
  const newCheckout = placeOrderInputDtoSchema.safeParse(checkoutData)

  if (!newCheckout.success) {
    return res.status(400).json({
      message: 'Invalid client data',
      errors: newCheckout.error.errors,
    })
  }

  const invoiceFacade = InvoiceFacadeFactory.create()
  const clientFacade = ClientAdmFacadeFactory.create()
  const productFacade = ProductAdmFacadeFactory.create()
  const catalogFacade = StoreCatalogFacadeFactory.create()
  const checkoutRepository = new CheckoutRepository()
  const placeOrderUseCase = new PlaceOrderUseCase(
    invoiceFacade,
    clientFacade,
    productFacade,
    catalogFacade,
    checkoutRepository
  )
  const checkoutCreated = await placeOrderUseCase.execute(newCheckout.data)

  res.status(201).json(checkoutCreated)
}))

app.get('/invoice/:id', asyncHandler(async (req: express.Request, res: express.Response) => {
  if (!req.params.id) {
    return res.status(400).json({ message: 'Invoice ID is required' })
  }

  const invoiceRepository = new InvoiceRepository()
  const findInvoiceByIdUseCase = new FindInvoiceByIdUseCase(invoiceRepository)
  const invoiceFounded = await findInvoiceByIdUseCase.execute({ id: req.params.id })
  res.send(invoiceFounded)
}))

async function initDB(){
  try {
    await sequelize.sync()
    console.log('Database synchronized successfully')
  } catch (error) {
    console.error('Error synchronizing database:', error)
    process.exit(1)
  }
}

async function start() {
  await initDB()
  
  app.listen(3000, () => {
    console.log('App listening on port 3000')
  })
}

app.use(exceptionMiddleware)
start()