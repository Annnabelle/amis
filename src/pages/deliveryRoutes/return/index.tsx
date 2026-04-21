import { useEffect, useMemo, useState } from 'react';
import { Alert, Empty, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import DataMatrixScanner from 'shared/ui/dataMatrixScanner';
import CustomButton from 'shared/ui/button';
import { useAppDispatch, useAppSelector } from 'app/store';
import {
  completeDeliveryRouteReturn,
  getDeliveryRouteById,
} from 'entities/deliveryRoutes/model';
import {
  completeScanSession,
  createScanSession,
  replaceScanAttempts,
  resetScanSessionState,
  scanSessionCode,
} from 'entities/scanSessions/model';
import { ScanSessionType } from 'entities/scanSessions/types';
import { getBackendErrorMessage } from 'shared/lib/getBackendErrorMessage';
import { isWarehouseRole } from 'shared/lib/userRoles';

const SCAN_CACHE_PREFIX = 'return-scans';
const SCAN_RESULT_TOAST_ID = 'return-scan-result';

const getScanCacheKey = (routeId: string) => `${SCAN_CACHE_PREFIX}:${routeId}`;

const DeliveryRoutesReturn = () => {
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
  const isCompletingSession = useAppSelector((state) => state.scanSessions.isCompleting);
  const scanError = useAppSelector((state) => state.scanSessions.error);

  const [scannerOpen, setScannerOpen] = useState(false);
  const [isClosingSession, setIsClosingSession] = useState(false);

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
    ? `${t('deliveryRoutes.returnTitle')} (${route.routeNumber})`
    : t('deliveryRoutes.returnTitle');

  const productRows = useMemo(
    () =>
      (route?.products ?? []).map((product) => ({
        ...product,
        remainingQuantity: Math.max(
          product.quantities.loadedQuantity - product.quantities.deliveredQuantity,
          0
        ),
      })),
    [route?.products]
  );

  const counters = useMemo(
    () => [
      {
        label: t('deliveryRoutes.loadingCounters.planned', { defaultValue: 'Остаток' }),
        value: productRows.reduce((total, product) => total + product.remainingQuantity, 0),
      },
      {
        label: t('deliveryRoutes.fields.returnedQuantity'),
        value: route?.totals.returnedQuantity ?? 0,
      },
      {
        label: t('deliveryRoutes.loadingCounters.products'),
        value: productRows.length,
      },
    ],
    [productRows, route?.totals.returnedQuantity, t]
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

  const refreshRoute = async () => {
    if (!routeId) return;
    await dispatch(getDeliveryRouteById(routeId));
  };

  const handleStartScanning = async () => {
    if (!routeId) return;

    if (scanSession?.id && scanSession.status === 'active') {
      setScannerOpen(true);
      return;
    }

    try {
      await dispatch(
        createScanSession({
          type: ScanSessionType.Return,
          routeId,
        })
      ).unwrap();
      setScannerOpen(true);
    } catch (error) {
      toast.error(
        getBackendErrorMessage(
          error,
          t('deliveryRoutes.messages.error.createScanSession', {
            defaultValue: 'Не удалось начать сессию сканирования',
          })
        )
      );
    }
  };

  const handleScannerClose = async () => {
    if (!scanSession?.id) {
      setScannerOpen(false);
      return;
    }

    if (scanSession.status !== 'active') {
      setScannerOpen(false);
      return;
    }

    try {
      setIsClosingSession(true);
      await dispatch(completeScanSession(scanSession.id)).unwrap();
    } catch (error) {
      toast.error(
        getBackendErrorMessage(
          error,
          t('deliveryRoutes.messages.error.completeScanSession', {
            defaultValue: 'Не удалось завершить сессию сканирования',
          })
        )
      );
    } finally {
      setIsClosingSession(false);
      setScannerOpen(false);
    }
  };

  void handleScannerClose;

  const handleScan = async (code: string) => {
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

      await refreshRoute();
      pushSingleScanToast(
        'success',
        t('deliveryRoutes.messages.success.scanCode', {
          code: formatCodeForToast(code),
        })
      );

      return { status: 'accepted' as const };
    } catch (error: any) {
      const reason = getBackendErrorMessage(
        error?.error ?? error,
        t('deliveryRoutes.messages.error.scanCode')
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
  };

  const handleComplete = async () => {
    if (!routeId) return;

    try {
      if (scanSession?.id && scanSession.status === 'active') {
        await dispatch(completeScanSession(scanSession.id)).unwrap();
      }

      await dispatch(completeDeliveryRouteReturn(routeId)).unwrap();
      localStorage.removeItem(getScanCacheKey(routeId));
      navigate(`${backPath}/${routeId}`);
    } catch (error) {
      toast.error(
        getBackendErrorMessage(
          error,
          t('deliveryRoutes.messages.error.completeReturn', {
            defaultValue: 'Не удалось завершить возврат',
          })
        )
      );
    }
  };

  const handleCloseScannerView = async () => {
    setScannerOpen(false);
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
              </div>
            ))}
          </div>
        </section>
      ))}

      {rejectedScans.length > 0 && (
        <section className="loading-scan-group loading-scan-group-errors">
          <div className="loading-scan-group-title">
            <span>
              {t('deliveryRoutes.loadingWarnings.scanErrors', {
                defaultValue: 'Ошибки сканирования',
              })}
            </span>
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
        <Heading title={t('deliveryRoutes.returnTitle')} subtitle={t('deliveryRoutes.returnSubtitle')} />
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
        <Heading title={t('deliveryRoutes.returnTitle')} subtitle={t('deliveryRoutes.returnSubtitle')} />
        <div className="box">
          <div className="box-container">
            <div className="box-container-items loading-page-state">
              <Empty description={t('common.dataNotFound')} />
              <CustomButton className="outline" onClick={() => navigate(backPath)}>
                {t('common.backToRoute')}
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
        <Heading title={t('deliveryRoutes.returnTitle')} subtitle={t('deliveryRoutes.returnSubtitle')} />
        <div className="box">
          <div className="box-container">
            <div className="box-container-items loading-page-state">
              <Empty description={t('common.dataNotFound', { defaultValue: 'Доступ запрещён' })} />
              <CustomButton className="outline" onClick={() => navigate(`${backPath}/${routeId}`)}>
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
      <Heading title={headingTitle} subtitle={t('deliveryRoutes.returnSubtitle')}>
        <div className="btns-group">
          <CustomButton
            className="primary"
            onClick={handleStartScanning}
            disabled={isCreating || isClosingSession}
          >
            {isCreating ? t('scanner.creatingSession') : t('scanner.startScanning')}
          </CustomButton>
          {scanSession?.status === 'active' && (
            <CustomButton
              className="outline"
              onClick={() => void handleComplete()}
              disabled={isCreating || isCompletingSession || isClosingSession}
            >
              {isCompletingSession ? t('scanner.completingSession') : t('deliveryRoutes.actions.completeReturn')}
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
                {counters.map((counter) => (
                  <div key={counter.label} className="loading-route-counter">
                    <span className="loading-route-counter-label">{counter.label}</span>
                    <span className="loading-route-counter-value">{counter.value}</span>
                  </div>
                ))}
              </div>

              <div className="detail-card detail-card-full loading-products-card">
                <h4>{t('deliveryRoutes.sections.return', { defaultValue: 'Возврат' })}</h4>
                {!productRows.length ? (
                  <Empty description={t('deliveryRoutes.details.loadingEmpty')} />
                ) : (
                  <div className="loading-products-table">
                    <div className="loading-products-table-head">
                      <span>{t('salesOrders.fields.product')}</span>
                      <span>{t('deliveryRoutes.returnTable.remaining', { defaultValue: 'Остаток' })}</span>
                      <span>{t('deliveryRoutes.returnTable.returned', { defaultValue: 'Возвращено' })}</span>
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
                          <span className="loading-products-cell-label">
                            {t('deliveryRoutes.returnTable.remaining', { defaultValue: 'Остаток' })}
                          </span>
                          <span>{product.remainingQuantity}</span>
                        </div>
                        <div className="loading-products-cell">
                          <span className="loading-products-cell-label">
                            {t('deliveryRoutes.returnTable.returned', { defaultValue: 'Возвращено' })}
                          </span>
                          <span>{product.quantities.returnedQuantity}</span>
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
                title={t('deliveryRoutes.returnScannerTitle')}
                subtitle={t('deliveryRoutes.returnScannerSubtitle', {
                  id: route.routeNumber,
                })}
                helperText={t('deliveryRoutes.returnHelper')}
                onScan={handleScan}
                lastScans={recentScans}
                acceptedCount={scanSession?.counters.accepted ?? 0}
                rejectedCount={scanSession?.counters.rejected ?? 0}
                primaryActionLabel={scannerOpen ? t('deliveryRoutes.actions.completeReturn') : undefined}
                onPrimaryAction={scannerOpen ? () => void handleComplete() : undefined}
                enableCamera={scannerOpen}
                cameraAutoStart={scannerOpen}
                scanDisabled={!scanSession || isCreating || isCompletingSession || isClosingSession}
                scanInProgress={isScanning}
                lastScansContent={lastScansContent}
                onCameraClose={handleCloseScannerView}
              />
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DeliveryRoutesReturn;
