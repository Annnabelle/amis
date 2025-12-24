import type { UtilizationReportResponse} from "../../types/utilization";
import type {UtilizationReportResponseDto} from "../../dtos/utilization";

export function mapUtilizationDtoToEntity (dto: UtilizationReportResponseDto): UtilizationReportResponse{
    return {
        id: dto.id,
        reportNumber: dto.reportNumber,
        userId: dto.userId,
        companyId: dto.companyId,
        productId: dto.productId,
        mcOrderId: dto.mcOrderId,

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
    }
}