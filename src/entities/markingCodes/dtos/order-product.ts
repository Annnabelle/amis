import type {ErrorDto, MarkingCodeState, MarkingCodeStatus, PaginatedResponseDto} from "shared/types/dtos";


export type CodeRowDto = {
    id: string;
    code: string;
    productName: string;
    state: MarkingCodeState;
    status: MarkingCodeStatus;
}


export type GetOrderProductCodesResponseDto = {
    success: boolean;
} & PaginatedResponseDto<CodeRowDto> | ErrorDto;


export type GetBatchCodesParamDto = {
    page: number;
    limit: number;
    orderId: string;
    batchId: string;
}






