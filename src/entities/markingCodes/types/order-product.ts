import type {ErrorDto, MarkingCodeState, MarkingCodeStatus, PaginatedResponseDto} from "shared/types/dtos";


export type GetBatchCodesParams= {
    page: number;
    limit: number;
    orderId: string;
    batchId: string;
}

export type GetOrderProductCodesResponse = {
    success: boolean;
} & PaginatedResponseDto<CodeRow> | ErrorDto;

export type CodeRow = {
    id: string;
    code: string;
    productName: string;
    state: MarkingCodeState;
    status: MarkingCodeStatus;
}



