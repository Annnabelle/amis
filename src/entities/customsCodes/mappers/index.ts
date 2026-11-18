import type { AggregatedCustomsCodeExternalResponseDto, AggregatedCustomsCodeOrderResponseDto, DocumentInfoResponseDto } from '@edem2000/amis.contracts/api/common/responses';
import type {
  CustomsCodeExternal,
  CustomsCodeExternalDocument,
  CustomsCodeOrder,
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
  measurement: dto.measurement ?? null,
  status: dto.status,
  external: mapExternalDtoToEntity(dto.external),
});
