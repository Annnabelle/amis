import type { LeadStatus } from "entities/leads/types";

export type LeadTableDataType = {
  key: string;
  name: string;
  phone: string;
  company: string;
  status: LeadStatus;
  comment?: string;
  createdAt: string;
};
