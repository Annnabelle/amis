export type StatusBadgeSemanticVariant =
  | 'default'
  | 'neutral'
  | 'warning'
  | 'info'
  | 'success'
  | 'cyan'
  | 'orange'
  | 'purple'
  | 'danger';

export type StatusBadgeVariant = StatusBadgeSemanticVariant;

const semanticVariants: StatusBadgeSemanticVariant[] = [
  'default',
  'neutral',
  'warning',
  'info',
  'success',
  'cyan',
  'orange',
  'purple',
  'danger',
];

const colorVariantMap: Record<string, StatusBadgeSemanticVariant> = {
  default: 'default',
  gray: 'neutral',
  grey: 'neutral',
  gold: 'warning',
  yellow: 'warning',
  processing: 'info',
  blue: 'info',
  geekblue: 'info',
  green: 'success',
  cyan: 'cyan',
  volcano: 'orange',
  orange: 'orange',
  pink: 'purple',
  purple: 'purple',
  red: 'danger',
};

const statusVariantMap: Record<string, StatusBadgeSemanticVariant> = {
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
  declined: 'danger',
  codes_received: 'info',
  RECEIVED: 'info',
  codes_utilized: 'success',
  codes_aggregated: 'purple',
  codes_utilization_requested: 'neutral',
  confirmed: 'info',
  delivered: 'success',
  draft: 'neutral',
  disabled: 'neutral',
  error: 'danger',
  exhausted: 'success',
  EXHAUSTED: 'success',
  ERROR: 'danger',
  failed: 'danger',
  inactive: 'danger',
  invited: 'info',
  issued: 'success',
  INTRODUCED: 'warning',
  issue_failed: 'danger',
  loaded: 'success',
  loading: 'info',
  new: 'info',
  OUTSOURCED: 'purple',
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
  Rejected: 'danger',
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
  vendor_pending: 'warning',
  WITHDRAWN: 'info',
  WRITTEN_OFF: 'success',
  in_process: 'warning',
  IN_PROCESS: 'warning',
  in_progress: 'warning',
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
  Deleted: 'neutral',
  None: 'neutral',
  unknown: 'default',
  outsourcered: 'warning',
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

const isStatusBadgeVariant = (
  value: string
): value is StatusBadgeSemanticVariant => (
  semanticVariants.includes(value as StatusBadgeSemanticVariant)
);

export const getStatusBadgeVariant = (
  status?: string | null,
  fallback: StatusBadgeSemanticVariant = 'default'
): StatusBadgeSemanticVariant => {
  const normalizedStatus = status?.trim();

  if (!normalizedStatus) {
    return fallback;
  }

  const lowercaseStatus = normalizedStatus.toLowerCase();

  if (isStatusBadgeVariant(lowercaseStatus)) {
    return lowercaseStatus;
  }

  return (
    statusVariantMap[normalizedStatus] ??
    statusVariantMap[lowercaseStatus] ??
    colorVariantMap[lowercaseStatus] ??
    fallback
  );
};
