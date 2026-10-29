import type {
  GetLifecycleSummaryResponseDto,
  LifecycleEventResponseDto,
} from "entities/lifecycle/dtos";
import type {
  LifecycleEvent,
  LifecycleSummary,
} from "entities/lifecycle/types";

export const mapLifecycleEventDtoToEntity = (
  dto: LifecycleEventResponseDto
): LifecycleEvent => ({
  id: dto.id,
  kind: dto.kind,
  occurredAt: dto.occurredAt,
  scope: dto.scope,
  vendor: dto.vendor,
  actor: {
    type: dto.actor?.type,
    userId: dto.actor?.userId,
    vendor: dto.actor?.vendor,
  },
  status: dto.status,
  error: dto.error,
  origin: dto.origin,
  requestId: dto.requestId,
  correlationId: dto.correlationId,
  causedByEventId: dto.causedByEventId,
});

export const mapLifecycleSummaryDtoToEntity = (
  dto: Extract<GetLifecycleSummaryResponseDto, { success: true }>
): LifecycleSummary => ({
  total: dto.total,
  tabs: dto.tabs ?? [],
  activeError: dto.activeError ?? null,
});
