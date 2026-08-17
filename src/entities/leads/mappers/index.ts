import type { LeadResponseDto } from "entities/leads/dtos";
import type { Lead } from "entities/leads/types";

export const mapLeadDtoToEntity = (dto: LeadResponseDto): Lead => ({
  id: dto.id,
  name: dto.name,
  phone: dto.phone,
  company: dto.company,
  tariff: dto.tariff,
  message: dto.message,
  status: dto.status,
  comment: dto.comment,
  statusChangedBy: dto.statusChangedBy,
  statusChangedAt: dto.statusChangedAt,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});
