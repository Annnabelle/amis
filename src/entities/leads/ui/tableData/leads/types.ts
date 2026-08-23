import type { LeadStatus as LeadStatusType } from "entities/leads/types";

export type LeadTableDataType = {
  key: string;
  name: string;
  phone: string;
  company: string;
  status: LeadStatusType;
  comment?: string;
  createdAt: string;
};
