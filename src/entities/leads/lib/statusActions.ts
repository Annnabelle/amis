import { LeadStatus, type LeadStatus as LeadStatusType } from "entities/leads/types";

export const getAvailableLeadStatusActions = (
  status: LeadStatusType
): LeadStatusType[] => {
  if (status === LeadStatus.New) {
    return [LeadStatus.InProgress];
  }

  if (status === LeadStatus.InProgress) {
    return [LeadStatus.Completed, LeadStatus.Rejected];
  }

  return [];
};
