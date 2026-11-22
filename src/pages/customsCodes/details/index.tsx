import { Alert, Spin } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetCustomsCodeOrderByIdQuery,
  useResumeCustomsCodeOrderMutation,
} from 'entities/customsCodes/api';
import { JobStatus } from '@edem2000/amis.contracts';
import { useCan } from 'entities/access/lib';
import { endpointAccessMap } from 'shared/config/endpointAccessMap';
import { getApiErrorMessage } from 'shared/api';
import { UserPreviewCardById } from 'entities/users/ui/userPreviewCard';
import { LifecycleTargetEntity } from 'entities/lifecycle/lib';
import { useLifecycleTab } from 'widgets/lifecycle/useLifecycleTab';
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
import MainLayout from 'widgets/appShell';
import Heading from 'shared/ui/mainHeading';

const CustomsCodeDetails = () => {
  const navigate = useNavigate();
  const { orgId, id } = useParams<{ orgId: string; id: string }>();
  const { t, i18n } = useTranslation();
  const canResume = useCan(endpointAccessMap.customsCodesResume);
  const {
    data: order,
    isLoading,
    error: loadRequestError,
  } = useGetCustomsCodeOrderByIdQuery(id ?? '', { skip: !id });
  const [resumeCustomsCodeOrder, { isLoading: resuming }] =
    useResumeCustomsCodeOrderMutation();

  const handleResume = async () => {
    if (!id) return;

    try {
      await resumeCustomsCodeOrder(id).unwrap();
      toast.success(t('customsCodes.messages.resumeStarted'));
    } catch (err) {
      toast.error(getApiErrorMessage(err, t('customsCodes.messages.resumeError')));
    }
  };
  const loadError = loadRequestError
    ? getApiErrorMessage(loadRequestError, t('customsCodes.messages.loadError'))
    : null;
  const listPath = orgId ? `/organization/${orgId}/customs-codes` : '/organization';
  const { banner: lifecycleBanner, items: lifecycleTabItems } = useLifecycleTab({
    targetId: id,
    target: LifecycleTargetEntity.AggregatedCustomsCodeOrder,
  });

  if (loadError && !order) {
    return (
      <MainLayout>
        <Alert
          type="error"
          showIcon
          message={loadError}
          action={
            <CustomButton variant="outline" onClick={() => navigate(listPath)}>
              {t('common.backToList')}
            </CustomButton>
          }
        />
      </MainLayout>
    );
  }

  if (isLoading || !order) {
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
    {
      label: t('customsCodes.table.product'),
      value: order.product ? `${order.product.name} · ${order.product.gtin}` : '-',
    },
    { label: t('customsCodes.details.fields.orderId'), value: order.orderId },
    { label: t('customsCodes.details.fields.batchId'), value: order.batchId },
    { label: t('customsCodes.details.fields.productId'), value: order.productId },
    { label: t('customsCodes.table.quantity'), value: order.quantity },
    { label: t('customsCodes.table.measurement'), value: order.measurement?.value ?? '-' },
  ];

  const processing = order.processing;
  // Шаги исполняет воркер: без этого признака его остановка и исчерпавшая попытки
  // задача в интерфейсе неотличимы от обычного ожидания.
  const processingStalled =
    processing?.jobStatus === JobStatus.DeadLettered ||
    processing?.jobStatus === JobStatus.Cancelled;

  const processingItems = processing
    ? [
        { label: t('customsCodes.details.fields.processingStep'), value: processing.jobType },
        {
          label: t('customsCodes.details.fields.processingAttempts'),
          value: `${processing.attempts} / ${processing.maxAttempts}`,
        },
      ]
    : [];

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

      {processingStalled && (
        <Alert
          type="warning"
          showIcon
          message={t('customsCodes.details.fields.processingStalled')}
          description={
            processing?.lastError ? processing.lastError[i18n.language as 'ru' | 'uz' | 'en'] : undefined
          }
          action={
            canResume ? (
              <CustomButton size="sm" fullWidth={false} disabled={resuming} onClick={handleResume}>
                {resuming && <SyncOutlined spin />}
                {t('customsCodes.actions.resume')}
              </CustomButton>
            ) : undefined
          }
        />
      )}

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
                            entity={StatusEntity.AggregatedCustomsCodeOrder}
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
                      {processing && (
                        <DetailCard title={t('customsCodes.details.sections.processing')}>
                          <DetailItems items={processingItems} />
                        </DetailCard>
                      )}
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
