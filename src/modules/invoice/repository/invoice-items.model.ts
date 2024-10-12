import { Column, PrimaryKey, Table, Model, ForeignKey, BelongsTo } from "sequelize-typescript"
import { InvoiceModel } from "./invoice.model";

@Table({
    tableName: 'invoice_item',
    timestamps: false
  })
export class InvoiceItemsModel extends Model {

    @PrimaryKey
    @Column({ allowNull: false })
    id?: string

    @Column({ allowNull: false })
    name: string

    @Column({ allowNull: false })
    price: number

    @ForeignKey(() => InvoiceModel)
    @Column({ allowNull: false })
    invoiceId: number;

    @BelongsTo(() => InvoiceModel)
    invoice: InvoiceModel;

}