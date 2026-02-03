import type {AggregationUnitCodeResponseDto} from "entities/aggregation/dtos/units";
import type {AggregationUnitCodeResponse} from "entities/aggregation/types/units";

export function mapUnitsDtoToEntity(dto: AggregationUnitCodeResponseDto): AggregationUnitCodeResponse {
    return {
        unitId: dto.unitId,
        unitNumber: dto.unitNumber,
        codeNumber: dto.codeNumber,
        code: dto.code,
    }
}



