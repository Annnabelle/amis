import { Alert, Spin } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/store';
import { fetchCustomsCodeById } from 'entities/customsCodes/model';
import { UserPreviewCardById } from 'entities/users/ui/userPreviewCard';
import { LifecycleTargetType } from 'entities/lifecycle/lib';
import { useLifecycleTab } from 'widgets/lifecycle/useLifecycleTab';
import { getBackendErrorMessage } from 'shared/lib/getBackendErrorMessage';
import { StatusEntity } from 'shared/config/statusCatalog';
import CustomButton from 'shared/ui/button';
import EntityStatusBadge from 'shared/ui/statusBadge/entityStatus';
import {
  DetailCard,
  DetailGrid,
  DetailItems,
  RouteMetaChip,
} from 'shared/ui/details';
import EntityTabs, { OVERVIEW_TAB_KEY } from 'shared/ui/entityTabs';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';

const CustomsCodeDetails = () => {
  const navigate = useNavigate();
  const { orgId, id } = useParams<{ orgId: string; id: string }>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const order = useAppSelector((state) => state.customsCodes.selected);
  const isLoading = useAppSelector((state) => state.customsCodes.selectedLoading);
  const loadError = useAppSelector((state) => state.customsCodes.selectedError);
  const listPath = orgId ? `/organization/${orgId}/customs-codes` : '/organization';
  const { banner: lifecycleBanner, items: lifecycleTabItems } = useLifecycleTab({
    targetId: id,
    target: LifecycleTargetType.CustomsCodeOrder,
  });

  useEffect(() => {
    if (!id) return;
    dispatch(fetchCustomsCodeById(id));
  }, [dispatch, id]);

  if (loadError && (!order || order.id !== id)) {
    return (
      <MainLayout>
        <Alert
          type="error"
          showIcon
          message={getBackendErrorMessage(loadError, t('customsCodes.details.loadError'))}
          action={
            <CustomButton variant="outline" onClick={() => navigate(listPath)}>
              {t('common.backToList')}
            </CustomButton>
          }
        />
      </MainLayout>
    );
  }

  if (isLoading || !order || order.id !== id) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  const notGeneratedLabel = t('customsCodes.details.fields.notGenerated');

  const generalItems = [
    { label: t('customsCodes.details.fields.orderId'), value: order.orderId },
    { label: t('customsCodes.details.fields.batchId'), value: order.batchId },
    { label: t('customsCodes.details.fields.productId'), value: order.productId },
    { label: t('customsCodes.table.quantity'), value: order.quantity },
    { label: t('customsCodes.table.measurement'), value: order.measurement ?? '-' },
  ];

  const documentItems = [
    {
      label: t('customsCodes.details.fields.registrationDocument'),
      value: order.external.registration.documentId ?? notGeneratedLabel,
    },
    {
      label: t('customsCodes.details.fields.dissolutionDocument'),
      value: order.external.dissolution.documentId ?? notGeneratedLabel,
    },
  ];

  return (
    <MainLayout>
      <Heading title={t('customsCodes.details.title')} subtitle={t('common.details')}>
        <CustomButton variant="outline" onClick={() => navigate(listPath)}>
          {t('common.backToList')}
        </CustomButton>
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
                          <span className="label">{t('customsCodes.table.accOrderNumber')}</span>
                          <h2>{order.accOrderNumber ?? '-'}</h2>
                        </div>
                        <div className="route-overview-status">
                          <span className="label inline-label">{t('customsCodes.table.status')}</span>
                          <span className="detail-separator">:</span>
                          <EntityStatusBadge
                            entity={StatusEntity.CustomsCodeOrder}
                            status={order.status}
                          />
                        </div>
                      </div>
                      <div className="route-overview-meta">
                        <RouteMetaChip
                          label={t('customsCodes.table.customsCode')}
                          value={order.customsCode ?? '-'}
                        />
                        <RouteMetaChip
                          label={t('customsCodes.details.fields.createdBy')}
                          value={<UserPreviewCardById userId={order.userId} compact />}
                        />
                      </div>
                    </div>

                    <DetailGrid variant="main">
                      <DetailCard title={t('customsCodes.details.sections.general')}>
                        <DetailItems items={generalItems} />
                      </DetailCard>
                      <DetailCard title={t('customsCodes.details.sections.documents')}>
                        <DetailItems items={documentItems} />
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

export default CustomsCodeDetails;
