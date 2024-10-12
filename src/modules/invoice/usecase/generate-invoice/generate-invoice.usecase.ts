import Address from "../../../@shared/domain/value-object/address"
import Id from "../../../@shared/domain/value-object/id.value-object"
import InvoiceItem from "../../domain/invoice-item.entity"
import Invoice from "../../domain/invoice.entity"
import InvoiceGateway from "../../gateway/invoice.gateway"
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.dto"

export default class GenerateInvoiceUseCase {
    
    private _invoiceRepository: InvoiceGateway
    
    constructor(invoiceGateway: InvoiceGateway) {
        this._invoiceRepository = invoiceGateway
    }
    
    async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
        const invoiceCreated = await this._invoiceRepository.generate(new Invoice({
            name: input.name,
            document: input.document,
            address: new Address(
                input.street,
                input.number,
                input.complement,
                input.city,
                input.state,
                input.zipCode
            ),
            items: input.items.map(item => new InvoiceItem({
                id: new Id(item.id),
                name: item.name,
                price: item.price
            })),
        }))
        
        
        return {
            id: invoiceCreated.id.id,
            name: invoiceCreated.name,
            document: invoiceCreated.document,
            street: invoiceCreated.address.street,
            number: invoiceCreated.address.number,
            complement: invoiceCreated.address.complement,
            city: invoiceCreated.address.city,
            state: invoiceCreated.address.state,
            zipCode: invoiceCreated.address.zipCode,
            items: invoiceCreated.items.map(item => ({
                id: item.id.id,
                name: item.name,
                price: item.price
            })),
            total: invoiceCreated.total,
        };
    }
}