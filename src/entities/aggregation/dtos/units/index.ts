import type {ErrorDto, PaginatedResponseDto} from "shared/types/dtos";

export type GetAggregationReportUnitsResponseDto = {
    success: boolean;
} & PaginatedResponseDto<AggregationUnitCodeResponseDto> | ErrorDto;

export type AggregationUnitCodeResponseDto = {
    unitId: string;
    unitNumber: number;
    codeNumber: number;
    code: string;
    // state: AggregationUnitState;
}






