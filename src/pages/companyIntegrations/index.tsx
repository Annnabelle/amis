import { Empty, Form, Spin } from 'antd';
import { notify } from 'shared/lib/notify';
import PageHeader from 'shared/ui/pageHeader';
import { routes } from "shared/config/routes";
import { normalizeLanguage } from 'shared/lib/language';
import { useAppSelector } from 'app/store';
import { canAccess } from 'entities/access/lib';
import { EndpointScopes } from 'shared/config/endpointAccessMap';
import { Permissions, type Permission } from 'shared/config/permissions';
import { useGetCompanyByIdQuery } from 'entities/organization/api';
import {
  useCreateCompanyFakturaUzIntegrationMutation,
  useCreateCompanyXTraceIntegrationMutation,
  useGetCompanyFakturaUzIntegrationQuery,
  useGetCompanyXTraceIntegrationQuery,
  useUpdateCompanyXTraceIntegrationMutation,
} from 'entities/xTrace/api';
import { getApiErrorMessage } from 'shared/api';
import { buildProductGroupTitles } from 'entities/references/lib/productGroupTitles';
import { useXTraceTokenValidation } from 'features/companyIntegrations/lib/useXTraceTokenValidation';
import XTraceModal from 'features/companyIntegrations/ui/xTraceModal';
import {
  renderIntegrationStatus,
  renderTestFlag,
} from 'features/companyIntegrations/ui/renderers';
import FakturaUzModal from 'features/companyIntegrations/ui/fakturaUzModal';
import { useGetReferencesByTypeQuery } from 'entities/references/api';
import { type ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { LifecycleTargetEntity, useLifecycleSummary } from 'entities/lifecycle/lib';
import LifecyclePanel, { LifecycleActiveErrorAlert } from 'widgets/lifecycle';
import CompanyImportPanel from 'widgets/companyImport';
import CompanyImportStartButton from 'widgets/companyImport/startButton';
import { isFormValidationError } from 'shared/lib/formValidation';
import { useIsMobile } from 'shared/lib/useIsMobile';
import { useNavigationBack } from 'shared/lib/utils';
import CustomButton from 'shared/ui/button';
import EntityTabs, { OVERVIEW_TAB_KEY } from 'shared/ui/entityTabs';
import MainLayout from 'widgets/appShell';
import { formatDateTime } from 'shared/lib/formatDate';
import '../organizations/styles.sass';

const COMPANY_IMPORT_TAB_KEY = 'company-import';
const XTRACE_LIFECYCLE_TAB_KEY = 'xtrace-lifecycle';
const FAKTURA_UZ_LIFECYCLE_TAB_KEY = 'fakturaUz-lifecycle';

type DetailItem = {
  label: string;
  value: ReactNode;
};

const renderDetailItems = (items: DetailItem[]) => (
  <div className="detail-items">
    {items.map((item) => (
      <div className="detail-item" key={item.label}>
        <span className="label inline-label">{item.label}</span>
        <span className="detail-separator">:</span>
        <span className="value">{item.value}</span>
      </div>
    ))}
  </div>
);

const CompanyIntegrations = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const { t, i18n } = useTranslation();
  const navigateBack = useNavigationBack();
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const { canRead: canReadXTraceLifecycle, summary: xTraceLifecycleSummary } =
    useLifecycleSummary(orgId, LifecycleTargetEntity.CompanyXTraceIntegration);
  const { canRead: canReadFakturaUzLifecycle, summary: fakturaUzLifecycleSummary } =
    useLifecycleSummary(orgId, LifecycleTargetEntity.CompanyFakturaUzIntegration);
  const [xTraceForm] = Form.useForm();
  const [fakturaUzForm] = Form.useForm();
  const [isXTraceModalOpen, setIsXTraceModalOpen] = useState(false);
  const [isFakturaUzModalOpen, setIsFakturaUzModalOpen] = useState(false);

  const access = useAppSelector((state) => state.access.data);
  const { data: organizationById, isLoading: organizationLoading } =
    useGetCompanyByIdQuery({ id: orgId ?? '' }, { skip: !orgId });
  const { data: productGroupReferences = [] } =
    useGetReferencesByTypeQuery('productGroup');
  const currentLanguage = normalizeLanguage(i18n.language);

  const hasPermission = (permission: Permission) =>
    canAccess({
      access,
      permission,
      scope: EndpointScopes.Company,
      companyId: orgId,
    });

  const canReadXTrace = hasPermission(Permissions.CompanyXTraceIntegrationsRead);
  const canValidateXTrace = hasPermission(Permissions.CompanyXTraceIntegrationsValidateToken);
  const canCreateXTrace = hasPermission(Permissions.CompanyXTraceIntegrationsCreate);
  const canUpdateXTrace = hasPermission(Permissions.CompanyXTraceIntegrationsUpdate);
  const canReadCompanyImport = hasPermission(Permissions.CompanyImportRead);
  const canReadFakturaUz = hasPermission(Permissions.CompanyFakturaUzIntegrationsRead);
  const { data: xTraceIntegration, isFetching: xTraceLoading } =
    useGetCompanyXTraceIntegrationQuery(
      { companyId: orgId ?? '' },
      { skip: !orgId || !canReadXTrace }
    );
  const { data: fakturaUzIntegration, isFetching: fakturaUzLoading } =
    useGetCompanyFakturaUzIntegrationQuery(
      { companyId: orgId ?? '' },
      { skip: !orgId || !canReadFakturaUz }
    );
  const integrationsLoading = xTraceLoading || fakturaUzLoading;
  const {
    validation: xTraceValidation,
    isValidating: xTraceValidationLoading,
    handleTokenChange: handleXTraceTokenChange,
    reset: resetXTraceValidation,
  } = useXTraceTokenValidation({ companyId: orgId, enabled: canValidateXTrace });
  const [createXTraceIntegration, { isLoading: xTraceCreateLoading }] =
    useCreateCompanyXTraceIntegrationMutation();
  const [updateXTraceIntegration] = useUpdateCompanyXTraceIntegrationMutation();
  const [createFakturaUzIntegration, { isLoading: fakturaUzCreateLoading }] =
    useCreateCompanyFakturaUzIntegrationMutation();

  const canCreateFakturaUz = hasPermission(Permissions.CompanyFakturaUzIntegrationsCreate);
  const canUpdateFakturaUz = hasPermission(Permissions.CompanyFakturaUzIntegrationsUpdate);

  const productGroupTitleByAlias = useMemo(
    () => buildProductGroupTitles(productGroupReferences, currentLanguage),
    [currentLanguage, productGroupReferences]
  );


  const openLifecycleTab = (tabKey: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', tabKey);
    setSearchParams(nextParams, { replace: true });
  };

  const closeXTraceModal = () => {
    setIsXTraceModalOpen(false);
    xTraceForm.resetFields();
    resetXTraceValidation();
  };

  const openXTraceModal = () => {
    xTraceForm.setFieldsValue({
      tin: organizationById?.tin ?? '',
      token: xTraceIntegration?.tokenInfo.token ?? '',
      businessPlaceId: xTraceIntegration?.businessPlaceId,
    });
    resetXTraceValidation();
    setIsXTraceModalOpen(true);
  };

  const openFakturaUzModal = () => {
    fakturaUzForm.setFieldsValue({
      username: fakturaUzIntegration?.credentials.username ?? '',
      password: fakturaUzIntegration?.credentials.password ?? '',
      clientId: fakturaUzIntegration?.credentials.clientId ?? '',
      clientSecret: fakturaUzIntegration?.credentials.clientSecret ?? '',
    });
    setIsFakturaUzModalOpen(true);
  };

  const handleSaveXTrace = async () => {
    if (!orgId) return;

    try {
      const values = await xTraceForm.validateFields(['token', 'businessPlaceId']);
      const saveXTraceIntegration = xTraceIntegration
        ? updateXTraceIntegration
        : createXTraceIntegration;

      // Карточка интеграции перечитается сама: мутация инвалидирует её тег.
      await saveXTraceIntegration({
        companyId: orgId,
        token: String(values.token ?? '').trim(),
        businessPlaceId: Number(values.businessPlaceId),
      }).unwrap();

      notify.success(t('organizations.messages.success.createXTraceIntegration'));
      closeXTraceModal();
    } catch (error: unknown) {
      if (isFormValidationError(error)) return;
      notify.error(getApiErrorMessage(error, t('organizations.messages.error.createXTraceIntegration')));
    }
  };

  const handleSaveFakturaUz = async () => {
    if (!orgId) return;

    try {
      const values = await fakturaUzForm.validateFields(['username', 'password', 'clientId', 'clientSecret']);
      await createFakturaUzIntegration({
        companyId: orgId,
        username: String(values.username ?? '').trim(),
        password: String(values.password ?? ''),
        clientId: String(values.clientId ?? '').trim(),
        clientSecret: String(values.clientSecret ?? '').trim(),
      }).unwrap();

      notify.success(t('organizations.messages.success.createFakturaUzIntegration'));
      setIsFakturaUzModalOpen(false);
    } catch (error: unknown) {
      if (isFormValidationError(error)) return;
      notify.error(getApiErrorMessage(error, t('organizations.messages.error.createFakturaUzIntegration')));
    }
  };

  const xTraceItems: DetailItem[] = xTraceIntegration
    ? [
        { label: t('organizations.status'), value: renderIntegrationStatus(xTraceIntegration.status, t) },
        { label: t('organizations.testFlag'), value: renderTestFlag(xTraceIntegration.isTest, t) },
        { label: t('organizations.addUserForm.label.expireDate'), value: formatDateTime(xTraceIntegration.tokenInfo.expireDate) },
      ]
    : [{ label: t('organizations.status'), value: t('organizations.integrations.notConfigured') }];

  const fakturaItems: DetailItem[] = fakturaUzIntegration
    ? [
        { label: t('organizations.status'), value: renderIntegrationStatus(fakturaUzIntegration.status, t) },
        { label: t('organizations.testFlag'), value: renderTestFlag(fakturaUzIntegration.isTest, t) },
        { label: t('organizations.integrations.fakturaUz.username'), value: fakturaUzIntegration.credentials.username || '-' },
      ]
    : [{ label: t('organizations.status'), value: t('organizations.integrations.notConfigured') }];

  const showXTraceAction = xTraceIntegration ? canUpdateXTrace : canCreateXTrace;
  const showFakturaAction = fakturaUzIntegration ? canUpdateFakturaUz : canCreateFakturaUz;
  const isLoading = organizationLoading || integrationsLoading;

  const overviewTabContent = (
    <div className="box">
      <div className="box-container">
        <div className="box-container-items">
          {isLoading ? (
            <Spin />
          ) : !canReadXTrace && !canReadFakturaUz ? (
            <Empty description={t('common.missingPermissions')} />
          ) : (
            <div className="company-integrations-grid">
              {canReadXTrace && (
                <div className="detail-card company-integration-card">
                  <div className="detail-card-header">
                    <h4>{t('organizations.integrations.xTrace.cardTitle')}</h4>
                    <div className="company-integration-card-actions">
                      {/* Импорт тянет всё тем же ключом — без интеграции запускать нечего. */}
                      {xTraceIntegration && <CompanyImportStartButton companyId={orgId} />}
                      {showXTraceAction && (
                        <CustomButton variant="outline" onClick={openXTraceModal}>
                          {t(xTraceIntegration ? 'btn.edit' : 'btn.create')}
                        </CustomButton>
                      )}
                    </div>
                  </div>
                  {renderDetailItems(xTraceItems)}
                </div>
              )}

              {canReadFakturaUz && (
                <div className="detail-card company-integration-card">
                  <div className="detail-card-header">
                    <h4>{t('organizations.integrations.fakturaUz.cardTitle')}</h4>
                    {showFakturaAction && (
                      <CustomButton variant="outline" onClick={openFakturaUzModal}>
                        {t(fakturaUzIntegration ? 'btn.edit' : 'btn.create')}
                      </CustomButton>
                    )}
                  </div>
                  {renderDetailItems(fakturaItems)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const lifecyclePanelBox = (target: LifecycleTargetEntity) => (
    <div className="box">
      <div className="box-container">
        <div className="box-container-items">
          <LifecyclePanel targetId={orgId} target={target} />
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <PageHeader
        title={t('navigation.integrations')}
        subtitle={organizationById?.displayName ?? t('organizations.title')}
        onBack={() => navigateBack(isMobile ? routes.companies() : routes.company(orgId))}
        backLabel={t('common.backToList')}
      />

      {/* Незакрытая серия ошибок видна на любой вкладке — это главный сигнал карточки. */}
      {canReadXTraceLifecycle && xTraceLifecycleSummary?.activeError && (
        <LifecycleActiveErrorAlert
          error={xTraceLifecycleSummary.activeError}
          action={
            <CustomButton
              variant="text"
              size="sm"
              fullWidth={false}
              onClick={() => openLifecycleTab(XTRACE_LIFECYCLE_TAB_KEY)}
            >
              {t('lifecycle.activeError.open')}
            </CustomButton>
          }
        />
      )}
      {canReadFakturaUzLifecycle && fakturaUzLifecycleSummary?.activeError && (
        <LifecycleActiveErrorAlert
          error={fakturaUzLifecycleSummary.activeError}
          action={
            <CustomButton
              variant="text"
              size="sm"
              fullWidth={false}
              onClick={() => openLifecycleTab(FAKTURA_UZ_LIFECYCLE_TAB_KEY)}
            >
              {t('lifecycle.activeError.open')}
            </CustomButton>
          }
        />
      )}

      <EntityTabs
        defaultActiveKey={OVERVIEW_TAB_KEY}
        items={[
          {
            key: OVERVIEW_TAB_KEY,
            label: t('lifecycle.tabs.overview'),
            children: overviewTabContent,
          },
          ...(canReadCompanyImport
            ? [
                {
                  key: COMPANY_IMPORT_TAB_KEY,
                  label: t('companyImport.tabs.import'),
                  children: (
                    <div className="box">
                      <div className="box-container">
                        <div className="box-container-items">
                          <CompanyImportPanel companyId={orgId} />
                        </div>
                      </div>
                    </div>
                  ),
                },
              ]
            : []),
          ...(canReadXTraceLifecycle
            ? [
                {
                  key: XTRACE_LIFECYCLE_TAB_KEY,
                  label: (
                    <>
                      {t('organizations.integrations.xTrace.cardTitle')}
                      {xTraceLifecycleSummary?.activeError && <span className="entity-tabs-dot" />}
                    </>
                  ),
                  children: lifecyclePanelBox(LifecycleTargetEntity.CompanyXTraceIntegration),
                },
              ]
            : []),
          ...(canReadFakturaUzLifecycle
            ? [
                {
                  key: FAKTURA_UZ_LIFECYCLE_TAB_KEY,
                  label: (
                    <>
                      {t('organizations.integrations.fakturaUz.cardTitle')}
                      {fakturaUzLifecycleSummary?.activeError && <span className="entity-tabs-dot" />}
                    </>
                  ),
                  children: lifecyclePanelBox(LifecycleTargetEntity.CompanyFakturaUzIntegration),
                },
              ]
            : []),
        ]}
      />

      <XTraceModal
        form={xTraceForm}
        open={isXTraceModalOpen}
        onClose={closeXTraceModal}
        onSave={handleSaveXTrace}
        onTokenChange={handleXTraceTokenChange}
        validation={xTraceValidation}
        isValidating={xTraceValidationLoading}
        isSaving={xTraceCreateLoading}
        productGroupTitleByAlias={productGroupTitleByAlias}
      />

      <FakturaUzModal
        form={fakturaUzForm}
        open={isFakturaUzModalOpen}
        onClose={() => setIsFakturaUzModalOpen(false)}
        onSave={handleSaveFakturaUz}
        isSaving={fakturaUzCreateLoading}
      />
    </MainLayout>
  );
};

export default CompanyIntegrations;
