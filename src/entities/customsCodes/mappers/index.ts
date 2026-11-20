import type {
  AggregatedCustomsCodeExternalResponseDto,
  AggregatedCustomsCodeOrderResponseDto,
  AggregatedCustomsCodeProcessingResponseDto,
  DocumentInfoResponseDto,
} from '@edem2000/amis.contracts/api/common/responses';
import type {
  CustomsCodeExternal,
  CustomsCodeExternalDocument,
  CustomsCodeOrder,
  CustomsCodeProcessing,
} from 'entities/customsCodes/types';

const mapExternalDocumentDtoToEntity = (
  dto: DocumentInfoResponseDto
): CustomsCodeExternalDocument => ({
  documentId: dto.documentId ?? null,
  documentBase64: dto.documentBase64 ?? null,
});

const mapExternalDtoToEntity = (dto: AggregatedCustomsCodeExternalResponseDto): CustomsCodeExternal => ({
  registration: mapExternalDocumentDtoToEntity(dto.registration ?? {}),
  dissolution: mapExternalDocumentDtoToEntity(dto.dissolution ?? {}),
});

const mapProcessingDtoToEntity = (
  dto: AggregatedCustomsCodeProcessingResponseDto
): CustomsCodeProcessing => ({
  jobType: dto.jobType,
  jobStatus: dto.jobStatus,
  failureReason: dto.failureReason ?? null,
  attempts: dto.attempts,
  maxAttempts: dto.maxAttempts,
  runAt: dto.runAt,
  lastError: dto.lastError ?? null,
});

export const mapCustomsCodeOrderDtoToEntity = (
  dto: AggregatedCustomsCodeOrderResponseDto
): CustomsCodeOrder => ({
  id: dto.id,
  accOrderNumber: dto.accOrderNumber,
  userId: dto.userId,
  productId: dto.productId,
  orderId: dto.orderId,
  batchId: dto.batchId,
  quantity: dto.quantity,
  customsCode: dto.customsCode ?? null,
  product: dto.product ?? null,
  measurement: dto.measurement ?? null,
  status: dto.status,
  external: mapExternalDtoToEntity(dto.external),
  processing: dto.processing ? mapProcessingDtoToEntity(dto.processing) : null,
});
