import type { UtilizationReport } from "entities/utilization/types";
import type { UtilizationReportResponseDto } from '@edem2000/amis.contracts/api/common/responses';
import type { CreateUtilizationReportResponseDto } from '@edem2000/amis.contracts/api/reports/responses';
import type {ErrorDto} from "shared/types/dtos";

// твой существующий маппер для одного отчёта
export function mapUtilizationDtoToEntity(dto: UtilizationReportResponseDto): UtilizationReport {
    return {
        id: dto.id as string,
        reportNumber: dto.reportNumber,
        userId: dto.userId as string,
        companyId: dto.companyId as string,
        productId: dto.productId as string,
        mcOrderId: dto.mcOrderId as string,

        productGroup: dto.productGroup,
        businessPlaceId: dto.businessPlaceId,
        releaseMethodType: dto.releaseMethodType,

        manufacturerCountry: dto.manufacturerCountry,
        productionDate: dto.productionDate,
        expirationDate: dto.expirationDate,
        seriesNumber: dto.seriesNumber,

        reportId: dto.reportId,
        externalStatus: dto.externalStatus,
        status: dto.status,
        orderedAt: dto.orderedAt,
    };
}

// маппер для всего ответа
export function mapCreateUtilizationReportResponse(
    dto: CreateUtilizationReportResponseDto
): { success: boolean; reports?: UtilizationReport[]; error?: ErrorDto } {
    // если dto содержит поле errorCode или errorMessage, считаем это ошибкой
    if ('errorCode' in dto || 'errorMessage' in dto) {
        return { success: false, error: dto as ErrorDto };
    }

    // иначе это успешный ответ с репортами
    return {
        success: dto.success,
        reports: dto.reports.map(mapUtilizationDtoToEntity),
    };
}




