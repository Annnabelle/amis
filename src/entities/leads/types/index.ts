import {
  LeadSortField,
  LeadStatus,
  LeadStatuses,
} from '@edem2000/amis.contracts'
import type { Paginated } from 'shared/api'

export {
  LeadSortField,
  LeadStatus,
  LeadStatuses,
}


export type Lead = {
  id: string;
  name: string;
  phone: string;
  company?: string;
  tariff?: string;
  message?: string;
  status: LeadStatus;
  comment?: string;
  statusChangedBy?: string;
  statusChangedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type LeadListQuery = {
  page: number;
  limit: number;
  sortOrder?: "asc" | "desc";
  sortBy?: LeadSortField;
  status?: LeadStatus;
};

export type LeadList = Paginated<Lead>;
