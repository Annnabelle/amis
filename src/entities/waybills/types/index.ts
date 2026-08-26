import type { WaybillResponseDto } from "entities/waybills/dtos";

export type WaybillResponse = WaybillResponseDto;

export type WaybillsState = {
  waybills: WaybillResponse[];
  waybillById: WaybillResponse | null;
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  loadingById: boolean;
  error: string | null;
};
