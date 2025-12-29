import type {BatchStatus, ErrorDto, ExternalBatchStatus, ExternalOrderStatus, HexString} from "../../dtos";

export const OrderStatusType = {
    New: "new",
    VendorPending: 'vendor_pending',
    ReadyForCodes: 'ready_for_codes',
    CodesReceived: 'codes_received',
    CodesUtilizationRequested: 'codes_utilization_requested',
    CodesPartiallyUtilized: 'codes_partially_utilized',
    CodesUtilized: 'codes_utilized',
    CodesPartiallyAggregated: 'codes_partially_aggregated',
    CodesAggregated: 'codes_aggregated',
    Rejected: 'rejected',
    Closed: 'closed',
} as const;

export type OrderStatus = typeof OrderStatusType[keyof typeof OrderStatusType];

export const OrderInternalStatusType = {
    Created: 'created',
    Rejected: 'rejected',
    PendingExternal: 'pending_external',
    ReadyForCodes: 'ready_for_codes',
    CodesUploaded: 'codes_uploaded',
} as const;

export type OrderInternalStatus = typeof OrderInternalStatusType[keyof typeof OrderInternalStatusType];

export type OrderResponse = {
    id: HexString;
    orderNumber: string;
    userId: HexString; //needed just for now, should be populated from usecase

    batches: {
        id: HexString;
        batchNumber: string;
        productId: HexString, //needed just for now, should be populated from usecase
        productName: string, //needed just for now, should be populated from usecase
        gtin: string;
        quantity: number;
        packageType: string;
        serialNumberType: string;
        serialNumbers?: string[];
        status: BatchStatus,
        externalStatus: ExternalBatchStatus | null,
    }[],

    productGroup: string;
    businessPlaceId: number;
    releaseMethodType: string;
    isPaid: boolean;

    externalStatus: ExternalOrderStatus | undefined;
    providerOrderId: string | undefined;
    rejectionReason: string | undefined;

    status: OrderStatus;
    orderedAt: Date;
}

export type CreateOrderProducts = {
    id: HexString;
    quantity: number;
    packageType: string;
    serialNumberType: string;
}

export type CreateOrder = {
    products: CreateOrderProducts[];
}

export type OrderBatchPopulatedResponse = {
    batchId: HexString;
    batchNumber: string;
    productId: HexString;
    productName: string;
    totalQuantity: number;
    orderedQuantity: number;
    remainderQuantity: number;
    packageType: string;
    status: BatchStatus,
    externalStatus: ExternalBatchStatus | null,
    counters?: {
        received: number;
        total: number;
        left: number;
    };
    rejectionReason?: string;

    // order details
    orderId: HexString;
    orderNumber: string;
    isPaid: boolean;
    orderStatus: OrderStatus;
    orderExternalStatus: ExternalOrderStatus;
    orderedAt: string; // Date.toISOString()
}

export type GetOrderProductResponse = {
    success: boolean;
    orderProduct: {
        id: HexString;
        orderNumber: string;
        product: {
            productId: HexString;
            name: string;
            gtin: string;
            quantity: number;
            cisType: string;
            serialNumberType: string;
            serialNumbers?: string[] | undefined;
        };
        comment: string;
        turonOrderId: string | undefined;
        orderedAt: Date;
        rejectionReason: string | undefined;
    };
} | ErrorDto;

export type OrderProductResponse = {
    id: HexString;
    orderNumber: string;
    product: {
        productId: HexString;
        name: string;
        gtin: string;
        quantity: number;
        cisType: string;
        serialNumberType: string;
        serialNumbers?: string[] | undefined;
    };
    comment: string;
    turonOrderId: string | undefined;
    orderedAt: Date;
    rejectionReason: string | undefined;
}

export type BatchResponse = {
    id: HexString;
    batchNumber: string;
    productId: HexString;
    productName: string;
    quantity: number;
    packageType: string;
    gtin: string;
    status: BatchStatus;
    externalStatus: ExternalBatchStatus | null;
    counters?: {
        received: number;
        total: number;
        left: number;
    };
    rejectionReason?: string;
    order: {
        id: HexString;
        orderNumber: string;
        providerOrderId?: string;
        isPaid: boolean;
        orderedAt: string;
        status: OrderStatus;
        externalStatus?: ExternalOrderStatus;
        userId: HexString;
    };
}