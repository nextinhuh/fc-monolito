import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";
import { GenerateInvoiceUseCaseInputDto } from "./generate-invoice.dto";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const invoice = new Invoice({
    id: new Id("1"),
    name: "Lucian",
    document: "1234-5678",
    address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888",
    ),
    items: [
        new InvoiceItem({
            id: new Id("1"),
            name: "item 1",
            price: 100
        }),
        new InvoiceItem({
            id: new Id("2"),
            name: "item 2",
            price: 200
        })
    ],
});

const MockRepository = () => {
    return {
        generate: jest.fn().mockReturnValue(Promise.resolve(invoice)),
        find: jest.fn()
    }
}

describe("Find Invoice by id use case unit test", () => {
    
    it("should find a invoice", async () => {
        
        const repository = MockRepository()
        const usecase = new GenerateInvoiceUseCase(repository)
        
        const input: GenerateInvoiceUseCaseInputDto = {
            name: "Lucian",
            document: "1234-5678",
            street: "Rua 123",
            number: "99",
            complement: "Casa Verde",
            city: "Criciúma",
            state: "SC",
            zipCode: "88888-888",
            items: [
                {
                    id: "1",
                    name: "item 1",
                    price: 100
                },
                {
                    id: "2",
                    name: "item 2",
                    price: 200
                }
            ]
        }
        
        const result = await usecase.execute(input)
        
        expect(repository.generate).toHaveBeenCalled()
        expect(result.id).toEqual(invoice.id.id)
        expect(result.name).toEqual(invoice.name)
        expect(result.document).toEqual(invoice.document)
        expect(result.street).toEqual(invoice.address.street)
        expect(result.number).toEqual(invoice.address.number)
        expect(result.complement).toEqual(invoice.address.complement)
        expect(result.city).toEqual(invoice.address.city)
        expect(result.state).toEqual(invoice.address.state)
        expect(result.zipCode).toEqual(invoice.address.zipCode)
        expect(result.items.length).toEqual(invoice.items.length)
    })
})