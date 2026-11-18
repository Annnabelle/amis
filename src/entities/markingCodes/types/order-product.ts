import type {MarkingCodeStatus, PaginatedResponseDto} from "shared/types/dtos";


export type GetBatchCodesParams= {
    page: number;
    limit: number;
    orderId: string;
    batchId: string;
}

export type OrderProductCodes = PaginatedResponseDto<OrderProductCode>;

export type OrderProductCode = {
    id: string;
    code: string;
    productName: string;
    status: MarkingCodeStatus;
}


