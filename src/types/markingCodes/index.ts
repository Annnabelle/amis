import type { HexString } from "../../dtos";
import type { OrderInternalStatus } from "../../dtos/markingCodes";

export const OrderStatus = {
    Created: "CREATED",
    Pending: "PENDING",
    Ready: "READY",
    Rejected: "REJECTED",
    Closed: "CLOSED",
    Outsourced: "OUTSOURCED",
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export type GetMarkingCodes = {
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

export type OrderResponse = {
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

export type CreateOrderProducts = {
    id: HexString;
    quantity: number;
    packageType: string;
    serialNumberType: string;
}

export type CreateOrder = {
    products: CreateOrderProducts[];
}