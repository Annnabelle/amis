import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Button, Select, Space, Tag } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'app/store';
import {
  createCustomsCode,
  fetchCustomsCodeById,
  fetchCustomsCodes,
  initiateDissolutionAggregatedCustomsCodeOrder,
  signDissolutionAggregatedCustomsCodeOrder,
  signRegistrationAggregatedCustomsCodeOrder,
} from 'entities/customsCodes/model';
import { fetchMarkingCodes } from 'entities/markingCodes/model';
import { OrderStatusType } from 'entities/markingCodes/types';
import {
  AggregatedCustomsCodeOrderStatus,
  type CustomsCodeOrder,
} from 'entities/customsCodes/types';
import { endpointAccessMap } from 'shared/config/endpointAccessMap';
import { AvailablePackageType } from 'shared/types/dtos';
import { useCan } from 'entities/access/lib';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import ComponentTable from 'shared/ui/table';
import ModalWindow from 'shared/ui/modalWindow';
import CustomButton from 'shared/ui/button';
import type { AdaptiveColumn } from 'shared/ui/table/types';
import {
  eImzoClient,
  getCertificateTitle,
  type EImzoCertificate,
} from 'shared/lib/eImzo';
import { getBackendErrorMessage } from 'shared/lib/getBackendErrorMessage';

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

const statusColors: Partial<Record<AggregatedCustomsCodeOrderStatus, string>> = {
  [AggregatedCustomsCodeOrderStatus.New]: 'default',
  [AggregatedCustomsCodeOrderStatus.Generated]: 'geekblue',
  [AggregatedCustomsCodeOrderStatus.ReadyForSign]: 'processing',
  [AggregatedCustomsCodeOrderStatus.SignedForRegistration]: 'blue',
  [AggregatedCustomsCodeOrderStatus.Verified]: 'cyan',
  [AggregatedCustomsCodeOrderStatus.VerifiedForRegistration]: 'cyan',
  [AggregatedCustomsCodeOrderStatus.Registered]: 'success',
  [AggregatedCustomsCodeOrderStatus.DissolutionInitialized]: 'warning',
  [AggregatedCustomsCodeOrderStatus.SignedForDissolution]: 'orange',
  [AggregatedCustomsCodeOrderStatus.VerifiedForDissolution]: 'magenta',
  [AggregatedCustomsCodeOrderStatus.Dissolved]: 'purple',
};

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
  const dispatch = useAppDispatch();
  const canCreate = useCan(endpointAccessMap.customsCodesCreate);
  const canSignRegistrationOrder = useCan(endpointAccessMap.customsCodesSignRegistration);
  const canDissolve = useCan(endpointAccessMap.customsCodesInitiateDissolution);
  const canSignDissolutionOrder = useCan(endpointAccessMap.customsCodesSignDissolution);
  const canListOrders = useCan(endpointAccessMap.ordersList);
  const { data, total, page, limit, loading, creating, dissolving, signing, error } = useAppSelector(
    (state) => state.customsCodes
  );
  const batches = useAppSelector((state) => state.markingCodes.data);
  const batchesLoading = useAppSelector((state) => state.markingCodes.loading);

  const [modalOpen, setModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
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

  useEffect(() => {
    if (!orgId) return;

    dispatch(fetchCustomsCodes({ page, limit }));
  }, [dispatch, orgId, page, limit]);

  useEffect(() => {
    if (!error) return;

    toast.error(getBackendErrorMessage(error, t('customsCodes.messages.loadError')));
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

  useEffect(() => {
    if (!createModalOpen || !canListOrders) return;

    dispatch(
      fetchMarkingCodes({
        page: 1,
        limit: 50,
        status: OrderStatusType.CodesAggregated,
        packageType: AvailablePackageType.Unit,
      })
    );
  }, [canListOrders, createModalOpen, dispatch]);

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
      measurement: order.measurement ?? '-',
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
      const createdOrder = await dispatch(
        createCustomsCode({
          companyId: orgId,
          batchId: selectedBatchId,
        })
      ).unwrap();

      toast.success(t('customsCodes.messages.createSuccess'));
      closeCreateModal();

      for (let attempt = 0; attempt < 5; attempt += 1) {
        if (attempt > 0) {
          await wait(2000);
        }

        const refreshedOrder = await dispatch(fetchCustomsCodeById(createdOrder.id)).unwrap();

        if (canSignRegistration(refreshedOrder)) {
          break;
        }
      }

      dispatch(fetchCustomsCodes({ page: 1, limit }));
    } catch (err) {
      toast.error(getBackendErrorMessage(err, t('customsCodes.messages.createError')));
    }
  };

  const handleOpenEImzo = async () => {
    eImzoClient.openApplication();
    await wait(3000);
    loadCertificates();
  };

  const handleInitiateDissolution = useCallback(async (order: CustomsCodeOrder) => {
    try {
      const initiatedOrder = await dispatch(
        initiateDissolutionAggregatedCustomsCodeOrder(order.id)
      ).unwrap();

      toast.success(t('customsCodes.messages.dissolutionInitiated'));

      let orderForSigning = initiatedOrder;

      for (let attempt = 0; attempt < 5 && !canSignDissolution(orderForSigning); attempt += 1) {
        if (attempt > 0) {
          await wait(2000);
        }

        orderForSigning = await dispatch(fetchCustomsCodeById(order.id)).unwrap();
      }

      dispatch(fetchCustomsCodes({ page, limit }));

      if (canSignDissolution(orderForSigning)) {
        openSignModal(orderForSigning, 'dissolution');
      }
    } catch (err) {
      toast.error(getBackendErrorMessage(err, t('customsCodes.messages.dissolutionError')));
    }
  }, [dispatch, limit, openSignModal, page, t]);

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
      const signedDocumentBase64 = await eImzoClient.createPkcs7(documentBase64, keyId, {
        detached: true,
      });

      const payload = {
        accOrderId: selectedOrder.id,
        signedDocumentBase64,
      };

      if (signMode === 'registration') {
        await dispatch(signRegistrationAggregatedCustomsCodeOrder(payload)).unwrap();
      } else {
        await dispatch(signDissolutionAggregatedCustomsCodeOrder(payload)).unwrap();
      }

      toast.success(t('customsCodes.messages.signSuccess'));
      closeSignModal();
      dispatch(fetchCustomsCodes({ page, limit }));
    } catch (err) {
      const message = getEImzoErrorMessage(
        err,
        getBackendErrorMessage(err, t('customsCodes.messages.signError'))
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
        <Tag color={statusColors[status]}>{t(`customsCodes.statuses.${status}`)}</Tag>
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
              className="outline table-action-btn"
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
              className="outline table-action-btn"
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
            className="outline table-action-btn"
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
      .filter((batch) => batch.packageType?.toLowerCase() === AvailablePackageType.Unit)
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
              pagination={{
                current: page,
                pageSize: limit,
                total,
                showSizeChanger: { showSearch: false },
                pageSizeOptions: ['10', '20', '30', '40', '50'],
                locale: { items_per_page: '' },
                onChange: (nextPage, nextLimit) => {
                  dispatch(fetchCustomsCodes({ page: nextPage, limit: nextLimit || limit }));
                },
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
                <Button size="small" type="primary" onClick={handleOpenEImzo}>
                  {t('customsCodes.signModal.openApp')}
                </Button>
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
