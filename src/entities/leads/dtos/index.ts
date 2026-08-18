import type { ErrorDto, PaginatedDto, PaginatedResponseDto } from "shared/types/dtos";
import type { Lead, LeadSortField, LeadStatus } from "entities/leads/types";

export type LeadResponseDto = Lead;

export type GetLeadsDto = PaginatedDto & {
  sortBy?: LeadSortField;
  status?: LeadStatus;
};

export type GetLeadsResponseDto =
  | ({ success: true } & PaginatedResponseDto<LeadResponseDto>)
  | ErrorDto;

export type GetLeadResponseDto =
  | { success: true; data: LeadResponseDto }
  | ErrorDto;

export type UpdateLeadStatusDto = {
  status: LeadStatus;
  comment?: string;
};

export type UpdateLeadStatusResponseDto =
  | { success: true; data: LeadResponseDto }
  | ErrorDto;
