import type { AuditLogResponseDto } from '@edem2000/amis.contracts/api/common/responses';
import type { AuditLog } from "entities/auditLog/types";

export function mapAuditLogResponseDtoToEntity(dto: AuditLogResponseDto): AuditLog {
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
    ip: dto.ip,
    userAgent: dto.userAgent,
    actor: dto.actor,
    target: dto.target,
    };  
}



