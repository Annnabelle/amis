import type { Actor, AuditCategory, AuditType, HexString, TargetEntity, TargetResponseDto } from "shared/types/dtos";
import type { UserResponseDto } from "entities/users/dtos/login";

export type auditLogState = {
    auditLog: null,
    isLoading: false,
    error: null,
    status: null,
};

export type AuditLogResponse = {
  id: string;
  occurredAt: Date,
  actorType: Actor,
  actorUserId?: HexString,
  targetEntity: TargetEntity,
  targetId?: HexString,
  category: AuditCategory,
  type: AuditType,
  message?: string,
  metadata?: Record<string, unknown>,
  requestId?: string,
  correlationId?: string,
  ip?: string,
  userAgent?: string,
  actor: UserResponseDto | null,
  target: TargetResponseDto | null,
};



