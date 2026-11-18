import type { WaybillResponseDto } from '@edem2000/amis.contracts/api/common/responses';
import type { Waybill } from "entities/waybills/types";

export const mapWaybillDtoToEntity = (
  dto: WaybillResponseDto
): Waybill => dto;
