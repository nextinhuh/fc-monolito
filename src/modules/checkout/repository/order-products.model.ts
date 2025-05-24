import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { ProductModel } from "../../product-adm/repository/product.model";
import { OrderModel } from "./order.model";

@Table({
  tableName: 'order-products',
  timestamps: false
})
export class OrderProductModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string

  @ForeignKey(() => OrderModel)
  @Column({ allowNull: false })
  orderId: string;

  @ForeignKey(() => ProductModel)
  @Column({ allowNull: false })
  productId: string;

  @BelongsTo(() => OrderModel)
  order: OrderModel;

  @BelongsTo(() => ProductModel)
  product: ProductModel;
}