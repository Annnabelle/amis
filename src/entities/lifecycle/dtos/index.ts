import type { ErrorDto } from "shared/types/dtos";
import type {
  LifecycleActiveError,
  LifecycleEvent,
  LifecycleEventKind,
  LifecycleScope,
  LifecycleTab,
  LifecycleVendor,
} from "entities/lifecycle/types";

export type LifecycleEventResponseDto = LifecycleEvent;

export type GetLifecycleEventsDto = {
  targetId: string;
  scope?: LifecycleScope;
  vendor?: LifecycleVendor;
  kind?: LifecycleEventKind;
  asOf?: string;
  page?: number;
  limit?: number;
};

export type GetLifecycleEventsResponseDto =
  | {
      success: true;
      page: number;
      limit: number;
      total: number;
      data: LifecycleEventResponseDto[];
    }
  | ErrorDto;

export type GetLifecycleSummaryDto = {
  targetId: string;
};

export type GetLifecycleSummaryResponseDto =
  | {
      success: true;
      total: number;
      tabs: LifecycleTab[];
      activeError: LifecycleActiveError | null;
    }
  | ErrorDto;

export const isLifecycleEventsResponseSuccess = (
  response: GetLifecycleEventsResponseDto
): response is Extract<GetLifecycleEventsResponseDto, { success: true }> =>
  "success" in response && response.success === true && "data" in response;

export const isLifecycleSummaryResponseSuccess = (
  response: GetLifecycleSummaryResponseDto
): response is Extract<GetLifecycleSummaryResponseDto, { success: true }> =>
  "success" in response && response.success === true && "tabs" in response;
