import type { WaybillResponseDto } from "entities/waybills/dtos";
import type { WaybillResponse } from "entities/waybills/types";

export const mapWaybillDtoToEntity = (
  dto: WaybillResponseDto
): WaybillResponse => dto;
