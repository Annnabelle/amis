import type {
    BatchResponseDto,
    CreateOrderDto, CreateOrderProducts,
    GetOrderProductResponseDto, OrderBatchPopulatedResponseDto, OrderResponseDto
} from "entities/markingCodes/dtos";
import type {
    BatchResponse,
    CreateOrder,
    OrderBatchPopulatedResponse, OrderProductResponse,
    OrderResponse
} from "entities/markingCodes/types";
import type {ErrorDto} from "shared/types/dtos";
import type {CodeRowDto, GetOrderProductCodesResponseDto} from "entities/markingCodes/dtos/order-product.ts";
import type {CodeRow, GetOrderProductCodesResponse} from "entities/markingCodes/types/order-product.ts";

export function mapMarkingCodesDtoToEntity(dto: OrderBatchPopulatedResponseDto): OrderBatchPopulatedResponse {
    return {
        batchId: dto.batchId,
        batchNumber: dto.batchNumber,
        productId: dto.productId,
        productName: dto.productName,
        totalQuantity: dto.totalQuantity,
        orderedQuantity: dto.orderedQuantity,
        remainderQuantity: dto.remainderQuantity,
        status: dto.status,
        rejectionReason: dto.rejectionReason,
        packageType: dto.packageType,
        orderStatus: dto.orderStatus,
        orderExternalStatus: dto.orderExternalStatus,
        orderId: dto.orderId,
        orderNumber: dto.orderNumber,
        isPaid: dto.isPaid,
        externalStatus: dto.externalStatus,
        orderedAt: dto.orderedAt,
    }
}

export function mapMarkingCodeDtoToEntity (dto: OrderResponseDto): OrderResponse{
    return {
        id: dto.id,
        orderNumber: dto.orderNumber,
        userId: dto.userId,
        batches: dto.batches.map(batch => ({
            id: batch.id,
            batchNumber: batch.batchNumber,
            productId: batch.productId,
            productName: batch.productName,
            gtin: batch.gtin,
            quantity: batch.quantity,
            packageType: batch.packageType,
            serialNumberType: batch.serialNumberType,
            serialNumbers: batch.serialNumbers,
            externalStatus: batch.externalStatus,
            status: batch.status,
        })),
        productGroup: dto.productGroup,
        businessPlaceId: dto.businessPlaceId,
        releaseMethodType: dto.releaseMethodType,
        isPaid: dto.isPaid,
        externalStatus: dto.externalStatus,
        providerOrderId: dto.providerOrderId,
        rejectionReason: dto.rejectionReason,
        status: dto.status,
        orderedAt: dto.orderedAt,
    }
}

export const mapMarkingCodesDtoArrayToEntityArray = (dtos: CreateOrderDto) : CreateOrder => ({
    products: dtos.products.map((product: CreateOrderProducts) => ({
        id: product.id,
        quantity: product.quantity, 
        packageType: product.packageType,
        serialNumberType: product.serialNumberType,
    }))
})

function isErrorDto(
    dto: GetOrderProductResponseDto
): dto is ErrorDto {
    return !('orderProduct' in dto);
}

export function mapGetOrderProductDtoToEntity(
    dto: GetOrderProductResponseDto
): OrderProductResponse {
    if (isErrorDto(dto)) {
        throw new Error("Invalid DTO");
    }

    return {
        id: dto.orderProduct.id,
        orderNumber: dto.orderProduct.orderNumber,
        product: {
            productId: dto.orderProduct.product.productId,
            name: dto.orderProduct.product.name,
            gtin: dto.orderProduct.product.gtin,
            quantity: dto.orderProduct.product.quantity,
            cisType: dto.orderProduct.product.cisType,
            serialNumberType: dto.orderProduct.product.serialNumberType,
            serialNumbers: dto.orderProduct.product.serialNumbers,
        },
        comment: dto.orderProduct.comment,
        turonOrderId: dto.orderProduct.turonOrderId,
        orderedAt: dto.orderProduct.orderedAt,
        rejectionReason: dto.orderProduct.rejectionReason,
    };
}


function isErrorProductDto(
    dto: GetOrderProductCodesResponseDto
): dto is ErrorDto {
    return 'message' in dto;
}

export function mapCodeRowDtoToEntity(dto: CodeRowDto): CodeRow {
    return {
        id: dto.id,
        code: dto.code,
        productName: dto.productName,
        state: dto.state,
        status: dto.status,
    };
}

export function mapGetOrderProductCodesDtoToEntity(
    dto: GetOrderProductCodesResponseDto
): GetOrderProductCodesResponse {
    if (isErrorProductDto(dto)) {
        throw new Error( "Invalid DTO");
    }

    return {
        success: dto.success,
        data: dto.data.map(mapCodeRowDtoToEntity),
        total: dto.total,
        page: dto.page,
        limit: dto.limit,
    };
}

export function mapBatchesDtoToEntity(dto: BatchResponseDto): BatchResponse {
    return {
        id: dto.id,
        batchNumber: dto.batchNumber,
        productId: dto.productId,
        productName: dto.productName,
        quantity: dto.quantity,
        packageType: dto.packageType,
        gtin: dto.gtin,
        status: dto.status,
        externalStatus: dto.externalStatus,
        counters: dto.counters ? {
            received: dto.counters.received,
            total: dto.counters.total,
            left: dto.counters.left,
        }: undefined,
        rejectionReason: dto.rejectionReason,
        order: {
            id: dto.order.id,
            orderNumber: dto.order.orderNumber,
            providerOrderId: dto.order.providerOrderId,
            isPaid: dto.order.isPaid,
            orderedAt: dto.order.orderedAt,
            status: dto.order.status,
            externalStatus: dto.order.externalStatus,
            userId: dto.order.userId,
        },
    }
}










