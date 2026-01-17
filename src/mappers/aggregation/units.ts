import type {AggregationUnitCodeResponseDto} from "../../dtos/aggregation/units";
import type {AggregationUnitCodeResponse} from "../../types/aggregation/units";

export function mapUnitsDtoToEntity(dto: AggregationUnitCodeResponseDto): AggregationUnitCodeResponse {
    return {
        unitId: dto.unitId,
        unitNumber: dto.unitNumber,
        codeNumber: dto.codeNumber,
        code: dto.code,
    }
}