import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceByIdUseCase from "../usecase/find-invoice-by-id/find-invoice-by-id.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";

export default class InvoiceFacadeFactory {
    static create() {
        const repository = new InvoiceRepository();
        const findUsecase = new FindInvoiceByIdUseCase(repository);
        const generateUsecase = new GenerateInvoiceUseCase(repository);
        const facade = new InvoiceFacade({
            findUsecase: findUsecase,
            generateUsecase: generateUsecase,
        });
        
        return facade;
    }
}