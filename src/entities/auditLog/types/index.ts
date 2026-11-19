import type { MultiLanguage, Actor, AuditCategory, AuditType, HexString, TargetEntity, TargetResponseDto } from "shared/types/dtos";
import type { UserResponseDto } from '@edem2000/amis.contracts/api/common/responses';
import type { Paginated } from 'shared/api';

export type AuditLog = {
  id: string;
  occurredAt: Date,
  actorType: Actor,
  actorUserId?: HexString,
  targetEntity: TargetEntity,
  targetId?: HexString,
  category: AuditCategory,
  type: AuditType,
  message?: MultiLanguage,
  metadata?: Record<string, unknown>,
  requestId?: string,
  ip?: string,
  userAgent?: string,
  actor: UserResponseDto | null,
  target: TargetResponseDto | null,
};

export type AuditLogList = Paginated<AuditLog>;
