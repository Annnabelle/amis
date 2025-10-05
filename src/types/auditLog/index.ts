import type { Actor, AuditCategory, AuditType, HexString, TargetEntity, TargetResponseDto } from "../../dtos";
import type { UserResponseDto } from "../../dtos/users/login";

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