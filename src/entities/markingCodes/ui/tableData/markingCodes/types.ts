import type {BatchStatus, ExternalBatchStatus} from "shared/types/dtos";

export interface MarkingCodesTableDataType {
    key: string,
    batchNumber: string;
    orderId: string;
    productId: string;
    batchId: string;
    orderNumber: string;
    isPaid: boolean;
    productName: string;
    totalQuantity: number;
    orderedQuantity: number;
    remainderQuantity: number;
    orderedAt: string;
    packageType: string;
    status: BatchStatus | null;
    externalStatus: ExternalBatchStatus | null
}

export interface BatchTableDataType {
    key: number,
    id: string | undefined,
    batchId: string,
    batchNumber: string;
    productId: string, //needed just for now, should be populated from usecase
    productName: string, //needed just for now, should be populated from usecase
    gtin: string;
    quantity: number;
    packageType: string;
    serialNumberType: string;
    serialNumbers?: string[];
    status?: string
}



