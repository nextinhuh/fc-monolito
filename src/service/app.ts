import express from 'express'
import { addProductInputDtoSchema } from '../modules/product-adm/usecase/add-product/add-product.dto'
import AddProductUseCase from '../modules/product-adm/usecase/add-product/add-product.usecase'
import ProductRepository from '../modules/product-adm/repository/product.repository'
import sequelize from '../lib/init-sequelize-db'
import ClientRepository from '../modules/client-adm/repository/client.repository'
import AddClientUseCase from '../modules/client-adm/usecase/add-client/add-client.usecase'
import { addClientInputDtoSchema } from '../modules/client-adm/usecase/add-client/add-client.usecase.dto'

const app = express()
app.use(express.json())

app.post('/products', async (req, res) => {
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
})

app.post('/clients', async (req, res) => {
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
})

app.post('/checkout', (req, res) => {
  res.send('hello world')
})

app.get('/invoice/:id', (req, res) => {
  
  res.send('hello world: ' + req.params.id)
})

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

start()

/* Criação de API

Agora que temos todos os usecases, precisamos disponibilizar os endpoints para que possamos 
realizar uma compra.

Disponibilize os seguintes endpoints:

POST /products
POST /clients
POST /checkout/
GET /invoice/<id>

* A linguagem de programação para este desafio é TypeScript

Implemente os testes end-to-end destes endpoints com a lib supertest, 
ao rodar o comando "npm run test" a aplicação deve executar todos os testes. 
Se tiver dúvidas de como usar o supertest acesse o módulo de Clean Arch no módulo Camada de API. */