import type {ErrorDto, PaginatedResponseDto} from "../../index.ts";

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