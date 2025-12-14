import type { CreateOrderDto, CreateOrderProducts, CreateOrderResponseDto, OrderListRow, OrderResponseDto } from "../../dtos/markingCodes";
import type { CreateOrder, GetMarkingCodes, OrderResponse } from "../../types/markingCodes";

export const mapMarkingCodesDtoToEntity = (dto: OrderListRow): GetMarkingCodes => ({
    id: dto.id,
    orderNumber: dto.orderNumber,
    productName: dto.productName,
    totalQuantity: dto.totalQuantity,
    orderedQuantity: dto.orderedQuantity,
    remainderQuantity: dto.remainderQuantity,
    orderedAt: dto.orderedAt,
    packageType: dto.packageType,
    isPaid: dto.isPaid,
    status: dto.status,
})

export const mapMarkingCodeDtoToEntity = (dto: OrderResponseDto): OrderResponse => ({
    id: dto.id,
    productGroup: dto.productGroup,
    businessPlaceId: dto.businessPlaceId,
    releaseMethodType: dto.releaseMethodType,
    isPaid: dto.isPaid,
    poNumber: dto.poNumber,
    products: dto.products.map(product => ({
        productId: product.productId,
        name: product.name, 
        gtin: product.gtin,
        quantity: product.quantity,
        cisType: product.cisType,
        serialNumberType: product.serialNumberType, 
        serialNumbers: product.serialNumbers,
    })),
    orderId: dto.orderId,
    status: dto.status,
    rejectionReason: dto.rejectionReason,
    internalStatus: dto.internalStatus,
    orderedAt: dto.orderedAt,
});

export const mapMarkingCodesDtoArrayToEntityArray = (dtos: CreateOrderDto) : CreateOrder => ({
    products: dtos.products.map((product: CreateOrderProducts) => ({
        id: product.id,
        quantity: product.quantity, 
        packageType: product.packageType,
        serialNumberType: product.serialNumberType,
    }))
})