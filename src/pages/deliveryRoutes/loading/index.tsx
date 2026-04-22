import { useEffect, useMemo, useState } from 'react';
import { Alert, Empty, Input, Modal, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import DataMatrixScanner from 'shared/ui/dataMatrixScanner';
import CustomButton from 'shared/ui/button';
import { useAppDispatch, useAppSelector } from 'app/store';
import { getDeliveryRouteById } from 'entities/deliveryRoutes/model';
import {
  completeScanSession,
  createScanSession,
  cancelScan,
  replaceScanAttempts,
  resetScanSessionState,
  scanSessionCode,
} from 'entities/scanSessions/model';
import { ScanSessionType } from 'entities/scanSessions/types';
import { getBackendErrorMessage } from 'shared/lib/getBackendErrorMessage';
import { completeDeliveryRouteLoading } from 'entities/deliveryRoutes/model';
import { isWarehouseRole } from 'shared/lib/userRoles';

const SCAN_CACHE_PREFIX = 'loading-scans';
const SCAN_RESULT_TOAST_ID = 'loading-scan-result';
type ScannerMode = 'loading' | 'delete' | null;

const getScanCacheKey = (routeId: string) => `${SCAN_CACHE_PREFIX}:${routeId}`;

const DeliveryRoutesLoading = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id, orgId } = useParams<{ id: string; orgId?: string }>();
  const { t } = useTranslation();

  const routeId = id ?? '';
  const backPath = orgId ? `/organization/${orgId}/delivery-routes` : '/delivery-routes';

  const route = useAppSelector((state) => state.deliveryRoutes.routeById);
  const routeLoading = useAppSelector((state) => state.deliveryRoutes.loadingById);
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const scanSession = useAppSelector((state) => state.scanSessions.currentSession);
  const recentScans = useAppSelector((state) => state.scanSessions.recentScans);
  const isCreating = useAppSelector((state) => state.scanSessions.isCreating);
  const isScanning = useAppSelector((state) => state.scanSessions.isScanning);
  const isCompleting = useAppSelector((state) => state.scanSessions.isCompleting);
  const scanError = useAppSelector((state) => state.scanSessions.error);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [completeComment, setCompleteComment] = useState('');
  const [scannerMode, setScannerMode] = useState<ScannerMode>(null);
  const isClosingSession = false;
  const canUseScreen = isWarehouseRole(currentUser);

  useEffect(() => {
    if (!routeId) return;

    dispatch(getDeliveryRouteById(routeId));
    dispatch(resetScanSessionState());

    try {
      const raw = localStorage.getItem(getScanCacheKey(routeId));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          dispatch(replaceScanAttempts(parsed));
        }
      }
    } catch {
      localStorage.removeItem(getScanCacheKey(routeId));
    }

    return () => {
      dispatch(resetScanSessionState());
    };
  }, [dispatch, routeId]);

  useEffect(() => {
    if (!routeId) return;

    localStorage.setItem(getScanCacheKey(routeId), JSON.stringify(recentScans));
  }, [recentScans, routeId]);

  useEffect(() => {
    return () => {
      if (scanSession?.id && scanSession.status === 'active') {
        void dispatch(completeScanSession(scanSession.id));
      }
    };
  }, [dispatch, scanSession?.id, scanSession?.status]);

  const headingTitle = route?.routeNumber
    ? `${t('deliveryRoutes.loadingPageTitle')} (${route.routeNumber})`
    : t('deliveryRoutes.loadingTitle');

  const productRows = route?.products ?? [];
  const totals = route?.totals;

  const smallCounters = useMemo(
    () => [
      {
        label: t('deliveryRoutes.loadingCounters.planned'),
        value: totals?.plannedQuantity ?? 0,
      },
      {
        label: t('deliveryRoutes.loadingCounters.loaded'),
        value: totals?.loadedQuantity ?? 0,
      },
      {
        label: t('deliveryRoutes.loadingCounters.products'),
        value: productRows.length,
      },
    ],
    [productRows.length, t, totals?.loadedQuantity, totals?.plannedQuantity]
  );

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
        (route?.products ?? []).map((product) => [
          product.id,
          {
            id: product.id,
            name: product.name,
            shortName: product.shortName,
          },
        ])
      ),
    [route?.products]
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
    () =>
      productRows.filter(
        (product) => product.quantities.loadedQuantity < product.quantities.plannedQuantity
      ),
    [productRows]
  );

  const handleStartScanning = async () => {
    if (!routeId) return;

    if (scanSession?.id && scanSession.status === 'active') {
      setScannerMode('loading');
      return;
    }

    try {
      await dispatch(
        createScanSession({
          type: ScanSessionType.Loading,
          routeId,
        })
      ).unwrap();
      setScannerMode('loading');
    } catch (error) {
      toast.error(
        getBackendErrorMessage(error, t('deliveryRoutes.messages.error.createScanSession'))
      );
    }
  };

  const handleStartDeleteScanning = () => {
    setScannerMode('delete');
  };

  const handleScan = async (code: string) => {
    if (scannerMode === 'delete') {
      try {
        await dispatch(
          cancelScan({
            code,
            routeId,
          })
        ).unwrap();

        await dispatch(getDeliveryRouteById(routeId));
        pushSingleScanToast(
          'success',
          t('deliveryRoutes.messages.success.cancelScan', {
            defaultValue: 'Скан {{code}} удалён',
            code: formatCodeForToast(code),
          })
        );

        return { status: 'accepted' as const };
      } catch (error: any) {
        const reason = getBackendErrorMessage(
          error?.error ?? error,
          t('deliveryRoutes.messages.error.cancelScan', {
            defaultValue: 'Не удалось удалить скан',
          })
        );

        pushSingleScanToast(
          'error',
          t('deliveryRoutes.messages.error.scanCodeDetailed', {
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
        reason: t('deliveryRoutes.messages.error.scanSessionRequired'),
      };
    }

    try {
      await dispatch(
        scanSessionCode({
          sessionId: scanSession.id,
          code,
        })
      ).unwrap();

      await dispatch(getDeliveryRouteById(routeId));
      pushSingleScanToast(
        'success',
        t('deliveryRoutes.messages.success.scanCode', {
          code: formatCodeForToast(code),
        })
      );

      return { status: 'accepted' as const };
    } catch (error: any) {
      const reason = getBackendErrorMessage(error?.error ?? error, t('deliveryRoutes.messages.error.scanCode'));

      pushSingleScanToast(
        'error',
        t('deliveryRoutes.messages.error.scanCodeDetailed', {
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

  const executeCompleteLoading = async (comment?: string) => {
    try {
      if (scanSession?.id && scanSession.status === 'active') {
        await dispatch(completeScanSession(scanSession.id)).unwrap();
      }

      await dispatch(
        completeDeliveryRouteLoading({
          id: routeId,
          payload: comment?.trim() ? { comment: comment.trim() } : undefined,
        })
      ).unwrap();
      localStorage.removeItem(getScanCacheKey(routeId));
      navigate(`${backPath}/${routeId}`);
    } catch (error) {
      toast.error(
        getBackendErrorMessage(error, t('deliveryRoutes.messages.error.completeScanSession'))
      );
    }
  };

  const handleComplete = async () => {
    if (incompleteProducts.length > 0) {
      setCompleteModalOpen(true);
      return;
    }

    await executeCompleteLoading();
  };

  const handleForceComplete = async () => {
    if (!completeComment.trim()) {
      toast.error(
        t('deliveryRoutes.loadingWarnings.commentRequired', {
          defaultValue: 'Укажите причину недостачи перед завершением погрузки',
        })
      );
      return;
    }

    setCompleteModalOpen(false);
    await executeCompleteLoading(completeComment);
  };

  const handleDeleteScan = async (code: string) => {
    try {
      await dispatch(
        cancelScan({
          code,
          routeId,
        })
      ).unwrap();

      await dispatch(getDeliveryRouteById(routeId));
      toast.success(
        t('deliveryRoutes.messages.success.cancelScan', {
          defaultValue: 'Скан {{code}} удалён',
          code: formatCodeForToast(code),
        })
      );
    } catch (error: any) {
      toast.error(
        getBackendErrorMessage(error?.error ?? error, t('deliveryRoutes.messages.error.cancelScan', {
          defaultValue: 'Не удалось удалить скан',
        }))
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
                  onClick={() => void handleDeleteScan(scan.code)}
                >
                  {t('deliveryRoutes.actions.deleteScan', { defaultValue: 'Удалить' })}
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}

      {rejectedScans.length > 0 && (
        <section className="loading-scan-group loading-scan-group-errors">
          <div className="loading-scan-group-title">
            <span>{t('deliveryRoutes.loadingWarnings.scanErrors', { defaultValue: 'Ошибки сканирования' })}</span>
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

  if (routeLoading && !route) {
    return (
      <MainLayout>
        <Heading title={t('deliveryRoutes.loadingTitle')} subtitle={t('deliveryRoutes.loadingSubtitle')} />
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

  if (!route) {
    return (
      <MainLayout>
        <Heading title={t('deliveryRoutes.loadingTitle')} subtitle={t('deliveryRoutes.loadingSubtitle')} />
        <div className="box">
          <div className="box-container">
            <div className="box-container-items loading-page-state">
              <Empty description={t('common.dataNotFound')} />
              <CustomButton className="outline" onClick={() => navigate(backPath)}>
                {t('common.backToList')}
              </CustomButton>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!canUseScreen) {
    return (
      <MainLayout>
        <Heading title={t('deliveryRoutes.loadingTitle')} subtitle={t('deliveryRoutes.loadingSubtitle')} />
        <div className="box">
          <div className="box-container">
            <div className="box-container-items loading-page-state">
              <Empty description={t('common.dataNotFound', { defaultValue: 'Доступ запрещён' })} />
              <CustomButton className="outline" onClick={() => navigate(backPath)}>
                {t('common.backToRoute')}
              </CustomButton>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Heading title={headingTitle} subtitle={t('deliveryRoutes.loadingSubtitle')}>
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
            disabled={isCreating || isCompleting || isClosingSession || scannerMode === 'loading'}
          >
            {t('deliveryRoutes.actions.deleteByScanning', { defaultValue: 'Удалить сканированием' })}
          </CustomButton>
          {scanSession?.status === 'active' && scannerMode !== 'delete' && (
            <CustomButton
              className="outline"
              onClick={() => void handleComplete()}
              disabled={isCreating || isCompleting || isClosingSession}
            >
              {isCompleting ? t('scanner.completingSession') : t('deliveryRoutes.actions.completeLoading')}
            </CustomButton>
          )}
          <CustomButton className="outline" onClick={() => navigate(`${backPath}/${routeId}`)}>
            {t('common.backToRoute')}
          </CustomButton>
        </div>
      </Heading>

      <div className="box">
        <div className="box-container">
          <div className="box-container-items loading-page-layout">
            <section className="loading-hero-section">
              <div className="loading-route-counters">
                {smallCounters.map((counter) => (
                  <div key={counter.label} className="loading-route-counter">
                    <span className="loading-route-counter-label">{counter.label}</span>
                    <span className="loading-route-counter-value">{counter.value}</span>
                  </div>
                ))}
              </div>

              <div className="detail-card detail-card-full loading-products-card">
                <h4>{t('deliveryRoutes.sections.loadingProducts')}</h4>
                {!productRows.length ? (
                  <Empty description={t('deliveryRoutes.details.loadingEmpty')} />
                ) : (
                  <div className="loading-products-table">
                    <div className="loading-products-table-head">
                      <span>{t('salesOrders.fields.product')}</span>
                      <span>{t('deliveryRoutes.loadingTable.planned')}</span>
                      <span>{t('deliveryRoutes.loadingTable.loaded')}</span>
                    </div>
                    {productRows.map((product) => (
                      <div key={product.id} className="loading-products-table-row">
                        <div className="loading-products-product">
                          <span className="loading-products-product-name">{product.name}</span>
                          {product.shortName && (
                            <span className="loading-products-product-short">{product.shortName}</span>
                          )}
                        </div>
                        <div className="loading-products-cell">
                          <span className="loading-products-cell-label">{t('deliveryRoutes.loadingTable.planned')}</span>
                          <span>{product.quantities.plannedQuantity}</span>
                        </div>
                        <div className="loading-products-cell">
                          <span className="loading-products-cell-label">{t('deliveryRoutes.loadingTable.loaded')}</span>
                          <span>{product.quantities.loadedQuantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="loading-scanner-section">
              {scanError && !recentScans.length && <Alert type="error" showIcon message={scanError} />}

              <DataMatrixScanner
                title={
                  scannerMode === 'delete'
                    ? t('deliveryRoutes.actions.deleteByScanning', { defaultValue: 'Удалить сканированием' })
                    : t('deliveryRoutes.loadingScannerTitle')
                }
                subtitle={
                  scannerMode === 'delete'
                    ? t('deliveryRoutes.loadingWarnings.deleteScanSubtitle', {
                        defaultValue: 'Рейс {{id}} / отсканируйте код для удаления из погрузки',
                        id: route.routeNumber,
                      })
                    : t('deliveryRoutes.loadingScannerSubtitle', {
                        id: route.routeNumber,
                        vehicle: route.vehicle.name || '-',
                      })
                }
                onScan={handleScan}
                lastScans={recentScans}
                acceptedCount={scanSession?.counters.accepted ?? 0}
                rejectedCount={scanSession?.counters.rejected ?? 0}
                enableCamera={scannerMode !== null}
                cameraAutoStart={scannerMode !== null}
                scanDisabled={
                  scannerMode === 'loading'
                    ? !scanSession || isCreating || isCompleting || isClosingSession
                    : scannerMode === 'delete'
                      ? isCreating || isCompleting || isClosingSession
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
        title={t('deliveryRoutes.loadingWarnings.title', {
          defaultValue: 'Есть недогруз по товарам',
        })}
        open={completeModalOpen}
        onCancel={() => setCompleteModalOpen(false)}
        onOk={() => void handleForceComplete()}
        okText={t('deliveryRoutes.loadingWarnings.forceComplete', {
          defaultValue: 'Завершить принудительно',
        })}
        cancelText={t('common.cancel', { defaultValue: 'Отмена' })}
      >
        <div className="loading-complete-warning">
          <p>
            {t('deliveryRoutes.loadingWarnings.description', {
              defaultValue:
                'По этим товарам погруженное количество меньше запланированного. Для завершения укажите причину.',
            })}
          </p>
          <div className="loading-complete-warning-list">
            {incompleteProducts.map((product) => (
              <div key={product.id} className="loading-complete-warning-item">
                <span>{product.name}</span>
                <span>
                  {product.quantities.loadedQuantity} / {product.quantities.plannedQuantity}
                </span>
              </div>
            ))}
          </div>
          <Input.TextArea
            rows={4}
            value={completeComment}
            onChange={(event) => setCompleteComment(event.target.value)}
            placeholder={t('deliveryRoutes.loadingWarnings.commentPlaceholder', {
              defaultValue: 'Укажите причину недостачи',
            })}
          />
        </div>
      </Modal>

    </MainLayout>
  );
};

export default DeliveryRoutesLoading;
