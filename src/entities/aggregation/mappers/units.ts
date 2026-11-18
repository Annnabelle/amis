import type { AggregationUnitCodeResponseDto } from '@edem2000/amis.contracts/api/reports/responses';
import type {AggregationUnitCode} from "entities/aggregation/types/units";

export function mapUnitsDtoToEntity(dto: AggregationUnitCodeResponseDto): AggregationUnitCode {
    return {
        unitId: dto.unitId,
        unitNumber: dto.unitNumber,
        unitSerialNumber: dto.unitSerialNumber,
        codeNumber: dto.codeNumber,
        code: dto.code,
    }
}



