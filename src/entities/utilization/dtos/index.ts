import type {ErrorDto, HexString, UtilizationReportExternalStatus, UtilizationReportStatus} from "shared/types/dtos";


export type CreateUtilizationReportDto = {
    orderId: string;
    batchId?: string;
}


export type UtilizationReportResponseDto = {
    id: HexString;
    reportNumber: string;
    userId: HexString;
    companyId: HexString;
    productId: HexString;
    mcOrderId: HexString;

    productGroup: string;
    businessPlaceId: number;
    releaseMethodType: string;

    manufacturerCountry: string,
    productionDate: string,
    expirationDate: string,
    seriesNumber?: string,

    reportId?: string,
    externalStatus?: UtilizationReportExternalStatus | undefined;
    status: UtilizationReportStatus;

    orderedAt: string;
}

export type CreateUtilizationReportResponseDto = {
    success: boolean,
    reports: UtilizationReportResponseDto[]
} | ErrorDto





