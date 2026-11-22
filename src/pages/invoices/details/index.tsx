import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { DownloadOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { Empty, Pagination, Spin, Tag } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  useGetInvoiceByIdQuery,
  useGetInvoiceItemsQuery,
} from 'entities/invoices/api';
import { InvoiceProductCodes } from 'entities/invoices/ui/productCodes';
import { getInvoiceStatusKey } from 'entities/invoices/lib/status';
import type { InvoiceItemsTableDataType } from 'entities/invoices/ui/tableData/invoiceItems/types';
import { useGetSalesOrderByIdQuery } from 'entities/salesOrders/api';
import { useGetDeliveryRouteByIdQuery } from 'entities/deliveryRoutes/api';
import { useGetDeliveryTaskByIdQuery } from 'entities/deliveryTasks/api';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import CustomButton from 'shared/ui/button';
import { statusColors } from 'shared/ui/statuses';
import { UserPreviewCardById } from 'entities/users/ui/userPreviewCard';
import { useCan } from 'entities/access/lib';
import { LifecycleTargetEntity } from 'entities/lifecycle/lib';
import { useLifecycleTab } from 'widgets/lifecycle/useLifecycleTab';
import { endpointAccessMap } from 'shared/config/endpointAccessMap';
import axiosInstance from 'shared/lib/axiosInstance';
import { BASE_URL, getFileNameFromDisposition } from 'shared/lib';
import EntityTabs, { OVERVIEW_TAB_KEY } from 'shared/ui/entityTabs';
import {
  DetailCard,
  DetailGrid,
  DetailItem,
  DetailItems,
  DetailStat,
  DetailStatsGrid,
  RouteMetaChip,
} from 'shared/ui/details';
import './styles.sass';

const formatDate = (value?: Date) => (value ? dayjs(value).format('DD.MM.YYYY') : '-');
const formatDateTime = (value?: Date) => (value ? dayjs(value).format('DD.MM.YYYY HH:mm') : '-');
const formatNumber = (value?: number) => (value != null ? value.toLocaleString() : '-');
const getExternalStatusLabel = (
  t: ReturnType<typeof useTranslation>['t'],
  status?: string
) => {
  if (!status) return '-';

  const externalLabel = t(`invoices.externalStatuses.${status}`, { defaultValue: '' });
  if (externalLabel) return externalLabel;

  const normalizedStatus = getInvoiceStatusKey(status);
  const normalizedExternalLabel = t(`invoices.externalStatuses.${normalizedStatus}`, { defaultValue: '' });
  if (normalizedExternalLabel) return normalizedExternalLabel;

  return t(`invoices.statuses.${normalizedStatus}`, { defaultValue: status });
};

const InvoicesDetails = () => {
  const navigate = useNavigate();
  const { id, orgId } = useParams<{ id: string; orgId?: string }>();
  const { t } = useTranslation();
  const canReadSalesOrder = useCan(endpointAccessMap.salesOrdersRead);
  const canReadDeliveryRoute = useCan(endpointAccessMap.deliveryRoutesRead);
  const canReadDeliveryTask = useCan(endpointAccessMap.deliveryTasksRead);
  const canReadCompany = useCan(endpointAccessMap.companiesRead);
  const { banner: lifecycleBanner, items: lifecycleTabItems } = useLifecycleTab({
    targetId: id,
    target: LifecycleTargetEntity.Invoice,
  });
  const [expandedCodesProductIds, setExpandedCodesProductIds] = useState<Set<string>>(new Set());
  const [invoiceFileLoading, setInvoiceFileLoading] = useState(false);

  const { data: invoice, isLoading } = useGetInvoiceByIdQuery(
    { id: id ?? '' },
    { skip: !id }
  );
  const invoiceSalesOrderId = invoice?.salesOrderId;
  const invoiceDeliveryTaskId = invoice?.deliveryTaskId;
  const invoiceDeliveryRouteId = invoice?.deliveryRouteId;
  const { data: salesOrder } = useGetSalesOrderByIdQuery(
    { id: invoiceSalesOrderId ?? '' },
    { skip: !invoiceSalesOrderId || !canReadSalesOrder }
  );
  const { data: deliveryRoute } = useGetDeliveryRouteByIdQuery(
    invoiceDeliveryRouteId ?? '',
    { skip: !invoiceDeliveryRouteId || !canReadDeliveryRoute }
  );
  const { data: deliveryTask } = useGetDeliveryTaskByIdQuery(
    invoiceDeliveryTaskId ?? '',
    { skip: !invoiceDeliveryTaskId || !canReadDeliveryTask }
  );
  const [itemsPagination, setItemsPagination] = useState({ page: 1, limit: 10 });
  const { data: invoiceItemsPageData, isFetching: invoiceItemsLoading } =
    useGetInvoiceItemsQuery(
      { id: id ?? '', page: itemsPagination.page, limit: itemsPagination.limit },
      { skip: !id }
    );
  const invoiceItems = useMemo(
    () => invoiceItemsPageData?.items ?? [],
    [invoiceItemsPageData]
  );
  const invoiceItemsTotal = invoiceItemsPageData?.total ?? 0;
  const invoiceItemsPage = itemsPagination.page;
  const invoiceItemsLimit = itemsPagination.limit;
  const listPath = orgId ? `/organization/${orgId}/invoices` : '/organization';

  useEffect(() => {
    setExpandedCodesProductIds(new Set());
  }, [id]);


  const invoiceStatusKey = getInvoiceStatusKey(invoice?.status);
  const externalStatus = invoice?.external?.status;
  const linkedPath = (section: string, linkedId?: string) => {
    if (!linkedId) return undefined;
    return orgId ? `/organization/${orgId}/${section}/${linkedId}` : '/organization';
  };

  const invoiceItemsData = useMemo<InvoiceItemsTableDataType[]>(() => {
    return invoiceItems.map((item) => ({
      key: item.id,
      productId: item.productId,
      productName: item.productName,
      quantity: formatNumber(item.quantity),
      measurementUnit: item.measurementUnitCode
        ? `${item.measurementUnit} (${item.measurementUnitCode})`
        : item.measurementUnit,
      unitPrice: formatNumber(item.unitPrice),
      amountWithoutVat: formatNumber(item.amountWithoutVat),
      taxes: `${t('invoices.itemsTable.vatRate')}: ${item.vatRate}% / ${t('invoices.itemsTable.exciseRate')}: ${item.exciseRate}%`,
      psicCode: item.psic.code || '-',
      psicName: item.psic.name || '',
      reliefId: item.reliefId || '-',
    }));
  }, [invoiceItems, t]);

  const toggleCodesExpanded = (productId: string) => {
    setExpandedCodesProductIds((current) => {
      const next = new Set(current);

      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }

      return next;
    });
  };

  const handleInvoiceFile = async (download: boolean) => {
    if (!id || invoiceFileLoading) return;

    setInvoiceFileLoading(true);

    try {
      const response = await axiosInstance.get(`${BASE_URL}/invoices/${id}/file`, {
        params: { download },
        responseType: 'blob',
      });
      const blob = new Blob([response.data], {
        type: response.data.type || 'application/pdf',
      });
      const url = window.URL.createObjectURL(blob);

      if (download) {
        const filename =
          getFileNameFromDisposition(response.headers['content-disposition']) ??
          `${invoice?.invoiceNumber || id}.pdf`;
        const link = document.createElement('a');

        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        /**
         * Изоляция открытой вкладки — через opener = null: window.open с
         * noopener возвращает null, и блокировку вкладки не отличить от
         * успеха, а blob-ссылку надо отозвать.
         */
        const openedWindow = window.open(url, '_blank');

        if (openedWindow) {
          openedWindow.opener = null;
          window.setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
        } else {
          window.URL.revokeObjectURL(url);
          toast.error(t('invoices.file.openError'));
        }
      }
    } catch {
      toast.error(t('invoices.file.loadError'));
    } finally {
      setInvoiceFileLoading(false);
    }
  };

  if (isLoading) {
    return null;
  }

  if (!invoice) {
    return (
      <MainLayout>
        <Heading title={t('invoices.detailsTitle')} subtitle={t('common.details')}>
          <CustomButton variant="outline" onClick={() => navigate(listPath)}>
            {t('common.backToList')}
          </CustomButton>
        </Heading>
        <div className="box">
          <div className="box-container">
            <div className="box-container-items">
              <Empty description={t('common.dataNotFound')} />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const externalStatusLabel = getExternalStatusLabel(t, externalStatus);

  const metaItems = [
    { label: t('invoices.fields.invoiceDate'), value: formatDate(invoice.invoice.date) },
    { label: t('invoices.fields.createdAt'), value: formatDateTime(invoice.createdAt) },
    { label: t('invoices.fields.currency'), value: invoice.currency || '-' },
  ];

  const linkItems = [
    {
      label: t('invoices.fields.salesOrderId'),
      value: salesOrder?.id === invoice.salesOrderId ? salesOrder.salesOrderNumber : invoice.salesOrderId,
      path: canReadSalesOrder
        ? linkedPath('sales-orders', invoice.salesOrderId)
        : undefined,
    },
    {
      label: t('invoices.fields.deliveryRouteId'),
      value: deliveryRoute?.id === invoice.deliveryRouteId ? deliveryRoute.routeNumber : invoice.deliveryRouteId,
      path: canReadDeliveryRoute
        ? linkedPath('delivery-routes', invoice.deliveryRouteId)
        : undefined,
    },
    {
      label: t('invoices.fields.deliveryTaskId'),
      value: deliveryTask?.id === invoice.deliveryTaskId ? deliveryTask.taskNumber : invoice.deliveryTaskId,
      path: canReadDeliveryTask
        ? linkedPath('delivery-tasks', invoice.deliveryTaskId)
        : undefined,
    },
  ];

  const participantItems = [
    {
      title: t('invoices.fields.sender'),
      values: [
        {
          label: t('invoices.fields.name'),
          value: invoice.sender.name,
          path: canReadCompany
            ? `/organization/${invoice.sender.companyId}`
            : undefined,
        },
        { label: t('invoices.fields.tin'), value: invoice.sender.tin || '-' },
        {
          label: t('invoices.fields.companyId'),
          value: invoice.sender.companyId,
          path: canReadCompany
            ? `/organization/${invoice.sender.companyId}`
            : undefined,
        },
        { label: t('invoices.fields.address'), value: invoice.sender.address || '-' },
      ],
    },
    {
      title: t('invoices.fields.receiver'),
      values: [
        {
          label: t('invoices.fields.name'),
          value: invoice.receiver.name,
          path:
            canReadCompany && invoice.receiver.companyId
              ? `/organization/${invoice.receiver.companyId}`
              : undefined,
        },
        { label: t('invoices.fields.tin'), value: invoice.receiver.tin || '-' },
        {
          label: t('invoices.fields.companyId'),
          value: invoice.receiver.companyId || '-',
          path:
            canReadCompany && invoice.receiver.companyId
              ? `/organization/${invoice.receiver.companyId}`
              : undefined,
        },
        { label: t('invoices.fields.address'), value: invoice.receiver.address || '-' },
      ],
    },
  ];

  const fileMetaItems = [
    { label: t('invoices.fields.filename'), value: invoice.fileMeta?.filename || '-' },
    { label: t('invoices.fields.programVersion'), value: invoice.fileMeta?.programVersion || '-' },
    { label: t('invoices.fields.formatVersion'), value: invoice.fileMeta?.formatVersion || '-' },
  ];

  return (
    <MainLayout>
      <Heading title={`${t('invoices.detailsTitle')} - ${invoice.invoiceNumber}`} subtitle={t('common.details')}>
        <div className="btns-group">
          <div className="invoice-file-actions">
            <button
              type="button"
              className="invoice-file-action invoice-file-action-main"
              disabled={invoiceFileLoading}
              onClick={() => void handleInvoiceFile(false)}
            >
              {t('invoices.sections.file')}
            </button>
            <button
              type="button"
              className="invoice-file-action invoice-file-action-icon"
              disabled={invoiceFileLoading}
              onClick={() => void handleInvoiceFile(true)}
              aria-label={t('invoices.file.download')}
              title={t('invoices.file.download')}
            >
              <DownloadOutlined />
            </button>
          </div>
          <CustomButton variant="outline" onClick={() => navigate(listPath)}>
            {t('common.backToList')}
          </CustomButton>
        </div>
      </Heading>
      {lifecycleBanner}
      <EntityTabs
        defaultActiveKey={OVERVIEW_TAB_KEY}
        items={[
          {
            key: OVERVIEW_TAB_KEY,
            label: t('lifecycle.tabs.overview'),
            children: (
      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <div className="route-overview-card">
              <div className="route-overview-head">
                <div className="route-overview-title">
                  {/* <span className="label">{t('invoices.fields.invoiceNumber')}</span> */}
                  <h2>{invoice.invoiceNumber}</h2>
                </div>
                <div className="route-overview-status">
                  <div className="invoice-status-pair-item">
                    <span className="invoice-status-pair-label">{t('invoices.fields.internalStatus')}</span>
                    <Tag color={statusColors[invoiceStatusKey] ?? statusColors[invoice.status] ?? 'blue'} style={{ margin: 0 }}>
                      {t(`invoices.statuses.${invoiceStatusKey}`, { defaultValue: invoice.status })}
                    </Tag>
                  </div>
                  <div className="invoice-status-pair-item">
                    <span className="invoice-status-pair-label">{t('invoices.fields.externalStatus')}</span>
                    <Tag color={statusColors[externalStatus ?? ''] ?? 'blue'} style={{ margin: 0 }} title={externalStatusLabel}>
                      {externalStatusLabel}
                    </Tag>
                  </div>
                </div>
              </div>
              <div className="route-overview-meta">
                {metaItems.map((item) => (
                  <RouteMetaChip key={item.label} label={item.label} value={item.value} />
                ))}
              </div>
              {invoice.createdBy && (
                <DetailGrid variant="single" style={{ marginTop: 16 }}>
                  <DetailCard full>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span className="label inline-label">{t('common.createdBy')}:</span>
                      <UserPreviewCardById userId={invoice.createdBy} compact />
                    </div>
                  </DetailCard>
                </DetailGrid>
              )}
            </div>

            <DetailGrid variant="secondary">
              <DetailCard wide title={t('invoices.sections.totals')}>
                <DetailStatsGrid>
                  <DetailStat label={t('invoices.fields.amountWithoutVat')} value={formatNumber(invoice.totals.amountWithoutVat)} />
                  <DetailStat label={t('invoices.fields.itemsQuantity')} value={formatNumber(invoice.totals.itemsQuantity)} />
                  <DetailStat label={t('invoices.fields.unitsQuantity')} value={formatNumber(invoice.totals.unitsQuantity)} />
                </DetailStatsGrid>
              </DetailCard>

              <DetailCard title={t('invoices.sections.contract')}>
                <DetailItems
                  items={[
                    { label: t('invoices.fields.contractNumber'), value: invoice.contract?.number || '-' },
                    { label: t('invoices.fields.contractDate'), value: formatDate(invoice.contract?.date) },
                  ]}
                />
              </DetailCard>
            </DetailGrid>

            <DetailGrid variant="main">
              {participantItems.map((participant) => (
                <DetailCard key={participant.title} title={participant.title}>
                  <DetailItems>
                    {participant.values.map((item) => (
                      <DetailItem key={item.label} label={item.label}>
                        {item.path ? (
                          <Link className="value link" to={item.path}>
                            {item.value}
                          </Link>
                        ) : (
                          <span className="value">{item.value}</span>
                        )}
                      </DetailItem>
                    ))}
                  </DetailItems>
                </DetailCard>
              ))}
            </DetailGrid>

            <DetailGrid variant="main">
              <DetailCard title={t('invoices.sections.links')}>
                <DetailItems>
                  {linkItems.map((item) => (
                    <DetailItem key={item.label} label={item.label}>
                      {item.path ? (
                        <Link className="value link" to={item.path}>
                          {item.value}
                        </Link>
                      ) : (
                        <span className="value">-</span>
                      )}
                    </DetailItem>
                  ))}
                </DetailItems>
              </DetailCard>

              <DetailCard title={t('invoices.sections.file')}>
                <DetailItems items={fileMetaItems} />
              </DetailCard>
            </DetailGrid>

            {invoice.comment && (
              <DetailGrid variant="single">
                <DetailCard full title={t('invoices.fields.comment')}>
                  <div className="detail-text-block">{invoice.comment}</div>
                </DetailCard>
              </DetailGrid>
            )}

            <DetailGrid variant="single">
              <DetailCard full title={t('invoices.sections.items')}>
                <Spin spinning={invoiceItemsLoading}>
                  {invoiceItemsData.length ? (
                    <div className="invoice-items-cards">
                      {invoiceItemsData.map((item) => (
                        <div className="invoice-item-card" key={item.key}>
                          <div className="invoice-item-card-head">
                            <div className="invoice-item-product">
                              <span className="label">{t('invoices.itemsTable.productName')}:</span>
                              <strong title={item.productName}>{item.productName}</strong>
                            </div>
                            <div className="invoice-item-amount">
                              <span className="label">{t('invoices.itemsTable.amountWithoutVat')}:</span>
                              <strong>{item.amountWithoutVat}</strong>
                            </div>
                          </div>

                          <div className="invoice-item-card-grid">
                            <div className="invoice-item-chip">
                              <span className="label">{t('invoices.itemsTable.quantity')}</span>
                              <span className="value">{item.quantity}</span>
                            </div>
                            <div className="invoice-item-chip">
                              <span className="label">{t('invoices.itemsTable.measurementUnit')}</span>
                              <span className="value" title={item.measurementUnit}>{item.measurementUnit}</span>
                            </div>
                            <div className="invoice-item-chip">
                              <span className="label">{t('invoices.itemsTable.unitPrice')}</span>
                              <span className="value">{item.unitPrice}</span>
                            </div>
                            <div className="invoice-item-chip">
                              <span className="label">{t('invoices.itemsTable.taxes')}</span>
                              <span className="value" title={item.taxes}>{item.taxes}</span>
                            </div>
                            <div className="invoice-item-chip">
                              <span className="label">{t('invoices.itemsTable.psic')}</span>
                              <span className="value" title={item.psicName ? `${item.psicCode} - ${item.psicName}` : item.psicCode}>
                                {item.psicCode}
                              </span>
                            </div>
                            <div className="invoice-item-chip">
                              <span className="label">{t('invoices.itemsTable.reliefId')}</span>
                              <span className="value">{item.reliefId}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="invoice-item-codes-toggle"
                            onClick={() => toggleCodesExpanded(item.productId)}
                            aria-expanded={expandedCodesProductIds.has(item.productId)}
                            aria-label={t('invoices.codes.toggle')}
                            title={t('invoices.codes.toggle')}
                          >
                            <span>
                              {expandedCodesProductIds.has(item.productId)
                                ? t('invoices.codes.hideShort')
                                : t('invoices.codes.showShort')}
                            </span>
                            {expandedCodesProductIds.has(item.productId) ? <UpOutlined /> : <DownOutlined />}
                          </button>

                          {expandedCodesProductIds.has(item.productId) && id && (
                            <InvoiceProductCodes
                              invoiceId={id}
                              productId={item.productId}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Empty description={t('common.dataNotFound')} />
                  )}

                  <Pagination
                    className="invoice-items-pagination"
                    current={invoiceItemsPage || 1}
                    pageSize={invoiceItemsLimit || 10}
                    total={invoiceItemsTotal || 0}
                    showSizeChanger={{ showSearch: false }}
                    pageSizeOptions={['10', '20', '30', '40', '50']}
                    locale={{ items_per_page: '' }}
                    onChange={(newPage, newLimit) =>
                      setItemsPagination((prev) => ({
                        page: newPage,
                        limit: newLimit || prev.limit,
                      }))
                    }
                  />
                </Spin>
              </DetailCard>
            </DetailGrid>
          </div>
        </div>
      </div>
            ),
          },
          ...lifecycleTabItems,
        ]}
      />
    </MainLayout>
  );
};

export default InvoicesDetails;
