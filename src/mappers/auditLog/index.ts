import type { AuditLogResponseDto } from "../../dtos/auditLog";
import type { AuditLogResponse } from "../../types/auditLog";

export  function mapAuditLogResponseDtoToEntity(dto: AuditLogResponseDto): AuditLogResponse {
  return {
    id: dto.id,
    occurredAt: new Date(dto.occurredAt),
    actorType: dto.actorType,
    actorUserId: dto.actorUserId,
    targetEntity: dto.targetEntity,
    targetId: dto.targetId,
    category: dto.category,
    type: dto.type,
    message: dto.message,
    metadata: dto.metadata,
    requestId: dto.requestId,
    correlationId: dto.correlationId,
    ip: dto.ip,
    userAgent: dto.userAgent,
    actor: dto.actor,
    target: dto.target,
    };  
}