import type { ErrorDto, HexString, Identifier, PaginatedResponseDto } from "..";

export type OrderProduct = {
    productId: Identifier;
    name: string;
    gtin: string;
    quantity: number;
    cisType: string;
    serialNumberType: string;
}

export type CreateOrderEntityDto = {
    userId: Identifier;
    poNumber: string;
    productGroup: string;
    businessPlaceId: number;
    releaseMethodType: string;
    products: OrderProduct[];
    status: OrderStatus;
    internalStatus: OrderInternalStatus;
    isPaid: boolean;
    orderedAt: Date;
};

export const OrderStatus = {
    Created: "CREATED",
    Pending: "PENDING",
    Ready: "READY",
    Rejected: "REJECTED",
    Closed: "CLOSED",
    Outsourced: "OUTSOURCED",
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export const OrderInternalStatus = {
    Created: 'created',
    PendingExternal: 'pending_external',
    CodesUploaded: 'codes_uploaded',
} as const;

export type OrderInternalStatus = typeof OrderInternalStatus[keyof typeof OrderInternalStatus];

export type OrderListQueryParams = {
    page: number;
    limit: number;
    productId?: string;
    packageType?: string;
    status?: OrderStatus;
}

export type GetOrderListResponseDto = {
    success: boolean;
} & PaginatedResponseDto<OrderListRow> | ErrorDto;

export type OrderListRow = {
    id: string;
    orderNumber: string;
    isPaid: boolean;
    productName: string;
    totalQuantity: number;
    orderedQuantity: number;
    remainderQuantity: number;
    orderedAt: string;
    packageType: string;
    status: OrderStatus;
}


export type OrderResponseDto = {
    id: HexString;
    productGroup: string;
    businessPlaceId: number;
    releaseMethodType: string;
    isPaid: boolean;
    poNumber: string;

    products: {
        productId: HexString;
        name: string;
        gtin: string;
        quantity: number;
        cisType: string;
        serialNumberType: string;
        serialNumbers?: string[] | undefined;
    }[];

    orderId: string | undefined;
    status: OrderStatus | undefined;
    rejectionReason: string | undefined;

    internalStatus: OrderInternalStatus;

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