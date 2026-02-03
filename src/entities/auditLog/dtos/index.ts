import type { Actor, AuditCategory, AuditType, CompanySortField, CompanyStatus, ErrorDto, HexString, Identifier, PaginatedDto, PaginatedResponseDto, TargetEntity, TargetResponseDto } from "shared/types/dtos";
import type { UserResponseDto } from "entities/users/dtos/login";

export type AuditLogResponseDto = {
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

export type GetAuditLogResponseDto = {
  success: boolean;
  auditLog: AuditLogResponseDto;
} | ErrorDto;

export type GetAuditLogsResponseDto = {
  success: boolean;
} & PaginatedResponseDto<AuditLogResponseDto> | ErrorDto;

export type GetAuditLogDto = {
  id: HexString;
}

export type GetAuditLogsDto = PaginatedDto & {
  status?: CompanyStatus;

  sortBy?: CompanySortField

  category?: AuditCategory;

  type?: AuditType;

  actorType?: Actor;

  actorUserId?: Identifier;

  targetEntity?: TargetEntity;

  targetId?: Identifier;
}






