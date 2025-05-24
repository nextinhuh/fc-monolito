
import { CustomException } from "../../../../lib/custom-exception";
import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import InvoiceFacade from "../../../invoice/facade/invoice.facade";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacade from "../../../store-catalog/facade/store-catalog.facade";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
  private _invoiceFacade: InvoiceFacade;
  private _clientFacade: ClientAdmFacadeInterface;
  private _productFacade: ProductAdmFacadeInterface;
  private _catalogFacade: StoreCatalogFacade;
  private _repository: CheckoutGateway;

  constructor(
    invoiceFacade: InvoiceFacade,
    clientFacade: ClientAdmFacadeInterface,
    productFacade: ProductAdmFacadeInterface,
    catalogFacade: StoreCatalogFacade,
    repository: CheckoutGateway
  ) {
    this._invoiceFacade = invoiceFacade;
    this._clientFacade = clientFacade;
    this._productFacade = productFacade;
    this._catalogFacade = catalogFacade;
    this._repository = repository;
  }

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    const client = await this._clientFacade.find({ id: input.clientId });
    await this.validateProducts(input);

    const products = await Promise.all(
      input.products.map((p) => {
        return this.getProduct(p.productId);
      })
    );

    const myClient = new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      address: client.address,
    });

    const order = new Order({
      client: myClient,
      products: products,
    });

    this._repository.addOrder(order);
    const invoiceCreated = await this._invoiceFacade.generate({
      name: myClient.name,
      document: client.document,
      street: myClient.address.street,
      number: myClient.address.number,
      complement: myClient.address.complement,
      city: myClient.address.city,
      state: myClient.address.state,
      zipCode: myClient.address.zipCode,
      items: order.products.map((p) => ({
        id: p.id.id,
        name: p.name,
        price: p.salesPrice,
      })),
    })

    return {
      id: order.id.id,
      total: invoiceCreated.total,
      invoiceId: invoiceCreated.id,
      products: order.products.map((p) => {
        return {
          productId: p.id.id,
        };
      }),
    };
  }

  private async validateProducts(input: PlaceOrderInputDto) {
    if (input.products.length === 0) {
      throw new CustomException("No products selected", 400);
    }

    for (const p of input.products) {
      const product = await this._productFacade.checkStock({
        productId: p.productId,
      });
      if (product.stock <= 0) {
        throw new CustomException(`Product ${product.productId} is not available in stock`, 400);
      }
    }
  }

  private async getProduct(productId: string): Promise<Product> {
    const product = await this._catalogFacade.find({ id: productId });
    
    const productProps = {
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    };
    const myProduct = new Product(productProps);
    return myProduct;
  }
}