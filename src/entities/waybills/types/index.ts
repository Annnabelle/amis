import type { WaybillResponseDto } from '@edem2000/amis.contracts/api/common/responses';
import type { Paginated } from 'shared/api';

export type Waybill = WaybillResponseDto;

export type WaybillList = Paginated<Waybill>;
