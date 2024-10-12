import InvoiceGateway from "../../gateway/invoice.gateway"
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "./find-invoice-by-id.dto"

export default class FindInvoiceByIdUseCase {
    
    private _invoiceRepository: InvoiceGateway
    
    constructor(invoiceRepository: InvoiceGateway) {
        this._invoiceRepository = invoiceRepository
    }
    
    async execute(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
        
        const result = await this._invoiceRepository.find(input.id)
        
        return {
            id: result.id.id,
            name: result.name,
            document: result.document,
            address: {
                street: result.address.street,
                number: result.address.number,
                complement: result.address.complement,
                city: result.address.city,
                state: result.address.state,
                zipCode: result.address.zipCode
            },
            items: result.items.map(item => ({
                id: item.id.id,
                name: item.name,
                price: item.price
            })),
            total: result.total,
            createdAt: result.createdAt,
        }
    }
    
}