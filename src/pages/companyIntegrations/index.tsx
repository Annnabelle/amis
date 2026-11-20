import { Empty, Form, Input, Spin, Tag } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
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
  useLazyValidateCompanyXTraceIntegrationTokenQuery,
  useUpdateCompanyXTraceIntegrationMutation,
} from 'entities/xTrace/api';
import type { XTraceIntegrationTokenValidation } from 'entities/xTrace/types';
import { getApiErrorMessage } from 'shared/api';
import { useGetReferencesByTypeQuery } from 'entities/references/api';
import dayjs from 'dayjs';
import { type ChangeEvent, type ReactNode, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useParams, useSearchParams } from 'react-router-dom';
import { LifecycleTargetEntity, useLifecycleSummary } from 'entities/lifecycle/lib';
import LifecyclePanel, { LifecycleActiveErrorAlert } from 'widgets/lifecycle';
import CompanyImportPanel from 'widgets/companyImport';
import CompanyImportStartButton from 'widgets/companyImport/startButton';
import { isFormValidationError, useIsMobile, useNavigationBack } from 'shared/lib';
import CustomButton from 'shared/ui/button';
import EntityTabs, { OVERVIEW_TAB_KEY } from 'shared/ui/entityTabs';
import FormComponent from 'shared/ui/formComponent';
import MainLayout from 'widgets/appShell';
import Heading from 'shared/ui/mainHeading';
import ModalWindow from 'shared/ui/modalWindow';
import StatusBadge from 'shared/ui/statusBadge';
import { getIntegrationStatusBadgeVariant } from 'shared/ui/statusBadge/variants';
import '../organizations/styles.sass';

const COMPANY_IMPORT_TAB_KEY = 'company-import';
const XTRACE_LIFECYCLE_TAB_KEY = 'xtrace-lifecycle';
const FAKTURA_UZ_LIFECYCLE_TAB_KEY = 'fakturaUz-lifecycle';

type DetailItem = {
  label: string;
  value: ReactNode;
};

const formatDate = (value?: string | null) =>
  value ? dayjs(value).format('DD.MM.YYYY HH:mm') : '-';

const renderStatus = (status: string, t: ReturnType<typeof useTranslation>['t']) => (
  <StatusBadge variant={getIntegrationStatusBadgeVariant(status)}>
    {t(`statuses.${status}`, { defaultValue: status })}
  </StatusBadge>
);

const renderTestFlag = (isTest?: boolean, t?: ReturnType<typeof useTranslation>['t']) =>
  isTest && t ? (
    <Tag className="test-flag" color="blue-inverse" style={{ margin: 0 }}>
      {t('organizations.testFlag')}
    </Tag>
  ) : '-';

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
  const validationTimeoutRef = useRef<number | null>(null);
  const validationRequestRef = useRef(0);

  const access = useAppSelector((state) => state.access.data);
  const { data: organizationById, isLoading: organizationLoading } =
    useGetCompanyByIdQuery({ id: orgId ?? '' }, { skip: !orgId });
  const { data: productGroupReferences = [] } =
    useGetReferencesByTypeQuery('productGroup');
  const currentLanguage = i18n.language.split('-')[0] as 'ru' | 'en' | 'uz';

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
  /** Проверка токена — состояние открытой формы, а не серверные данные. */
  const [xTraceValidation, setXTraceValidation] =
    useState<XTraceIntegrationTokenValidation | null>(null);
  const [validateXTraceToken, { isFetching: xTraceValidationLoading }] =
    useLazyValidateCompanyXTraceIntegrationTokenQuery();
  const [createXTraceIntegration, { isLoading: xTraceCreateLoading }] =
    useCreateCompanyXTraceIntegrationMutation();
  const [updateXTraceIntegration] = useUpdateCompanyXTraceIntegrationMutation();
  const [createFakturaUzIntegration, { isLoading: fakturaUzCreateLoading }] =
    useCreateCompanyFakturaUzIntegrationMutation();

  const canCreateFakturaUz = hasPermission(Permissions.CompanyFakturaUzIntegrationsCreate);
  const canUpdateFakturaUz = hasPermission(Permissions.CompanyFakturaUzIntegrationsUpdate);

  const productGroupTitleByAlias = useMemo(() => {
    const map = new Map<string, string>();

    productGroupReferences.forEach((reference) => {
      const localizedTitle =
        reference.title?.[currentLanguage] ??
        reference.title?.ru ??
        reference.title?.en ??
        reference.alias;

      map.set(reference.alias, localizedTitle);
      map.set(reference.alias.trim().toLowerCase(), localizedTitle);
    });

    return map;
  }, [currentLanguage, productGroupReferences]);

  const xTraceValidationData = xTraceValidation;

  const openLifecycleTab = (tabKey: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', tabKey);
    setSearchParams(nextParams, { replace: true });
  };

  const closeXTraceModal = () => {
    setIsXTraceModalOpen(false);
    xTraceForm.resetFields();
    setXTraceValidation(null);
  };

  const openXTraceModal = () => {
    xTraceForm.setFieldsValue({
      tin: organizationById?.tin ?? '',
      token: xTraceIntegration?.tokenInfo.token ?? '',
      businessPlaceId: xTraceIntegration?.businessPlaceId,
    });
    setXTraceValidation(null);
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

  const handleXTraceTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
    const token = event.target.value.trim();
    const requestId = ++validationRequestRef.current;

    if (validationTimeoutRef.current) {
      window.clearTimeout(validationTimeoutRef.current);
    }

    setXTraceValidation(null);

    if (!orgId || !token || !canValidateXTrace) return;

    validationTimeoutRef.current = window.setTimeout(async () => {
      try {
        const validation = await validateXTraceToken({
          companyId: orgId,
          token,
        }).unwrap();

        if (requestId !== validationRequestRef.current) return;

        setXTraceValidation(validation);
      } catch (error: unknown) {
        if (requestId === validationRequestRef.current) {
          toast.error(getApiErrorMessage(error, t('organizations.addUserForm.validation.xTrace.invalidToken')));
        }
      }
    }, 450);
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

      toast.success(t('organizations.messages.success.createXTraceIntegration'));
      closeXTraceModal();
    } catch (error: unknown) {
      if (isFormValidationError(error)) return;
      toast.error(getApiErrorMessage(error, t('organizations.messages.error.createXTraceIntegration')));
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

      toast.success(t('organizations.messages.success.createFakturaUzIntegration'));
      setIsFakturaUzModalOpen(false);
    } catch (error: unknown) {
      if (isFormValidationError(error)) return;
      toast.error(getApiErrorMessage(error, t('organizations.messages.error.createFakturaUzIntegration')));
    }
  };

  const renderProductGroups = (productGroups: string[]) => (
    <div className="organization-product-group-pills">
      {productGroups.length > 0
        ? productGroups.map((productGroup) => {
            const productGroupTitle =
              productGroupTitleByAlias.get(productGroup) ??
              productGroupTitleByAlias.get(productGroup.trim().toLowerCase()) ??
              productGroup;

            return (
              <span key={productGroup} className="organization-product-group-pill">
                {productGroupTitle}
              </span>
            );
          })
        : <span className="value">-</span>}
    </div>
  );

  const xTraceItems: DetailItem[] = xTraceIntegration
    ? [
        { label: t('organizations.status'), value: renderStatus(xTraceIntegration.status, t) },
        { label: t('organizations.testFlag'), value: renderTestFlag(xTraceIntegration.isTest, t) },
        { label: t('organizations.addUserForm.label.expireDate'), value: formatDate(xTraceIntegration.tokenInfo.expireDate) },
      ]
    : [{ label: t('organizations.status'), value: t('organizations.integrations.notConfigured') }];

  const fakturaItems: DetailItem[] = fakturaUzIntegration
    ? [
        { label: t('organizations.status'), value: renderStatus(fakturaUzIntegration.status, t) },
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
      {isMobile && (
        <div className="mobile-route-toolbar">
          <div className="mobile-route-toolbar-back">
            <CustomButton variant="outline" onClick={() => navigateBack('/organization')}>
              <LeftOutlined />
            </CustomButton>
          </div>
        </div>
      )}
      {!isMobile && (
        <Heading
          title={t('navigation.integrations')}
          subtitle={organizationById?.displayName ?? t('organizations.title')}
        >
          <CustomButton variant="outline" onClick={() => navigateBack(`/organization/${orgId}`)}>
            {t('common.backToList')}
          </CustomButton>
        </Heading>
      )}

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

      <ModalWindow
        className="modal-large"
        width="880px"
        titleAction={t('organizations.modalWindow.editing')}
        title={t('organizations.integrations.xTrace.title')}
        openModal={isXTraceModalOpen}
        closeModal={closeXTraceModal}
      >
        <div className="organization-integration-step">
          <FormComponent form={xTraceForm}>
            <div className="form-inputs form-inputs-row">
              <Form.Item name="tin" className="input" label={t('organizations.addUserForm.label.tin')}>
                <Input size="large" className="input" disabled />
              </Form.Item>
              <Form.Item
                name="token"
                className="input"
                label={t('organizations.addUserForm.label.xTraceToken')}
                rules={[{ required: true, message: t('organizations.addUserForm.validation.required.token') }]}
              >
                <Input
                  size="large"
                  className="input"
                  onChange={handleXTraceTokenChange}
                  disabled={xTraceCreateLoading}
                />
              </Form.Item>
            </div>

            {xTraceValidationData && (
              <div className="detail-grid detail-grid-main organization-create-preview">
                <div className="detail-card detail-card-full organization-xtrace-validation-card">
                  <h4>{t('organizations.integrations.receivedData')}</h4>
                  <div className="detail-items">
                    <div className="detail-item">
                      <span className="label inline-label">{t('organizations.addUserForm.label.expireDate')}</span>
                      <span className="detail-separator">:</span>
                      <span className="value">{formatDate(xTraceValidationData.expireDate)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label inline-label">{t('organizations.testFlag')}</span>
                      <span className="detail-separator">:</span>
                      <span className="value">{renderTestFlag(xTraceValidationData.isTest, t)}</span>
                    </div>
                    <div className="organization-product-group-row">
                      <span className="label">{t('organizations.addUserForm.label.productGroup')}</span>
                      {renderProductGroups(xTraceValidationData.productGroups)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="form-inputs form-inputs-row">
              <Form.Item
                name="businessPlaceId"
                className="input"
                label={t('organizations.addUserForm.label.businessPlaceId')}
                rules={[{ required: true, message: t('organizations.addUserForm.validation.required.businessPlaceId') }]}
              >
                <Input size="large" className="input" type="number" disabled={xTraceCreateLoading} />
              </Form.Item>
            </div>
          </FormComponent>

          <div className="btns-group organization-integration-actions">
            <CustomButton variant="outline" onClick={closeXTraceModal} disabled={xTraceCreateLoading}>
              {t('btn.cancel')}
            </CustomButton>
            <CustomButton
              onClick={handleSaveXTrace}
              disabled={xTraceCreateLoading || xTraceValidationLoading || !xTraceValidationData}
            >
              {xTraceCreateLoading ? t('common.loading') : t('btn.save')}
            </CustomButton>
          </div>
        </div>
      </ModalWindow>

      <ModalWindow
        className="modal-large"
        width="880px"
        titleAction={t('organizations.modalWindow.editing')}
        title={t('organizations.integrations.fakturaUz.title')}
        openModal={isFakturaUzModalOpen}
        closeModal={() => setIsFakturaUzModalOpen(false)}
      >
        <div className="organization-integration-step">
          <FormComponent form={fakturaUzForm}>
            <div className="form-inputs form-inputs-row">
              <Form.Item
                name="username"
                className="input"
                label={t('organizations.integrations.fakturaUz.username')}
                rules={[{ required: true, message: t('organizations.integrations.fakturaUz.validation.username') }]}
              >
                <Input size="large" className="input" disabled={fakturaUzCreateLoading} />
              </Form.Item>
              <Form.Item
                name="password"
                className="input"
                label={t('organizations.integrations.fakturaUz.password')}
                rules={[{ required: true, message: t('organizations.integrations.fakturaUz.validation.password') }]}
              >
                <Input.Password size="large" className="input" disabled={fakturaUzCreateLoading} />
              </Form.Item>
            </div>
            <div className="form-inputs form-inputs-row">
              <Form.Item
                name="clientId"
                className="input"
                label={t('organizations.integrations.fakturaUz.clientId')}
                rules={[{ required: true, message: t('organizations.integrations.fakturaUz.validation.clientId') }]}
              >
                <Input size="large" className="input" disabled={fakturaUzCreateLoading} />
              </Form.Item>
              <Form.Item
                name="clientSecret"
                className="input"
                label={t('organizations.integrations.fakturaUz.clientSecret')}
                rules={[{ required: true, message: t('organizations.integrations.fakturaUz.validation.clientSecret') }]}
              >
                <Input.Password size="large" className="input" disabled={fakturaUzCreateLoading} />
              </Form.Item>
            </div>
          </FormComponent>

          <div className="btns-group organization-integration-actions">
            <CustomButton variant="outline" onClick={() => setIsFakturaUzModalOpen(false)} disabled={fakturaUzCreateLoading}>
              {t('btn.cancel')}
            </CustomButton>
            <CustomButton onClick={handleSaveFakturaUz} disabled={fakturaUzCreateLoading}>
              {fakturaUzCreateLoading ? t('common.loading') : t('btn.save')}
            </CustomButton>
          </div>
        </div>
      </ModalWindow>
    </MainLayout>
  );
};

export default CompanyIntegrations;
