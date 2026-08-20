import type {
  CompanyStatus,
  DeliveryRouteStatus,
  DeliveryTaskStatus,
  SalesOrderStatus,
} from 'shared/types/dtos';
import type {
  ExternalInvoiceStatus,
  InvoiceStatus,
} from 'entities/invoices/dtos';

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

const fallbackVariant: StatusBadgeVariant = 'default';

const normalizeStatusKey = (status?: string | null): string =>
  status
    ?.trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase() ?? '';

const getMappedVariant = (
  map: Record<string, StatusBadgeVariant>,
  status?: string | null
): StatusBadgeVariant => {
  if (!status) {
    return fallbackVariant;
  }

  return map[status] ?? fallbackVariant;
};

const companyStatusVariants: Record<CompanyStatus, StatusBadgeVariant> = {
  active: 'success',
  inactive: 'danger',
  prospective: 'warning',
};

const salesOrderStatusVariants: Record<SalesOrderStatus, StatusBadgeVariant> = {
  draft: 'neutral',
  confirmed: 'info',
  partially_assigned: 'warning',
  assigned: 'cyan',
  partially_delivered: 'orange',
  delivered: 'success',
  cancelled: 'danger',
  closed: 'neutral',
};

const deliveryRouteStatusVariants: Record<DeliveryRouteStatus, StatusBadgeVariant> = {
  draft: 'neutral',
  assigned_to_warehouse: 'warning',
  ready_for_loading: 'warning',
  loading: 'info',
  loaded: 'success',
  in_transit: 'cyan',
  partially_delivered: 'orange',
  delivered: 'success',
  returning: 'purple',
  returned: 'neutral',
  closed: 'neutral',
  cancelled: 'danger',
  failed: 'danger',
};

const deliveryTaskStatusVariants: Record<DeliveryTaskStatus, StatusBadgeVariant> = {
  planned: 'warning',
  loading: 'info',
  loaded: 'success',
  handover_in_progress: 'info',
  delivering: 'cyan',
  partially_delivered: 'orange',
  delivered: 'success',
  issue_failed: 'danger',
  cancelled: 'danger',
};

const invoiceStatusVariants: Record<InvoiceStatus, StatusBadgeVariant> = {
  created: 'success',
  in_review: 'warning',
  approved: 'success',
  sent: 'info',
  pending: 'warning',
  completed: 'success',
  rejected: 'danger',
  canceled: 'danger',
  returned: 'neutral',
  unknown: 'default',
  registered: 'info',
  deleted: 'neutral',
};

const externalInvoiceStatusVariants: Record<ExternalInvoiceStatus, StatusBadgeVariant> = {
  None: 'neutral',
  AwaitContractor: 'warning',
  AwaitAction: 'info',
  Rejected: 'danger',
  Archived: 'success',
  AwaitAgreement: 'warning',
  AwaitSign: 'info',
  Deleted: 'neutral',
  AwaitThirdSide: 'warning',
  ArchiveCancelRequested: 'orange',
  AwaitCancelArchiveRequest: 'warning',
  RejectArchiveCancelRequest: 'danger',
  ArchiveCanceled: 'neutral',
  AgreementAgreed: 'success',
  AgreementReject: 'danger',
  SigningSigned: 'success',
  SigningReject: 'danger',
  AwaitDecline: 'warning',
  VerifiedBySystem: 'success',
  AwaitResponsiblePerson: 'warning',
  ResponsiblePersonAccepted: 'success',
  AwaitResponsiblePersonAccepted: 'warning',
  ResponsiblePersonRejected: 'danger',
  ResponsiblePersonTillReturned: 'orange',
  ResponsiblePersonReturned: 'orange',
  ReturnAccepted: 'success',
  AwaitReturnAccept: 'warning',
};

const integrationStatusVariants: Record<string, StatusBadgeVariant> = {
  active: 'success',
  inactive: 'danger',
  disabled: 'neutral',
  pending: 'warning',
  validating: 'warning',
  error: 'danger',
  failed: 'danger',
  connected: 'success',
  disconnected: 'neutral',
  unknown: 'default',
};

export const getCompanyStatusBadgeVariant = (status?: CompanyStatus | string | null) =>
  getMappedVariant(companyStatusVariants, status);

export const getSalesOrderStatusBadgeVariant = (status?: SalesOrderStatus | string | null) =>
  getMappedVariant(salesOrderStatusVariants, status);

export const getDeliveryRouteStatusBadgeVariant = (status?: DeliveryRouteStatus | string | null) =>
  getMappedVariant(deliveryRouteStatusVariants, status);

export const getDeliveryTaskStatusBadgeVariant = (status?: DeliveryTaskStatus | string | null) =>
  getMappedVariant(deliveryTaskStatusVariants, status);

export const getInvoiceStatusBadgeVariant = (status?: InvoiceStatus | string | null) =>
  getMappedVariant(invoiceStatusVariants, status);

export const getExternalInvoiceStatusBadgeVariant = (status?: ExternalInvoiceStatus | string | null) =>
  getMappedVariant(externalInvoiceStatusVariants, status);

export const getIntegrationStatusBadgeVariant = (status?: string | null): StatusBadgeVariant =>
  integrationStatusVariants[normalizeStatusKey(status)] ?? fallbackVariant;
