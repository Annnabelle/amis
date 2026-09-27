import type {
  CustomsCodeExternalDocumentDto,
  CustomsCodeExternalDto,
  CustomsCodeOrderDto,
} from 'entities/customsCodes/dtos';
import type {
  CustomsCodeExternal,
  CustomsCodeExternalDocument,
  CustomsCodeOrder,
} from 'entities/customsCodes/types';

const mapExternalDocumentDtoToEntity = (
  dto: CustomsCodeExternalDocumentDto
): CustomsCodeExternalDocument => ({
  documentId: dto.documentId,
  documentBase64: dto.documentBase64,
});

const mapExternalDtoToEntity = (dto: CustomsCodeExternalDto): CustomsCodeExternal => ({
  registration: mapExternalDocumentDtoToEntity(dto.registration),
  dissolution: mapExternalDocumentDtoToEntity(dto.dissolution),
});

export const mapCustomsCodeOrderDtoToEntity = (
  dto: CustomsCodeOrderDto
): CustomsCodeOrder => ({
  id: dto.id,
  accOrderNumber: dto.accOrderNumber,
  userId: dto.userId,
  productId: dto.productId,
  orderId: dto.orderId,
  batchId: dto.batchId,
  quantity: dto.quantity,
  customsCode: dto.customsCode,
  measurement: dto.measurement,
  status: dto.status,
  external: mapExternalDtoToEntity(dto.external),
});
