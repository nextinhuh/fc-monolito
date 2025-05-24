import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Order from "../domain/order.entity";
import { OrderModel } from "./order.model";
import CheckoutGateway from "../gateway/checkout.gateway";
import { OrderProductModel } from "./order-products.model";
import Product from "../domain/product.entity";
import Client from "../domain/client.entity";
import { v4 } from "uuid";

export default class CheckoutRepository implements CheckoutGateway {
  
  async addOrder(entity: Order): Promise<void> {
    const orderCreated = await OrderModel.create({
      id: entity.id.id,
      clientId: entity.client.id.id,
      client: entity.client,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    })
    
    const orderProducts = entity.products.map(product => ({
      id: v4(),
      orderId: orderCreated.id,
      productId: product.id.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    }));
    
    await OrderProductModel.bulkCreate(orderProducts);
  }
  
  async findOrder(id: string): Promise<Order | null> {
    const orderModel = await OrderModel.findOne({ 
      where: { id },
      include: [
        {
          model: OrderProductModel,
          include: ["product"]
        },
        "client"
      ]
    });
    
    if (!orderModel) {
      return null;
    }
    
    const products: Product[] = orderModel.orderProducts?.map((orderProduct) => 
      new Product({
      id: new Id(orderProduct.productId),
      name: orderProduct.product.name,
      description: orderProduct.product.description,
      salesPrice: orderProduct.product.purchasePrice
    })
  ) || [];
  
  return new Order({
    id: new Id(orderModel.id),
    client: new Client({
      id: new Id(orderModel.client.id),
      name: orderModel.client.name,
      email: orderModel.client.email,
      address: new Address(
        orderModel.client.street,
        orderModel.client.number,
        orderModel.client.complement,
        orderModel.client.city,
        orderModel.client.state,
        orderModel.client.zipcode
      )
    }),
    products: products
  });
}
}