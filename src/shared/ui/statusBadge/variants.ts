export type StatusBadgeVariant =
  | 'default'
  | 'neutral'
  | 'warning'
  | 'info'
  | 'success'
  | 'cyan'
  | 'orange'
  | 'purple'
  | 'danger';

const statusVariantMap: Record<string, StatusBadgeVariant> = {
  active: 'success',
  ACTIVE: 'success',
  approved: 'success',
  accepted: 'success',
  APPLIED: 'success',
  closed: 'neutral',
  CLOSED: 'neutral',
  completed: 'success',
  created: 'success',
  CREATED: 'success',
  codes_received: 'info',
  codes_utilized: 'success',
  codes_aggregated: 'purple',
  confirmed: 'info',
  delivered: 'success',
  draft: 'neutral',
  disabled: 'neutral',
  error: 'danger',
  ERROR: 'danger',
  failed: 'danger',
  inactive: 'danger',
  invited: 'info',
  issued: 'success',
  issue_failed: 'danger',
  loaded: 'success',
  loading: 'info',
  new: 'info',
  pending: 'warning',
  PENDING: 'warning',
  planned: 'warning',
  prospective: 'warning',
  ready: 'info',
  READY: 'success',
  ready_for_codes: 'success',
  ready_for_loading: 'warning',
  registered: 'info',
  rejected: 'danger',
  REJECTED: 'danger',
  rejected_by_external: 'danger',
  requested: 'warning',
  returning: 'purple',
  returned: 'neutral',
  sent: 'info',
  success: 'success',
  SUCCESS: 'success',
  validating: 'warning',
  VALIDATING: 'warning',
  in_process: 'warning',
  IN_PROCESS: 'warning',
  in_review: 'warning',
  in_transit: 'cyan',
  handover_in_progress: 'info',
  delivering: 'cyan',
  assigned: 'cyan',
  assigned_to_warehouse: 'warning',
  partially_assigned: 'warning',
  partially_delivered: 'orange',
  partially_processed: 'info',
  PARTIALLY_PROCESSED: 'info',
  cancelled: 'danger',
  canceled: 'danger',
  deleted: 'neutral',
  None: 'neutral',
  unknown: 'default',
  AwaitContractor: 'warning',
  AwaitAction: 'info',
  AwaitAgreement: 'warning',
  AwaitSign: 'info',
  AwaitThirdSide: 'warning',
  AwaitDecline: 'warning',
  AwaitResponsiblePerson: 'warning',
  AwaitResponsiblePersonAccepted: 'warning',
  AwaitReturnAccept: 'warning',
  Archived: 'success',
  ArchiveCanceled: 'neutral',
  ArchiveCancelRequested: 'orange',
  AwaitCancelArchiveRequest: 'warning',
  RejectArchiveCancelRequest: 'danger',
  AgreementAgreed: 'success',
  AgreementReject: 'danger',
  SigningSigned: 'success',
  SigningReject: 'danger',
  VerifiedBySystem: 'success',
  ResponsiblePersonAccepted: 'success',
  ResponsiblePersonRejected: 'danger',
  ResponsiblePersonTillReturned: 'orange',
  ResponsiblePersonReturned: 'orange',
  ReturnAccepted: 'success',
};

export const getStatusBadgeVariant = (
  status?: string | null,
  fallback: StatusBadgeVariant = 'default'
): StatusBadgeVariant => {
  if (!status) {
    return fallback;
  }

  return statusVariantMap[status] ?? statusVariantMap[status.toLowerCase()] ?? fallback;
};
