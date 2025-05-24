import { Sequelize } from 'sequelize-typescript'
import { ProductModel } from '../modules/product-adm/repository/product.model'
import TransactionModel from '../modules/payment/repository/transaction.model'
import { InvoiceModel } from '../modules/invoice/repository/invoice.model'
import { ClientModel } from '../modules/client-adm/repository/client.model'
import { InvoiceItemsModel } from '../modules/invoice/repository/invoice-items.model'
import { OrderModel } from '../modules/checkout/repository/order.model'
import { OrderProductModel } from '../modules/checkout/repository/order-products.model'

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false,
  sync: { force: true },
})

sequelize.addModels([
    ProductModel, 
    TransactionModel, 
    InvoiceModel,
    InvoiceItemsModel,
    ClientModel,
    OrderModel,
    OrderProductModel
])

export default sequelize