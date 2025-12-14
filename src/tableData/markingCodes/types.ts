import type { OrderStatus } from "../../dtos/markingCodes";

export interface MarkingCodesTableDataType {
    key: string,
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

export interface MarkingCodeTableDataType {
    key: string,
    productId: string,
    name: string,
    gtin: string,
    quantity: number,
    cisType: string,
    serialNumberType: string,
    serialNumbers: string
}