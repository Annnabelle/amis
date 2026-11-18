import type { WaybillResponseDto } from '@edem2000/amis.contracts/api/common/responses';

export type Waybill = WaybillResponseDto;

export type WaybillsState = {
  waybills: Waybill[];
  waybillById: Waybill | null;
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  loadingById: boolean;
  error: string | null;
};
