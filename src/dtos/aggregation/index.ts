import type {
    AggregationReportExternalStatus,
    AggregationReportStatus,
    ErrorDto,
    HexString,
    PaginatedResponseDto
} from "../index.ts";

export type GetAggregationReportsParamsDto = {
    page: number;
    limit: number;
    status?: AggregationReportStatus;
    productId?: string;
    dateFrom?: Date;
    dateTo?: Date;
}

export type CreateAggregationReportDto = {
    documentDate: Date;
    parentOrderId: string;
    parentBatchId?: string;
    childOrderId: string;
    childBatchId?: string;
}

export type AggregationReportResponseDto = {
    id: string;
    utilisationReportId: string | undefined;
    product: {
        id: string;
        name: string;
    },
    parent: {
        orderId: HexString;
        orderNumber: string;
        batchId: HexString;
        batchNumber: string;
    }
    child: {
        orderId: HexString;
        orderNumber: string;
        batchId: HexString;
        batchNumber: string;
    },
    aggregationQuantity: number;
    quantityPerPackage: number;
    productionOrderNumber: string;
    businessPlaceId: number;
    documentDate: Date;
    documentId: string | undefined;
    externalStatus: AggregationReportExternalStatus | undefined;
    status: AggregationReportStatus;
    submittedAt: Date;
    units: {
        id: string;
        aggregationItemsCount: number;
        aggregationUnitCapacity: number;
        codes: string[];
        shouldBeUnbundled: boolean | undefined;
        unitSerialNumber: string;
        state: string; // TODO AggregationUnitState
    }[];
};

export type CreateAggregationReportResponseDto = {
    success: boolean;
    report: AggregationReportResponseDto;
} | ErrorDto;

export type GetAggregationReportsResponse = {
    id: string;
    aggregationNumber: string;
    productName: string;
    parent: {
        orderId: HexString;
        orderNumber: string;
        batchId: HexString;
        batchNumber: string;
    }
    child: {
        orderId: HexString;
        orderNumber: string;
        batchId: HexString;
        batchNumber: string;
    },
    aggregationQuantity: number;
    quantityPerPackage: number;
    submittedAt: Date;
    status: AggregationReportStatus;
}

export type GetAggregationReportsResponseDto = {
    success: boolean;
} & PaginatedResponseDto<GetAggregationReportsResponse> | ErrorDto;