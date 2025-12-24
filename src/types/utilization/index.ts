import type {HexString, UtilizationReportExternalStatus, UtilizationReportStatus} from "../../dtos";

export type CreateUtilizationReport = {
    orderId: string;
    batchId?: string;
}


export type UtilizationReportResponse = {
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