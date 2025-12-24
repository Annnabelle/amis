import type {
    BatchStatus, ErrorDto, ExternalBatchStatus,
    ExternalOrderStatus, HexString, Identifier, PaginatedResponseDto
} from "..";

export type OrderProduct = {
    id?: Identifier;
    batchNumber: string;
    productId: Identifier;
    name: string;
    gtin: string;
    quantity: number;
    cisType: string;
    serialNumberType: string;
    serialNumbers?: string[];
}

export type CreateOrderEntityDto = {
    userId: Identifier;
    poNumber: string;
    productGroup: string;
    businessPlaceId: number;
    releaseMethodType: string;
    products: OrderProduct[];
    internalStatus: OrderInternalStatus;
    isPaid: boolean;
    orderedAt: Date;
};

export const OrderStatus = {
    New: "new",
    VendorPending: 'vendor_pending',
    ReadyForCodes: 'ready_for_codes',
    CodesReceived: 'codes_received',
    CodesUtilized: 'codes_utilized',
    Rejected: 'rejected',
    Closed: 'closed',
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export const OrderInternalStatus = {
    Created: 'created',
    Rejected: 'rejected',
    PendingExternal: 'pending_external',
    ReadyForCodes: 'ready_for_codes',
    CodesUploaded: 'codes_uploaded',
} as const;

export type OrderInternalStatus = typeof OrderInternalStatus[keyof typeof OrderInternalStatus];

export type OrderListQueryParams = {
    page: number;
    limit: number;
    userId?: string;
    productId?: string;
    packageType?: string;
    companyId?: string;
    status?: OrderStatus;
}

export type OrderBatchPopulatedResponseDto = {
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

export type GetOrderListResponseDto = {
    success: boolean;
} & PaginatedResponseDto<OrderBatchPopulatedResponseDto> | ErrorDto;

export type OrderResponseDto = {
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

export type GetOrderResponseDto = {
    success: boolean;
    order: OrderResponseDto;
} | ErrorDto;

export type GetOrderDto = {
    id: string;
}

export type CreateOrderProducts = {
    id: HexString;
    quantity: number;
    packageType: string;
    serialNumberType: string;
}

export type CreateOrderDto = {
    products: CreateOrderProducts[];
}

export type CreateOrderResponseDto = {
    success: boolean,
    order: OrderResponseDto
} | ErrorDto

export type GetOrderProductDto = {
    orderId: string;
    orderProductId: string;
}

export type GetOrderProductResponseDto = {
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

export type GetBatchDto = {
    orderId: string;
    batchId: string;
}

export type GetBatchResponseDto = {
    success: boolean;
    batch: BatchResponseDto;
} | ErrorDto;

export type BatchResponseDto = {
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
        orderedAt: string; // ISO 8601
        status: OrderStatus;
        externalStatus?: ExternalOrderStatus;
        userId: HexString;
    };
}