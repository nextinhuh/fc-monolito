import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../lib/init-sequelize-db';

const API_URL = 'http://localhost:3000';

let productId: string;
let clientId: string;
let invoiceId: string;

describe('Checkout to Invoice E2E Flow', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a product successfully', async () => {
    productId = uuidv4();
    
    const productData = {
      id: productId,
      name: 'Product Test',
      description: 'Product Test Description',
      purchasePrice: 100,
      stock: 10,
      salesPrice: 150
    };

    const response = await request(API_URL)
      .post('/products')
      .send(productData)
      .expect(201);

    expect(response.body).toHaveProperty('id', productId);
    expect(response.body).toHaveProperty('name', 'Product Test');
    expect(response.body).toHaveProperty('description', 'Product Test Description');
    expect(response.body).toHaveProperty('purchasePrice', 100);
  });

  it('should create a client successfully', async () => {
    clientId = uuidv4();
    
    const clientData = {
      id: clientId,
      name: 'Client Test',
      email: 'client@test.com',
      document: '12345678900',
      address: {
        street: 'Test Street',
        number: '123',
        complement: 'Apt 101',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345-678'
      }
    };

    const response = await request(API_URL)
      .post('/clients')
      .send(clientData)
      .expect(201);

    expect(response.body).toHaveProperty('id', clientId);
    expect(response.body).toHaveProperty('name', 'Client Test');
    expect(response.body).toHaveProperty('email', 'client@test.com');
    expect(response.body).toHaveProperty('document', '12345678900');
  });

  it('should create a checkout order and generate an invoice', async () => {
    const checkoutData = {
      clientId: clientId,
      products: [
        { productId: productId }
      ]
    };

    const response = await request(API_URL)
      .post('/checkout')
      .send(checkoutData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('invoiceId');
    expect(response.body).toHaveProperty('total');
    expect(response.body.products).toHaveLength(1);
    expect(response.body.products[0]).toHaveProperty('productId', productId);

    // Salva o ID da fatura para o próximo teste
    invoiceId = response.body.invoiceId;
  });

  it('should find the invoice by ID', async () => {
    const response = await request(API_URL)
      .get(`/invoice/${invoiceId}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', invoiceId);
    expect(response.body).toHaveProperty('name', 'Client Test');
    expect(response.body).toHaveProperty('document', '12345678900');
    expect(response.body).toHaveProperty('address');
    expect(response.body.address).toHaveProperty('street', 'Test Street');
    expect(response.body).toHaveProperty('items');
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0]).toHaveProperty('name', 'Product Test');
    expect(response.body.items[0]).toHaveProperty('price', 100);
  });
});