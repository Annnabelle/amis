import { useEffect, useMemo, useState } from 'react';
import { notify } from 'shared/lib/notify';
import { routes } from "shared/config/routes";
import { Alert, Empty, Input, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from 'widgets/appShell';
import Heading from 'shared/ui/mainHeading';
import DataMatrixScanner from 'shared/ui/dataMatrixScanner';
import CustomButton from 'shared/ui/button';
import 'shared/ui/details/styles.sass';
import { useAppDispatch, useAppSelector } from 'app/store';
import {
  useCompleteDeliveryRouteLoadingMutation,
  useGetDeliveryRouteByIdQuery,
} from 'entities/deliveryRoutes/api';
import {
  replaceScanAttempts,
  resetScanSessionState,
} from 'entities/scanSessions/model';
import {
  useCancelScanMutation,
  useCompleteScanSessionMutation,
  useCreateScanSessionMutation,
  useScanSessionCodeMutation,
} from 'entities/scanSessions/api';
import { ScanSessionType } from 'entities/scanSessions/types';
import { getApiErrorMessage } from 'shared/api';
import { createScanToast, formatCodeForToast } from 'features/scanning/lib/scanToast';
import { groupAcceptedScans, selectRejectedScans } from 'features/scanning/lib/scanGroups';
import ScanList from 'features/scanning/ui/scanList';
import {
  buildRouteProductsById,
  selectUnderloadedProducts,
} from 'features/deliveryRouteLoading/lib/routeProducts';
import { useCan } from 'entities/access/lib';
import { endpointAccessMap } from 'shared/config/endpointAccessMap';

const SCAN_CACHE_PREFIX = 'loading-scans';
const pushSingleScanToast = createScanToast('loading-scan-result');
type ScannerMode = 'loading' | 'delete' | null;

const getScanCacheKey = (routeId: string) => `${SCAN_CACHE_PREFIX}:${routeId}`;

const DeliveryRoutesLoading = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id, orgId } = useParams<{ id: string; orgId?: string }>();
  const { t } = useTranslation();

  const routeId = id ?? '';
  const backPath = orgId ? routes.deliveryRoutes(orgId) : routes.companies();

  const {
    data: route,
    isLoading: routeLoading,
    refetch: refetchRoute,
  } = useGetDeliveryRouteByIdQuery(routeId, { skip: !routeId });
  const [completeDeliveryRouteLoading] = useCompleteDeliveryRouteLoadingMutation();
  const [createScanSession] = useCreateScanSessionMutation();
  const [completeScanSession] = useCompleteScanSessionMutation();
  const [scanSessionCode] = useScanSessionCodeMutation();
  const [cancelScan] = useCancelScanMutation();
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
  const canCreateScanSession = useCan(endpointAccessMap.scanSessionsCreate);
  const canScan = useCan(endpointAccessMap.scanSessionsScan);
  const canCancelScan = useCan(endpointAccessMap.scanSessionsCancelScan);
  const canCompleteScanSession = useCan(endpointAccessMap.scanSessionsComplete);
  const canCompleteLoading = useCan(endpointAccessMap.deliveryRoutesCompleteLoading);
  const canCompleteOperation =
    canCompleteLoading &&
    (scanSession?.status !== 'active' || canCompleteScanSession);

  useEffect(() => {
    if (!routeId) return;

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
      if (
        canCompleteScanSession &&
        scanSession?.id &&
        scanSession.status === 'active'
      ) {
        void completeScanSession(scanSession.id);
      }
    };
  }, [
    canCompleteScanSession,
    completeScanSession,
    scanSession?.id,
    scanSession?.status,
  ]);

  const headingTitle = route?.routeNumber
    ? `${t('deliveryRoutes.loadingPageTitle')} (${route.routeNumber})`
    : t('deliveryRoutes.loadingTitle');

  const productRows = useMemo(() => route?.products ?? [], [route]);
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

  const productsById = useMemo(() => buildRouteProductsById(route), [route]);

  const acceptedScanGroups = useMemo(
    () => groupAcceptedScans(recentScans, productsById),
    [productsById, recentScans]
  );

  const rejectedScans = useMemo(() => selectRejectedScans(recentScans), [recentScans]);

  const incompleteProducts = useMemo(
    () => selectUnderloadedProducts(productRows),
    [productRows]
  );

  const handleStartScanning = async () => {
    if (!routeId) return;

    if (scanSession?.id && scanSession.status === 'active') {
      setScannerMode('loading');
      return;
    }

    try {
      await createScanSession({
          type: ScanSessionType.Loading,
          routeId,
        }).unwrap();
      setScannerMode('loading');
    } catch (error) {
      notify.error(
        getApiErrorMessage(error, t('deliveryRoutes.messages.error.createScanSession'))
      );
    }
  };

  const handleStartDeleteScanning = () => {
    setScannerMode('delete');
  };

  const handleScan = async (code: string) => {
    if (scannerMode === 'delete') {
      try {
        await cancelScan({
            code,
            routeId,
          }).unwrap();

        await refetchRoute();
        pushSingleScanToast(
          'success',
          t('deliveryRoutes.messages.success.cancelScan', {
            defaultValue: 'Скан {{code}} удалён',
            code: formatCodeForToast(code),
          })
        );

        return { status: 'accepted' as const };
      } catch (error: unknown) {
        const reason = getApiErrorMessage(
          error,
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
      await scanSessionCode({
          sessionId: scanSession.id,
          code,
        }).unwrap();

      await refetchRoute();
      pushSingleScanToast(
        'success',
        t('deliveryRoutes.messages.success.scanCode', {
          code: formatCodeForToast(code),
        })
      );

      return { status: 'accepted' as const };
    } catch (error: unknown) {
      const reason = getApiErrorMessage(error, t('deliveryRoutes.messages.error.scanCode'));

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
        await completeScanSession(scanSession.id).unwrap();
      }

      await completeDeliveryRouteLoading({
        id: routeId,
        payload: comment?.trim() ? { comment: comment.trim() } : undefined,
      }).unwrap();
      localStorage.removeItem(getScanCacheKey(routeId));
      navigate(routes.deliveryRoute(orgId, routeId));
    } catch (error) {
      notify.error(
        getApiErrorMessage(error, t('deliveryRoutes.messages.error.completeScanSession'))
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
      notify.error(
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
      await cancelScan({
          code,
          routeId,
        }).unwrap();

      await refetchRoute();
      notify.success(
        t('deliveryRoutes.messages.success.cancelScan', {
          defaultValue: 'Скан {{code}} удалён',
          code: formatCodeForToast(code),
        })
      );
    } catch (error: unknown) {
      notify.error(
        getApiErrorMessage(error, t('deliveryRoutes.messages.error.cancelScan', {
          defaultValue: 'Не удалось удалить скан',
        }))
      );
    }
  };

  const handleCloseScannerView = async () => {
    setScannerMode(null);
  };

  const lastScansContent = (
    <ScanList
      groups={acceptedScanGroups}
      rejected={rejectedScans}
      onDelete={canCancelScan ? (code) => void handleDeleteScan(code) : undefined}
      deleteLabel={t('deliveryRoutes.actions.deleteScan', { defaultValue: 'Удалить' })}
      errorsTitle={t('deliveryRoutes.loadingWarnings.scanErrors', {
        defaultValue: 'Ошибки сканирования',
      })}
    />
  );

  if (routeLoading) {
    return null;
  }

  if (!route) {
    return (
      <MainLayout>
        <Heading title={t('deliveryRoutes.loadingTitle')} subtitle={t('deliveryRoutes.loadingSubtitle')} />
        <div className="box">
          <div className="box-container">
            <div className="box-container-items loading-page-state">
              <Empty description={t('common.dataNotFound')} />
              <CustomButton variant="outline" onClick={() => navigate(backPath)}>
                {t('common.backToList')}
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
          {canCreateScanSession && (
            <CustomButton
              onClick={handleStartScanning}
              disabled={isCreating || isClosingSession || scannerMode === 'delete'}
            >
              {isCreating ? t('scanner.creatingSession') : t('scanner.startScanning')}
            </CustomButton>
          )}
          {canCancelScan && (
            <CustomButton
              variant="danger"
              onClick={handleStartDeleteScanning}
              disabled={isCreating || isCompleting || isClosingSession || scannerMode === 'loading'}
            >
              {t('deliveryRoutes.actions.deleteByScanning', { defaultValue: 'Удалить сканированием' })}
            </CustomButton>
          )}
          {scanSession?.status === 'active' &&
            scannerMode !== 'delete' &&
            canCompleteOperation && (
            <CustomButton
              variant="outline"
              onClick={() => void handleComplete()}
              disabled={isCreating || isCompleting || isClosingSession}
            >
              {isCompleting ? t('scanner.completingSession') : t('deliveryRoutes.actions.completeLoading')}
            </CustomButton>
          )}
          <CustomButton variant="outline" onClick={() => navigate(routes.deliveryRoute(orgId, routeId))}>
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
                    ? !canScan || !scanSession || isCreating || isCompleting || isClosingSession
                    : scannerMode === 'delete'
                      ? !canCancelScan || isCreating || isCompleting || isClosingSession
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
