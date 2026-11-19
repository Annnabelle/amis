import type { UtilizationReport } from "entities/utilization/types";
import type { UtilizationReportResponseDto } from '@edem2000/amis.contracts/api/common/responses';

// маппер одного отчёта; ветку ошибки разбирает axiosBaseQuery
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
