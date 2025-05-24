import { BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { ClientModel } from "../../client-adm/repository/client.model";
import { OrderProductModel } from "./order-products.model";

@Table({
  tableName: 'orders',
  timestamps: false
})
export class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @ForeignKey(() => ClientModel)
  @Column({ allowNull: false })
  declare clientId: string;

  @BelongsTo(() => ClientModel)
  declare client: ClientModel;

  @HasMany(() => OrderProductModel)
  declare orderProducts: OrderProductModel[];

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;
}