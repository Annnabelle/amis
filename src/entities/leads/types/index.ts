import {
  LeadSortField,
  LeadStatus,
  LeadStatuses,
} from '@edem2000/amis.contracts'

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

export type LeadsState = {
  leads: Lead[];
  leadById: Lead | null;
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
};
