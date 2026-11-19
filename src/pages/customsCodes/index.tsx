import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Select, Space } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LifecycleTargetEntity } from 'entities/lifecycle/lib';
import { useRecentStatusChanges, useStatusChangeListRefresh } from 'shared/lib/statusChanges';
import {
  useCreateCustomsCodeOrderMutation,
  useGetCustomsCodeOrdersQuery,
  useInitiateCustomsCodeOrderDissolutionMutation,
  useLazyGetCustomsCodeOrderByIdQuery,
  useSignCustomsCodeOrderDissolutionMutation,
  useSignCustomsCodeOrderRegistrationMutation,
} from 'entities/customsCodes/api';
import { getApiErrorMessage } from 'shared/api';
import { useGetMarkingCodeOrdersQuery } from 'entities/markingCodes/api';
import { OrderStatusType } from 'entities/markingCodes/types';
import {
  AggregatedCustomsCodeOrderStatus,
  type CustomsCodeOrder,
} from 'entities/customsCodes/types';
import { endpointAccessMap } from 'shared/config/endpointAccessMap';
import { PackageType } from 'shared/types/dtos';
import { StatusEntity } from 'shared/config/statusCatalog';
import { useCan } from 'entities/access/lib';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import ComponentTable from 'shared/ui/table';
import ModalWindow from 'shared/ui/modalWindow';
import CustomButton from 'shared/ui/button';
import EntityStatusBadge from 'shared/ui/statusBadge/entityStatus';
import type { AdaptiveColumn } from 'shared/ui/table/types';
import {
  eImzoClient,
  getCertificateTitle,
  type EImzoCertificate,
} from 'shared/lib/eImzo';

type CustomsCodeTableRow = {
  key: string;
  number: number;
  id: string;
  accOrderNumber: string;
  orderId: string;
  batchId: string;
  productId: string;
  quantity: number;
  customsCode: string;
  measurement: string;
  status: AggregatedCustomsCodeOrderStatus;
  order: CustomsCodeOrder;
};

type SignMode = 'registration' | 'dissolution';

const canSignRegistration = (order: CustomsCodeOrder) =>
  order.status === AggregatedCustomsCodeOrderStatus.ReadyForSign &&
  Boolean(order.external.registration.documentBase64);

const canInitiateDissolution = (order: CustomsCodeOrder) =>
  order.status === AggregatedCustomsCodeOrderStatus.Registered;

const canSignDissolution = (order: CustomsCodeOrder) =>
  order.status === AggregatedCustomsCodeOrderStatus.DissolutionInitialized &&
  Boolean(order.external.dissolution.documentBase64);

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
const E_IMZO_ERROR_KEY_PREFIX = 'customsCodes.eImzoErrors.';

const CustomsCodesPage = () => {
  const { t } = useTranslation();
  const { orgId } = useParams();
  const navigate = useNavigate();
  const canCreate = useCan(endpointAccessMap.customsCodesCreate);
  const canRead = useCan(endpointAccessMap.customsCodesRead);
  const canSignRegistrationOrder = useCan(endpointAccessMap.customsCodesSignRegistration);
  const canDissolve = useCan(endpointAccessMap.customsCodesInitiateDissolution);
  const canSignDissolutionOrder = useCan(endpointAccessMap.customsCodesSignDissolution);
  const canListOrders = useCan(endpointAccessMap.ordersList);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const { page, limit } = pagination;
  const {
    data: ordersPage,
    isFetching: loading,
    error,
    refetch: refreshCustomsCodes,
  } = useGetCustomsCodeOrdersQuery({ page, limit }, { skip: !orgId });
  const [createCustomsCodeOrder, { isLoading: creating }] =
    useCreateCustomsCodeOrderMutation();
  const [initiateDissolution, { isLoading: dissolving }] =
    useInitiateCustomsCodeOrderDissolutionMutation();
  const [signRegistration, { isLoading: signingRegistration }] =
    useSignCustomsCodeOrderRegistrationMutation();
  const [signDissolution, { isLoading: signingDissolution }] =
    useSignCustomsCodeOrderDissolutionMutation();
  const [loadCustomsCodeOrder] = useLazyGetCustomsCodeOrderByIdQuery();
  const signing = signingRegistration || signingDissolution;
  const data = useMemo(() => ordersPage?.items ?? [], [ordersPage]);
  const total = ordersPage?.total ?? 0;

  const [modalOpen, setModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { data: batchesPage, isFetching: batchesLoading } =
    useGetMarkingCodeOrdersQuery(
      {
        page: 1,
        limit: 50,
        status: OrderStatusType.CodesAggregated,
        packageType: PackageType.Unit,
      },
      { skip: !createModalOpen || !canListOrders }
    );
  const batches = useMemo(() => batchesPage?.items ?? [], [batchesPage]);
  const [selectedOrder, setSelectedOrder] = useState<CustomsCodeOrder | null>(null);
  const [signMode, setSignMode] = useState<SignMode>('registration');
  const [selectedBatchId, setSelectedBatchId] = useState<string>();
  const [certificates, setCertificates] = useState<EImzoCertificate[]>([]);
  const [selectedCertificateIndex, setSelectedCertificateIndex] = useState<string>();
  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [eImzoError, setEImzoError] = useState<string | null>(null);
  const [localSigning, setLocalSigning] = useState(false);

  const getEImzoErrorMessage = useCallback(
    (err: unknown, fallback: string) => {
      if (err instanceof Error && err.message.startsWith(E_IMZO_ERROR_KEY_PREFIX)) {
        return t(err.message);
      }

      return err instanceof Error ? err.message : fallback;
    },
    [t]
  );

  useStatusChangeListRefresh(
    LifecycleTargetEntity.AggregatedCustomsCodeOrder,
    refreshCustomsCodes
  );

  const recentStatusChanges = useRecentStatusChanges(
    LifecycleTargetEntity.AggregatedCustomsCodeOrder
  );

  useEffect(() => {
    if (!error) return;

    toast.error(getApiErrorMessage(error, t('customsCodes.messages.loadError')));
  }, [error, t]);

  const loadCertificates = useCallback(() => {
    setCertificatesLoading(true);
    setEImzoError(null);
    eImzoClient
      .listCertificates()
      .then((items) => {
        setCertificates(items);
        setSelectedCertificateIndex(items.length > 0 ? '0' : undefined);
      })
      .catch((err: Error) => {
        setEImzoError(getEImzoErrorMessage(err, t('customsCodes.messages.signError')));
        setCertificates([]);
        setSelectedCertificateIndex(undefined);
      })
      .finally(() => {
        setCertificatesLoading(false);
      });
  }, [getEImzoErrorMessage, t]);

  useEffect(() => {
    if (!modalOpen) return;

    loadCertificates();
  }, [loadCertificates, modalOpen]);

  const rows = useMemo<CustomsCodeTableRow[]>(() => {
    return data.map((order, index) => ({
      key: order.id,
      number: (page - 1) * limit + index + 1,
      id: order.id,
      accOrderNumber: order.accOrderNumber ?? '-',
      orderId: order.orderId,
      batchId: order.batchId,
      productId: order.productId,
      quantity: order.quantity,
      customsCode: order.customsCode ?? '-',
      measurement: order.measurement?.value ?? '-',
      status: order.status,
      order,
    }));
  }, [data, limit, page]);

  const openSignModal = useCallback((order: CustomsCodeOrder, mode: SignMode) => {
    setSelectedOrder(order);
    setSignMode(mode);
    setSelectedCertificateIndex(undefined);
    setModalOpen(true);
  }, []);

  const closeSignModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
    setSignMode('registration');
    setCertificates([]);
    setSelectedCertificateIndex(undefined);
    setEImzoError(null);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
    setSelectedBatchId(undefined);
  };

  const handleCreate = async () => {
    if (!orgId || !selectedBatchId) return;

    try {
      const createdOrder = await createCustomsCodeOrder({
        companyId: orgId,
        batchId: selectedBatchId,
      }).unwrap();

      toast.success(t('customsCodes.messages.createSuccess'));
      closeCreateModal();

      for (let attempt = 0; attempt < 5; attempt += 1) {
        if (attempt > 0) {
          await wait(2000);
        }

        const refreshedOrder = await loadCustomsCodeOrder(createdOrder.id).unwrap();

        if (canSignRegistration(refreshedOrder)) {
          break;
        }
      }

      setPagination((prev) => ({ ...prev, page: 1 }));
    } catch (err) {
      toast.error(getApiErrorMessage(err, t('customsCodes.messages.createError')));
    }
  };

  const handleOpenEImzo = async () => {
    eImzoClient.openApplication();
    await wait(3000);
    loadCertificates();
  };

  const handleInitiateDissolution = useCallback(async (order: CustomsCodeOrder) => {
    try {
      const initiatedOrder = await initiateDissolution(order.id).unwrap();

      toast.success(t('customsCodes.messages.dissolutionInitiated'));

      let orderForSigning = initiatedOrder;

      for (let attempt = 0; attempt < 5 && !canSignDissolution(orderForSigning); attempt += 1) {
        if (attempt > 0) {
          await wait(2000);
        }

        orderForSigning = await loadCustomsCodeOrder(order.id).unwrap();
      }

      if (canSignDissolution(orderForSigning)) {
        openSignModal(orderForSigning, 'dissolution');
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, t('customsCodes.messages.dissolutionError')));
    }
  }, [initiateDissolution, loadCustomsCodeOrder, openSignModal, t]);

  const handleSign = async () => {
    if (!selectedOrder) return;

    const documentBase64 = signMode === 'registration'
      ? selectedOrder.external.registration.documentBase64
      : selectedOrder.external.dissolution.documentBase64;
    const certificate = selectedCertificateIndex
      ? certificates[Number(selectedCertificateIndex)]
      : undefined;

    if (!documentBase64) {
      toast.error(t('customsCodes.messages.documentMissing'));
      return;
    }

    if (!certificate) {
      toast.error(t('customsCodes.messages.selectKey'));
      return;
    }

    try {
      setLocalSigning(true);
      const keyId = await eImzoClient.loadKey(certificate);
      await eImzoClient.validateCertificate(certificate, keyId);
      const signedDocumentBase64 = await eImzoClient.createPkcs7(documentBase64, keyId, {
        detached: true,
      });

      const payload = {
        accOrderId: selectedOrder.id,
        signedDocumentBase64,
      };

      if (signMode === 'registration') {
        await signRegistration(payload).unwrap();
      } else {
        await signDissolution(payload).unwrap();
      }

      toast.success(t('customsCodes.messages.signSuccess'));
      closeSignModal();
    } catch (err) {
      const message = getEImzoErrorMessage(
        err,
        getApiErrorMessage(err, t('customsCodes.messages.signError'))
      );

      toast.error(message);
    } finally {
      setLocalSigning(false);
    }
  };

  const columns = useMemo<AdaptiveColumn<CustomsCodeTableRow>[]>(() => [
    {
      title: t('customsCodes.table.number'),
      dataIndex: 'number',
      key: 'number',
      width: 70,
      minWidth: 64,
    },
    {
      title: t('customsCodes.table.accOrderNumber'),
      dataIndex: 'accOrderNumber',
      key: 'accOrderNumber',
      minWidth: 150,
    },
    {
      title: t('customsCodes.table.customsCode'),
      dataIndex: 'customsCode',
      key: 'customsCode',
      minWidth: 160,
      flex: 1,
    },
    {
      title: t('customsCodes.table.quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      minWidth: 120,
    },
    {
      title: t('customsCodes.table.measurement'),
      dataIndex: 'measurement',
      key: 'measurement',
      minWidth: 110,
    },
    {
      title: t('customsCodes.table.status'),
      dataIndex: 'status',
      key: 'status',
      minWidth: 180,
      render: (status: AggregatedCustomsCodeOrderStatus) => (
        <EntityStatusBadge entity={StatusEntity.AggregatedCustomsCodeOrder} status={status} />
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 190,
      minWidth: 180,
      render: (_value, row) => {
        if (canSignRegistrationOrder && canSignRegistration(row.order)) {
          return (
            <CustomButton
              type="button"
              variant="outline"
              className="table-action-btn"
              onClick={(event) => {
                event.stopPropagation();
                openSignModal(row.order, 'registration');
            }}
          >
              {t('customsCodes.actions.sign')}
            </CustomButton>
          );
        }

        if (canDissolve && canInitiateDissolution(row.order)) {
          return (
            <CustomButton
              type="button"
              variant="outline"
              className="table-action-btn"
              disabled={dissolving}
              onClick={(event) => {
                event.stopPropagation();
                handleInitiateDissolution(row.order);
              }}
            >
              {dissolving && <SyncOutlined spin />}
              {t('customsCodes.actions.dissolve')}
            </CustomButton>
          );
        }

        if (!canSignDissolutionOrder || !canSignDissolution(row.order)) {
          return null;
        }

        return (
          <CustomButton
            type="button"
            variant="outline"
            className="table-action-btn"
            onClick={(event) => {
              event.stopPropagation();
              openSignModal(row.order, 'dissolution');
            }}
          >
            {t('customsCodes.actions.sign')}
          </CustomButton>
        );
      },
    },
  ], [
    canDissolve,
    canSignDissolutionOrder,
    canSignRegistrationOrder,
    dissolving,
    handleInitiateDissolution,
    openSignModal,
    t,
  ]);

  const batchOptions = useMemo(() => {
    return batches
      .filter((batch) => batch.packageType?.toLowerCase() === PackageType.Unit)
      .map((batch) => ({
        value: batch.batchId,
        label: `${batch.batchNumber} | ${batch.orderNumber} | ${batch.productName}`,
      }));
  }, [batches]);

  return (
    <MainLayout>
      <Heading title={t('customsCodes.title')} subtitle={t('customsCodes.subtitle')} totalAmount={`${total}`}>
        {canCreate && (
          <CustomButton onClick={() => setCreateModalOpen(true)}>
            {t('customsCodes.actions.create')}
          </CustomButton>
        )}
      </Heading>

      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <ComponentTable<CustomsCodeTableRow>
              columns={columns}
              data={rows}
              loading={loading}
              rowClassName={(record) =>
                recentStatusChanges.has(record.id) ? 'row-status-changed' : ''
              }
              onRowClick={
                canRead && orgId
                  ? (record) => navigate(`/organization/${orgId}/customs-codes/${record.id}`)
                  : undefined
              }
              pagination={{
                current: page,
                pageSize: limit,
                total,
                showSizeChanger: { showSearch: false },
                pageSizeOptions: ['10', '20', '30', '40', '50'],
                locale: { items_per_page: '' },
                onChange: (nextPage, nextLimit) =>
                  setPagination((prev) => ({
                    page: nextPage,
                    limit: nextLimit || prev.limit,
                  })),
              }}
            />
          </div>
        </div>
      </div>

      <ModalWindow
        title={t(`customsCodes.signModal.${signMode}Title`)}
        openModal={modalOpen}
        closeModal={closeSignModal}
        width="640px"
        maskClosable={!signing && !localSigning}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Alert
            type={eImzoError ? 'warning' : 'info'}
            showIcon
            message={eImzoError ?? t('customsCodes.signModal.hint')}
            description={eImzoError ? t('customsCodes.signModal.openAppHint') : undefined}
            action={
              eImzoError ? (
                <CustomButton size="sm" fullWidth={false} onClick={handleOpenEImzo}>
                  {t('customsCodes.signModal.openApp')}
                </CustomButton>
              ) : undefined
            }
          />

          <Select
            size="large"
            style={{ width: '100%' }}
            loading={certificatesLoading}
            disabled={certificatesLoading || signing || localSigning}
            placeholder={t('customsCodes.signModal.selectKey')}
            value={selectedCertificateIndex}
            notFoundContent={t('customsCodes.signModal.keysNotFound')}
            options={certificates.map((certificate, index) => ({
              value: String(index),
              label: getCertificateTitle(certificate),
            }))}
            onChange={setSelectedCertificateIndex}
          />

          <CustomButton
            onClick={handleSign}
            disabled={
              certificatesLoading ||
              signing ||
              localSigning ||
              !selectedCertificateIndex
            }
            className="btn-large"
          >
            {signing || localSigning ? (
              <Space>
                <SyncOutlined spin />
                {t('customsCodes.actions.signing')}
              </Space>
            ) : (
              t('customsCodes.actions.signAndSend')
            )}
          </CustomButton>
        </Space>
      </ModalWindow>

      <ModalWindow
        title={t('customsCodes.createModal.title')}
        openModal={createModalOpen}
        closeModal={closeCreateModal}
        width="640px"
        maskClosable={!creating}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Select
            size="large"
            style={{ width: '100%' }}
            loading={batchesLoading}
            disabled={batchesLoading || creating || !canListOrders}
            placeholder={t('customsCodes.createModal.selectBatch')}
            value={selectedBatchId}
            showSearch
            optionFilterProp="label"
            notFoundContent={t('customsCodes.createModal.batchesNotFound')}
            options={batchOptions}
            onChange={setSelectedBatchId}
          />

          <CustomButton
            onClick={handleCreate}
            disabled={batchesLoading || creating || !selectedBatchId || !canListOrders}
            className="btn-large"
          >
            {creating ? (
              <Space>
                <SyncOutlined spin />
                {t('customsCodes.actions.creating')}
              </Space>
            ) : (
              t('customsCodes.actions.create')
            )}
          </CustomButton>
        </Space>
      </ModalWindow>
    </MainLayout>
  );
};

export default CustomsCodesPage;
