import type { AggregationReportResponseDto } from '@edem2000/amis.contracts/api/common/responses';
import type { CreateAggregationReportDto } from '@edem2000/amis.contracts/api/reports/requests';
import type { GetAggregationReportsResponse } from '@edem2000/amis.contracts/api/reports/responses';
import type {
    AggregationReport,
    CreateAggregationReport,
    GetAggregationReportsResponseTypes
} from "entities/aggregation/types";

export function mapAggregationListDtoToEntity (dto: AggregationReportResponseDto): AggregationReport{
    return {
        id: dto.id,
        utilisationReportId: dto.utilisationReportId,
        product: {
            id: dto.product.id,
            name: dto.product.name
        },
        parent: {
            orderId: dto.parent.orderId,
            orderNumber: dto.parent.orderNumber,
            batchId: dto.parent.batchId,
            batchNumber: dto.parent.batchNumber
        },
        child: {
            orderId: dto.child.orderId,
            orderNumber: dto.child.orderNumber,
            batchId: dto.child.batchId,
            batchNumber: dto.child.batchNumber
        },
        aggregationQuantity: dto.aggregationQuantity,
        quantityPerPackage: dto.quantityPerPackage,
        productionOrderNumber: dto.productionOrderNumber,
        businessPlaceId: dto.businessPlaceId,
        documentDate: new Date(dto.documentDate),
        documentId: dto.documentId,
        externalStatus: dto.externalStatus,
        status: dto.status,
        submittedAt: new Date(dto.submittedAt),
    }
}

export function mapGetAggregationDtoToEntity (dto: GetAggregationReportsResponse): GetAggregationReportsResponseTypes{
    return {
        id: dto.id,
        aggregationNumber: dto.aggregationNumber,
        productName: dto.productName,
        parent: {
            orderId: dto.parent.orderId,
            orderNumber: dto.parent.orderNumber,
            batchId: dto.parent.batchId,
            batchNumber: dto.parent.batchNumber,
        },
        child: {
            orderId: dto.child.orderId,
            orderNumber: dto.child.orderNumber,
            batchId: dto.child.batchId,
            batchNumber: dto.child.batchNumber
        },
        aggregationQuantity: dto.aggregationQuantity,
        quantityPerPackage: dto.quantityPerPackage,
        submittedAt: new Date(dto.submittedAt),
        status: dto.status,
    }
}

export function mapCreateAggregationToCreateAggregationDto (dto: CreateAggregationReport): CreateAggregationReportDto{
    return {
        documentDate: dto.documentDate.toISOString(),
        parentOrderId: dto.parentOrderId,
        parentBatchId: dto.parentBatchId,
        childBatchId: dto.childBatchId,
        childOrderId: dto.childOrderId,
    }
}




