import { useEffect, useMemo, useState } from 'react';
import { Alert, Empty, Input, Modal, Spin } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import DataMatrixScanner from 'shared/ui/dataMatrixScanner';
import CustomButton from 'shared/ui/button';
import { useAppDispatch, useAppSelector } from 'app/store';
import {
  clearDeliveryTaskById,
  completeDeliveryTaskDelivery,
  getDeliveryTaskById,
} from 'entities/deliveryTasks/model';
import {
  cancelScan,
  completeScanSession,
  createScanSession,
  replaceScanAttempts,
  resetScanSessionState,
  scanSessionCode,
} from 'entities/scanSessions/model';
import { ScanSessionType } from 'entities/scanSessions/types';
import { getBackendErrorMessage } from 'shared/lib/getBackendErrorMessage';
import { isAgentRole } from 'shared/lib/userRoles';

const SCAN_CACHE_PREFIX = 'delivery-task-scans';
const SCAN_RESULT_TOAST_ID = 'delivery-task-scan-result';

type ScannerMode = 'delivery' | 'delete' | null;

const getScanCacheKey = (taskId: string) => `${SCAN_CACHE_PREFIX}:${taskId}`;

const DeliveryTasksScan = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id, orgId } = useParams<{ id: string; orgId?: string }>();
  const { t } = useTranslation();

  const taskId = id ?? '';
  const task = useAppSelector((state) => state.deliveryTasks.taskById);
  const taskLoading = useAppSelector((state) => state.deliveryTasks.loadingById);
  const taskError = useAppSelector((state) => state.deliveryTasks.error);
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const scanSession = useAppSelector((state) => state.scanSessions.currentSession);
  const recentScans = useAppSelector((state) => state.scanSessions.recentScans);
  const isCreating = useAppSelector((state) => state.scanSessions.isCreating);
  const isScanning = useAppSelector((state) => state.scanSessions.isScanning);
  const isCompletingSession = useAppSelector((state) => state.scanSessions.isCompleting);
  const scanError = useAppSelector((state) => state.scanSessions.error);

  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [completeComment, setCompleteComment] = useState('');
  const [scannerMode, setScannerMode] = useState<ScannerMode>(null);
  const [isClosingSession, setIsClosingSession] = useState(false);

  const canUseScreen = isAgentRole(currentUser);
  const routePath = task?.deliveryRouteId
    ? orgId
      ? `/organization/${orgId}/delivery-routes/${task.deliveryRouteId}`
      : `/delivery-routes/${task.deliveryRouteId}`
    : orgId
      ? `/organization/${orgId}/delivery-routes`
      : '/delivery-routes';

  useEffect(() => {
    if (!taskId) return;

    dispatch(getDeliveryTaskById(taskId));
    dispatch(resetScanSessionState());

    try {
      const raw = localStorage.getItem(getScanCacheKey(taskId));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          dispatch(replaceScanAttempts(parsed));
        }
      }
    } catch {
      localStorage.removeItem(getScanCacheKey(taskId));
    }

    return () => {
      dispatch(clearDeliveryTaskById());
      dispatch(resetScanSessionState());
    };
  }, [dispatch, taskId]);

  useEffect(() => {
    if (!taskId) return;
    localStorage.setItem(getScanCacheKey(taskId), JSON.stringify(recentScans));
  }, [recentScans, taskId]);

  useEffect(() => {
    return () => {
      if (scanSession?.id && scanSession.status === 'active') {
        void dispatch(completeScanSession(scanSession.id));
      }
    };
  }, [dispatch, scanSession?.id, scanSession?.status]);

  const formatCodeForToast = (code: string) => {
    const trimmed = code.trim();
    if (trimmed.length <= 24) return trimmed;

    return `${trimmed.slice(0, 12)}...${trimmed.slice(-8)}`;
  };

  const pushSingleScanToast = (type: 'success' | 'error', message: string) => {
    if (toast.isActive(SCAN_RESULT_TOAST_ID)) {
      toast.update(SCAN_RESULT_TOAST_ID, {
        render: message,
        type,
        autoClose: 2200,
      });
      return;
    }

    toast[type](message, {
      toastId: SCAN_RESULT_TOAST_ID,
      autoClose: 2200,
    });
  };

  const productsById = useMemo(
    () =>
      new Map(
        (task?.items ?? []).map((item) => [
          item.product.id,
          {
            id: item.product.id,
            name: item.product.name,
            shortName: item.product.shortName,
          },
        ])
      ),
    [task?.items]
  );

  const acceptedScanGroups = useMemo(() => {
    const groups = new Map<
      string,
      { productId: string; productName: string; scans: typeof recentScans }
    >();

    recentScans.forEach((scan) => {
      if (scan.status !== 'accepted' || !scan.productId) return;

      const product = productsById.get(scan.productId);
      const existing = groups.get(scan.productId);
      if (existing) {
        existing.scans.push(scan);
        return;
      }

      groups.set(scan.productId, {
        productId: scan.productId,
        productName: product?.name ?? scan.productId,
        scans: [scan],
      });
    });

    return Array.from(groups.values());
  }, [productsById, recentScans]);

  const rejectedScans = useMemo(
    () => recentScans.filter((scan) => scan.status === 'rejected'),
    [recentScans]
  );

  const incompleteProducts = useMemo(
    () => (task?.items ?? []).filter((item) => item.quantities.delivered < item.quantities.planned),
    [task?.items]
  );

  const refreshTask = async () => {
    if (!taskId) return;
    await dispatch(getDeliveryTaskById(taskId));
  };

  const handleStartScanning = async () => {
    if (!task?.id) return;

    if (scanSession?.id && scanSession.status === 'active') {
      setScannerMode('delivery');
      return;
    }

    try {
      await dispatch(
        createScanSession({
          type: ScanSessionType.Delivery,
          routeId: task.deliveryRouteId,
          taskId: task.id,
        })
      ).unwrap();
      setScannerMode('delivery');
    } catch (error) {
      toast.error(
        getBackendErrorMessage(
          error,
          t('deliveryTasks.messages.error.createScanSession', {
            defaultValue: 'Не удалось начать сессию сканирования',
          })
        )
      );
    }
  };

  const handleStartDeleteScanning = () => {
    setScannerMode('delete');
  };

  const handleScannerClose = async () => {
    if (scannerMode !== 'delivery' || !scanSession?.id) {
      setScannerMode(null);
      return;
    }

    if (scanSession.status !== 'active') {
      setScannerMode(null);
      return;
    }

    try {
      setIsClosingSession(true);
      await dispatch(completeScanSession(scanSession.id)).unwrap();
    } catch (error) {
      toast.error(
        getBackendErrorMessage(
          error,
          t('deliveryTasks.messages.error.completeScanSession', {
            defaultValue: 'Не удалось завершить сессию сканирования',
          })
        )
      );
    } finally {
      setIsClosingSession(false);
      setScannerMode(null);
    }
  };

  void handleScannerClose;

  const handleScan = async (code: string) => {
    if (!task?.id) {
      return {
        status: 'rejected' as const,
        reason: t('common.dataNotFound'),
      };
    }

    if (scannerMode === 'delete') {
      try {
        await dispatch(
          cancelScan({
            code,
            routeId: task.deliveryRouteId,
            taskId: task.id,
          })
        ).unwrap();

        await refreshTask();
        pushSingleScanToast(
          'success',
          t('deliveryTasks.messages.success.cancelScan', {
            defaultValue: 'Скан {{code}} удалён',
            code: formatCodeForToast(code),
          })
        );

        return { status: 'accepted' as const };
      } catch (error: any) {
        const reason = getBackendErrorMessage(
          error?.error ?? error,
          t('deliveryTasks.messages.error.cancelScan', {
            defaultValue: 'Не удалось удалить скан',
          })
        );

        pushSingleScanToast(
          'error',
          t('deliveryTasks.messages.error.scanCodeDetailed', {
            defaultValue: 'Код {{code}} отклонён: {{reason}}',
            code: formatCodeForToast(code),
            reason,
          })
        );

        return {
          status: 'rejected' as const,
          reason,
        };
      }
    }

    if (!scanSession?.id) {
      return {
        status: 'rejected' as const,
        reason: t('deliveryTasks.messages.error.scanSessionRequired', {
          defaultValue: 'Сначала запустите сессию сканирования',
        }),
      };
    }

    try {
      await dispatch(
        scanSessionCode({
          sessionId: scanSession.id,
          code,
        })
      ).unwrap();

      await refreshTask();
      pushSingleScanToast(
        'success',
        t('deliveryTasks.messages.success.scanCode', {
          defaultValue: 'Код {{code}} отсканирован',
          code: formatCodeForToast(code),
        })
      );

      return { status: 'accepted' as const };
    } catch (error: any) {
      const reason = getBackendErrorMessage(
        error?.error ?? error,
        t('deliveryTasks.messages.error.scanCode', {
          defaultValue: 'Ошибка сканирования',
        })
      );

      pushSingleScanToast(
        'error',
        t('deliveryTasks.messages.error.scanCodeDetailed', {
          defaultValue: 'Код {{code}} отклонён: {{reason}}',
          code: formatCodeForToast(code),
          reason,
        })
      );

      return {
        status: 'rejected' as const,
        reason,
      };
    }
  };

  const executeCompleteDelivery = async (comment?: string) => {
    if (!task?.id) return;

    try {
      if (scanSession?.id && scanSession.status === 'active') {
        await dispatch(completeScanSession(scanSession.id)).unwrap();
      }

      await dispatch(
        completeDeliveryTaskDelivery({
          id: task.id,
          payload: comment?.trim() ? { comment: comment.trim() } : undefined,
        })
      ).unwrap();

      localStorage.removeItem(getScanCacheKey(task.id));
      navigate(routePath);
    } catch (error) {
      toast.error(
        getBackendErrorMessage(
          error,
          t('deliveryTasks.messages.error.completeDelivery', {
            defaultValue: 'Не удалось завершить выдачу',
          })
        )
      );
    }
  };

  const handleComplete = async () => {
    if (incompleteProducts.length > 0) {
      setCompleteModalOpen(true);
      return;
    }

    await executeCompleteDelivery();
  };

  const handleForceComplete = async () => {
    if (!completeComment.trim()) {
      toast.error(
        t('deliveryTasks.warnings.commentRequired', {
          defaultValue: 'Укажите причину недостачи перед завершением выдачи',
        })
      );
      return;
    }

    setCompleteModalOpen(false);
    await executeCompleteDelivery(completeComment);
  };

  const handleDeleteScan = async (code: string) => {
    if (!task?.id) return;

    try {
      await dispatch(
        cancelScan({
          code,
          routeId: task.deliveryRouteId,
          taskId: task.id,
        })
      ).unwrap();

      await refreshTask();
      toast.success(
        t('deliveryTasks.messages.success.cancelScan', {
          defaultValue: 'Скан {{code}} удалён',
          code: formatCodeForToast(code),
        })
      );
    } catch (error: any) {
      toast.error(
        getBackendErrorMessage(
          error?.error ?? error,
          t('deliveryTasks.messages.error.cancelScan', {
            defaultValue: 'Не удалось удалить скан',
          })
        )
      );
    }
  };

  const handleCloseScannerView = async () => {
    setScannerMode(null);
  };

  const lastScansContent = (
    <div className="loading-scans-groups">
      {acceptedScanGroups.length === 0 && rejectedScans.length === 0 && (
        <div className="dm-scanner-empty">{t('scanner.empty')}</div>
      )}

      {acceptedScanGroups.map((group) => (
        <section key={group.productId} className="loading-scan-group">
          <div className="loading-scan-group-title">
            <span>{group.productName}</span>
            <span className="loading-scan-group-count">{group.scans.length}</span>
          </div>
          <div className="loading-scan-group-items">
            {group.scans.map((scan) => (
              <div key={`${scan.code}-${scan.ts}`} className="loading-scan-item accepted">
                <div className="loading-scan-item-code">{scan.code}</div>
                <button
                  type="button"
                  className="loading-scan-item-delete"
                  aria-label={t('deliveryTasks.actions.deleteScan', { defaultValue: 'Удалить' })}
                  title={t('deliveryTasks.actions.deleteScan', { defaultValue: 'Удалить' })}
                  onClick={() => void handleDeleteScan(scan.code)}
                >
                  <DeleteOutlined />
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}

      {rejectedScans.length > 0 && (
        <section className="loading-scan-group loading-scan-group-errors">
          <div className="loading-scan-group-title">
            <span>{t('deliveryTasks.warnings.scanErrors', { defaultValue: 'Ошибки сканирования' })}</span>
            <span className="loading-scan-group-count">{rejectedScans.length}</span>
          </div>
          <div className="loading-scan-group-items">
            {rejectedScans.map((scan) => (
              <div key={`${scan.code}-${scan.ts}`} className="loading-scan-item rejected">
                <div className="loading-scan-item-code">{scan.code}</div>
                <div className="loading-scan-item-reason">{scan.reason}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  if (!canUseScreen) {
    return (
      <MainLayout>
        <Heading title={t('deliveryTasks.scanTitle')} subtitle={t('deliveryTasks.scanSubtitle')} />
        <div className="box">
          <div className="box-container">
            <div className="box-container-items loading-page-state">
              <Empty description={t('common.dataNotFound', { defaultValue: 'Доступ запрещён' })} />
              <CustomButton className="outline" onClick={() => navigate(routePath)}>
                {t('common.backToRoute')}
              </CustomButton>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (taskLoading && !task) {
    return (
      <MainLayout>
        <Heading title={t('deliveryTasks.scanTitle')} subtitle={t('deliveryTasks.scanSubtitle')} />
        <div className="box">
          <div className="box-container">
            <div className="box-container-items loading-page-state">
              <Spin size="large" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!task) {
    return (
      <MainLayout>
        <Heading title={t('deliveryTasks.scanTitle')} subtitle={t('deliveryTasks.scanSubtitle')} />
        <div className="box">
          <div className="box-container">
            <div className="box-container-items loading-page-state">
              <Empty description={taskError || t('common.dataNotFound')} />
              <CustomButton className="outline" onClick={() => navigate(routePath)}>
                {t('common.backToRoute')}
              </CustomButton>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const counters = [
    {
      label: t('deliveryTasks.table.planned', { defaultValue: 'Запланировано' }),
      value: task.totals.plannedQuantity,
    },
    {
      label: t('deliveryTasks.table.delivered', { defaultValue: 'Выдано' }),
      value: task.totals.deliveredQuantity,
    },
    {
      label: t('deliveryTasks.table.products', { defaultValue: 'Товаров' }),
      value: task.items.length,
    },
  ];

  return (
    <MainLayout>
      <Heading
        title={`${t('deliveryTasks.scanTitle')}: ${task.taskNumber}`}
        subtitle={task.customer.name}
      >
        <div className="btns-group">
          <CustomButton
            className="primary"
            onClick={handleStartScanning}
            disabled={isCreating || isClosingSession || scannerMode === 'delete'}
          >
            {isCreating ? t('scanner.creatingSession') : t('scanner.startScanning')}
          </CustomButton>
          <CustomButton
            className="danger"
            onClick={handleStartDeleteScanning}
            disabled={isCreating || isCompletingSession || isClosingSession || scannerMode === 'delivery'}
          >
            {t('deliveryTasks.actions.deleteByScanning', { defaultValue: 'Удалить сканированием' })}
          </CustomButton>
          {scanSession?.status === 'active' && scannerMode !== 'delete' && (
            <CustomButton
              className="outline"
              onClick={() => void handleComplete()}
              disabled={isCreating || isCompletingSession || isClosingSession}
            >
              {isCompletingSession ? t('scanner.completingSession') : t('deliveryTasks.actions.completeDelivery')}
            </CustomButton>
          )}
          <CustomButton className="outline" onClick={() => navigate(routePath)}>
            {t('common.backToRoute')}
          </CustomButton>
        </div>
      </Heading>

      <div className="box">
        <div className="box-container">
          <div className="box-container-items loading-page-layout">
            <section className="loading-hero-section">
              <div className="loading-route-counters">
                {counters.map((counter) => (
                  <div key={counter.label} className="loading-route-counter">
                    <span className="loading-route-counter-label">{counter.label}</span>
                    <span className="loading-route-counter-value">{counter.value}</span>
                  </div>
                ))}
              </div>

              <div className="detail-card detail-card-full loading-products-card">
                <h4>{t('deliveryTasks.sections.items', { defaultValue: 'Товары к выдаче' })}</h4>
                {!task.items.length ? (
                  <Empty description={t('deliveryTasks.details.itemsEmpty')} />
                ) : (
                  <div className="loading-products-table">
                    <div className="loading-products-table-head">
                      <span>{t('salesOrders.fields.product')}</span>
                      <span>{t('deliveryTasks.table.planned', { defaultValue: 'Запланировано' })}</span>
                      <span>{t('deliveryTasks.table.delivered', { defaultValue: 'Выдано' })}</span>
                    </div>
                    {task.items.map((item) => (
                      <div key={item.salesOrderItemId} className="loading-products-table-row">
                        <div className="loading-products-product">
                          <span className="loading-products-product-name">{item.product.name}</span>
                          {item.product.shortName && (
                            <span className="loading-products-product-short">{item.product.shortName}</span>
                          )}
                        </div>
                        <div className="loading-products-cell">
                          <span className="loading-products-cell-label">
                            {t('deliveryTasks.table.planned', { defaultValue: 'Запланировано' })}
                          </span>
                          <span>{item.quantities.planned}</span>
                        </div>
                        <div className="loading-products-cell">
                          <span className="loading-products-cell-label">
                            {t('deliveryTasks.table.delivered', { defaultValue: 'Выдано' })}
                          </span>
                          <span>{item.quantities.delivered}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="loading-scanner-section">
              {(scanError || taskError) && !recentScans.length && <Alert type="error" showIcon message={scanError || taskError} />}

              <DataMatrixScanner
                title={
                  scannerMode === 'delete'
                    ? t('deliveryTasks.actions.deleteByScanning', { defaultValue: 'Удалить сканированием' })
                    : `${t('deliveryTasks.scanTitle')}: ${task.taskNumber}`
                }
                subtitle={
                  scannerMode === 'delete'
                    ? t('deliveryTasks.scanner.deleteSubtitle', {
                        defaultValue: 'Отсканируйте код, который нужно удалить из выдачи',
                      })
                    : task.customer.name
                }
                onScan={handleScan}
                lastScans={recentScans}
                acceptedCount={scanSession?.counters.accepted ?? 0}
                rejectedCount={scanSession?.counters.rejected ?? 0}
                primaryActionLabel={
                  scannerMode === 'delivery' ? t('deliveryTasks.actions.completeDelivery') : undefined
                }
                onPrimaryAction={scannerMode === 'delivery' ? () => void handleComplete() : undefined}
                enableCamera={scannerMode !== null}
                cameraAutoStart={scannerMode !== null}
                scanDisabled={
                  scannerMode === 'delivery'
                    ? !scanSession || isCreating || isCompletingSession || isClosingSession
                    : scannerMode === 'delete'
                      ? isCreating || isCompletingSession || isClosingSession
                      : true
                }
                scanInProgress={isScanning}
                lastScansContent={lastScansContent}
                onCameraClose={handleCloseScannerView}
              />
            </section>
          </div>
        </div>
      </div>

      <Modal
        title={t('deliveryTasks.warnings.title', { defaultValue: 'Есть недовыдача по товарам' })}
        open={completeModalOpen}
        onCancel={() => setCompleteModalOpen(false)}
        onOk={() => void handleForceComplete()}
        okText={t('deliveryTasks.warnings.forceComplete', { defaultValue: 'Завершить принудительно' })}
        cancelText={t('common.cancel', { defaultValue: 'Отмена' })}
      >
        <div className="loading-complete-warning">
          <p>
            {t('deliveryTasks.warnings.description', {
              defaultValue:
                'По этим товарам выданное количество меньше запланированного. Для завершения укажите причину недостачи.',
            })}
          </p>
          <div className="loading-complete-warning-list">
            {incompleteProducts.map((item) => (
              <div key={item.salesOrderItemId} className="loading-complete-warning-item">
                <span>{item.product.name}</span>
                <span>
                  {item.quantities.delivered} / {item.quantities.planned}
                </span>
              </div>
            ))}
          </div>
          <Input.TextArea
            rows={4}
            value={completeComment}
            onChange={(event) => setCompleteComment(event.target.value)}
            placeholder={t('deliveryTasks.warnings.commentPlaceholder', {
              defaultValue: 'Укажите причину недостачи',
            })}
          />
        </div>
      </Modal>
    </MainLayout>
  );
};

export default DeliveryTasksScan;

