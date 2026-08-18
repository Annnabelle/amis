export const LeadStatus = {
  New: "new",
  InProgress: "in_progress",
  Completed: "completed",
  Rejected: "rejected",
} as const;

export const LeadStatuses = Object.values(LeadStatus);

export type LeadStatus = (typeof LeadStatus)[keyof typeof LeadStatus];

export const LeadSortField = {
  Id: "_id",
  CreatedAt: "createdAt",
  UpdatedAt: "updatedAt",
  StatusChangedAt: "statusChangedAt",
} as const;

export type LeadSortField =
  (typeof LeadSortField)[keyof typeof LeadSortField];

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
