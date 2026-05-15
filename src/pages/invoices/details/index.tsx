import { useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { Empty, Pagination, Spin, Tag } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'app/store';
import { getInvoiceById, getInvoiceItems } from 'entities/invoices/model';
import { getInvoiceStatusKey } from 'entities/invoices/lib/status';
import type { InvoiceItemsTableDataType } from 'entities/invoices/ui/tableData/invoiceItems/types';
import { getSalesOrderById } from 'entities/salesOrders/model';
import { getDeliveryRouteById } from 'entities/deliveryRoutes/model';
import { getDeliveryTaskById } from 'entities/deliveryTasks/model';
import { statusColors } from 'shared/ui/statuses.tsx';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import CustomButton from 'shared/ui/button';

const formatDate = (value?: Date) => (value ? dayjs(value).format('DD.MM.YYYY') : '-');
const formatDateTime = (value?: Date) => (value ? dayjs(value).format('DD.MM.YYYY HH:mm') : '-');
const formatNumber = (value?: number) => (value != null ? value.toLocaleString() : '-');

const InvoicesDetails = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id, orgId } = useParams<{ id: string; orgId?: string }>();
  const { t } = useTranslation();

  const invoice = useAppSelector((state) => state.invoices.invoiceById);
  const isLoading = useAppSelector((state) => state.invoices.loadingById);
  const salesOrder = useAppSelector((state) => state.salesOrders.orderById);
  const deliveryRoute = useAppSelector((state) => state.deliveryRoutes.routeById);
  const deliveryTask = useAppSelector((state) => state.deliveryTasks.taskById);
  const invoiceItems = useAppSelector((state) => state.invoices.items);
  const invoiceItemsTotal = useAppSelector((state) => state.invoices.itemsTotal);
  const invoiceItemsPage = useAppSelector((state) => state.invoices.itemsPage);
  const invoiceItemsLimit = useAppSelector((state) => state.invoices.itemsLimit);
  const invoiceItemsLoading = useAppSelector((state) => state.invoices.itemsLoading);
  const listPath = orgId ? `/organization/${orgId}/invoices` : '/invoices';

  useEffect(() => {
    if (!id) return;
    dispatch(getInvoiceById({ id }));
    dispatch(getInvoiceItems({ id, page: 1, limit: 10 }));
  }, [dispatch, id]);

  useEffect(() => {
    if (!invoice || invoice.id !== id) return;

    if (invoice.salesOrderId) {
      dispatch(getSalesOrderById({ id: invoice.salesOrderId }));
    }

    if (invoice.deliveryRouteId) {
      dispatch(getDeliveryRouteById(invoice.deliveryRouteId));
    }

    if (invoice.deliveryTaskId) {
      dispatch(getDeliveryTaskById(invoice.deliveryTaskId));
    }
  }, [dispatch, id, invoice]);

  const invoiceStatusKey = getInvoiceStatusKey(invoice?.status);
  const externalStatus = invoice?.external?.status;
  const linkedPath = (section: string, linkedId?: string) => {
    if (!linkedId) return undefined;
    return orgId ? `/organization/${orgId}/${section}/${linkedId}` : `/${section}/${linkedId}`;
  };

  const invoiceItemsData = useMemo<InvoiceItemsTableDataType[]>(() => {
    return invoiceItems.map((item) => ({
      key: item.id,
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

  if (isLoading && invoice?.id !== id) {
    return null;
  }

  if (!invoice || invoice.id !== id) {
    return (
      <MainLayout>
        <Heading title={t('invoices.detailsTitle')} subtitle={t('common.details')}>
          <CustomButton className="outline" onClick={() => navigate(listPath)}>
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

  const externalStatusLabel = externalStatus
    ? t(`invoices.externalStatuses.${externalStatus}`, { defaultValue: externalStatus })
    : '-';

  const metaItems = [
    { label: t('invoices.fields.invoiceDate'), value: formatDate(invoice.invoice.date) },
    { label: t('invoices.fields.createdAt'), value: formatDateTime(invoice.createdAt) },
    { label: t('invoices.fields.currency'), value: invoice.currency || '-' },
  ];

  const linkItems = [
    {
      label: t('invoices.fields.salesOrderId'),
      value: salesOrder?.id === invoice.salesOrderId ? salesOrder.salesOrderNumber : invoice.salesOrderId,
      path: linkedPath('sales-orders', invoice.salesOrderId),
    },
    {
      label: t('invoices.fields.deliveryRouteId'),
      value: deliveryRoute?.id === invoice.deliveryRouteId ? deliveryRoute.routeNumber : invoice.deliveryRouteId,
      path: linkedPath('delivery-routes', invoice.deliveryRouteId),
    },
    {
      label: t('invoices.fields.deliveryTaskId'),
      value: deliveryTask?.id === invoice.deliveryTaskId ? deliveryTask.taskNumber : invoice.deliveryTaskId,
      path: linkedPath('delivery-routes', invoice.deliveryRouteId),
    },
  ];

  const participantItems = [
    {
      title: t('invoices.fields.sender'),
      values: [
        {
          label: t('invoices.fields.name'),
          value: invoice.sender.name,
          path: `/organization/${invoice.sender.companyId}`,
        },
        { label: t('invoices.fields.tin'), value: invoice.sender.tin || '-' },
        {
          label: t('invoices.fields.companyId'),
          value: invoice.sender.companyId,
          path: `/organization/${invoice.sender.companyId}`,
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
          path: invoice.receiver.companyId ? `/organization/${invoice.receiver.companyId}` : undefined,
        },
        { label: t('invoices.fields.tin'), value: invoice.receiver.tin || '-' },
        {
          label: t('invoices.fields.companyId'),
          value: invoice.receiver.companyId || '-',
          path: invoice.receiver.companyId ? `/organization/${invoice.receiver.companyId}` : undefined,
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
          <Tag color={statusColors[invoiceStatusKey] ?? statusColors[invoice.status] ?? 'blue'} style={{ margin: 0 }}>
            {t(`invoices.statuses.${invoiceStatusKey}`, { defaultValue: invoice.status })}
          </Tag>
          <CustomButton className="outline" onClick={() => navigate(listPath)}>
            {t('common.backToList')}
          </CustomButton>
        </div>
      </Heading>
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
                  <Tag color={statusColors[externalStatus ?? ''] ?? 'blue'} style={{ margin: 0 }} title={externalStatusLabel}>
                    {externalStatusLabel}
                  </Tag>
                </div>
              </div>
              <div className="route-overview-meta">
                {metaItems.map((item) => (
                  <div className="route-meta-chip" key={item.label}>
                    <span className="label">{item.label}</span>
                    <span className="value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-grid detail-grid-secondary">
              <div className="detail-card detail-card-wide">
                <h4>{t('invoices.sections.totals')}</h4>
                <div className="detail-stats-grid">
                  <div className="detail-stat">
                    <span className="label">{t('invoices.fields.amountWithoutVat')}</span>
                    <span className="value">{formatNumber(invoice.totals.amountWithoutVat)}</span>
                  </div>
                  <div className="detail-stat">
                    <span className="label">{t('invoices.fields.itemsQuantity')}</span>
                    <span className="value">{formatNumber(invoice.totals.itemsQuantity)}</span>
                  </div>
                  <div className="detail-stat">
                    <span className="label">{t('invoices.fields.unitsQuantity')}</span>
                    <span className="value">{formatNumber(invoice.totals.unitsQuantity)}</span>
                  </div>
                </div>
              </div>

              <div className="detail-card">
                <h4>{t('invoices.sections.contract')}</h4>
                <div className="detail-items">
                  <div className="detail-item">
                    <span className="label inline-label">{t('invoices.fields.contractNumber')}</span>
                    <span className="detail-separator">:</span>
                    <span className="value">{invoice.contract?.number || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label inline-label">{t('invoices.fields.contractDate')}</span>
                    <span className="detail-separator">:</span>
                    <span className="value">{formatDate(invoice.contract?.date)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-grid detail-grid-main">
              {participantItems.map((participant) => (
                <div className="detail-card" key={participant.title}>
                  <h4>{participant.title}</h4>
                  <div className="detail-items">
                    {participant.values.map((item) => (
                      <div className="detail-item" key={item.label}>
                        <span className="label inline-label">{item.label}</span>
                        <span className="detail-separator">:</span>
                        {item.path ? (
                          <Link className="value link" to={item.path}>
                            {item.value}
                          </Link>
                        ) : (
                          <span className="value">{item.value}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="detail-grid detail-grid-main">
              <div className="detail-card">
                <h4>{t('invoices.sections.links')}</h4>
                <div className="detail-items">
                  {linkItems.map((item) => (
                    <div className="detail-item" key={item.label}>
                      <span className="label inline-label">{item.label}</span>
                      <span className="detail-separator">:</span>
                      {item.path ? (
                        <Link className="value link" to={item.path}>
                          {item.value}
                        </Link>
                      ) : (
                        <span className="value">-</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-card">
                <h4>{t('invoices.sections.file')}</h4>
                <div className="detail-items">
                  {fileMetaItems.map((item) => (
                    <div className="detail-item" key={item.label}>
                      <span className="label inline-label">{item.label}</span>
                      <span className="detail-separator">:</span>
                      <span className="value">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {invoice.comment && (
              <div className="detail-grid detail-grid-single">
                <div className="detail-card detail-card-full">
                  <h4>{t('invoices.fields.comment')}</h4>
                  <div className="detail-text-block">{invoice.comment}</div>
                </div>
              </div>
            )}

            <div className="detail-grid detail-grid-single">
              <div className="detail-card detail-card-full">
                <h4>{t('invoices.sections.items')}</h4>
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
                    pageSizeOptions={['10', '15', '20', '25']}
                    locale={{ items_per_page: '' }}
                    onChange={(newPage, newLimit) => {
                      if (!id) return;
                      dispatch(
                        getInvoiceItems({
                          id,
                          page: newPage,
                          limit: newLimit || invoiceItemsLimit || 10,
                        })
                      );
                    }}
                  />
                </Spin>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default InvoicesDetails;
