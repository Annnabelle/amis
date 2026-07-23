import { Empty, Form, Input, Spin, Tag } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'app/store';
import { canAccess } from 'entities/access/lib';
import { EndpointScopes } from 'shared/config/endpointAccessMap';
import { Permissions, type Permission } from 'shared/config/permissions';
import { getOrganizationById } from 'entities/organization/model';
import {
  clearXTraceIntegrationValidation,
  createCompanyFakturaUzIntegration,
  createCompanyXTraceIntegration,
  getCompanyFakturaUzIntegration,
  getCompanyXTraceIntegration,
  validateCompanyXTraceIntegrationToken,
} from 'entities/xTrace/model';
import { fetchReferencesByType } from 'entities/references/model';
import dayjs from 'dayjs';
import { type ChangeEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { getBackendErrorMessage, useIsMobile, useNavigationBack } from 'shared/lib';
import CustomButton from 'shared/ui/button';
import FormComponent from 'shared/ui/formComponent';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import ModalWindow from 'shared/ui/modalWindow';

type DetailItem = {
  label: string;
  value: ReactNode;
};

const formatDate = (value?: string | null) =>
  value ? dayjs(value).format('DD.MM.YYYY HH:mm') : '-';

const renderStatus = (status: string, t: ReturnType<typeof useTranslation>['t']) => (
  <span className={`status-badge ${status}`}>
    {t(`statuses.${status}`, { defaultValue: status })}
  </span>
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
  const dispatch = useAppDispatch();
  const navigateBack = useNavigationBack();
  const isMobile = useIsMobile();
  const [xTraceForm] = Form.useForm();
  const [fakturaUzForm] = Form.useForm();
  const [isXTraceModalOpen, setIsXTraceModalOpen] = useState(false);
  const [isFakturaUzModalOpen, setIsFakturaUzModalOpen] = useState(false);
  const validationTimeoutRef = useRef<number | null>(null);
  const validationRequestRef = useRef(0);

  const access = useAppSelector((state) => state.access.data);
  const organizationById = useAppSelector((state) => state.organizations.organizationById);
  const organizationLoading = useAppSelector((state) => state.organizations.isLoading);
  const xTraceIntegration = useAppSelector((state) => state.xTrace.integration);
  const fakturaUzIntegration = useAppSelector((state) => state.xTrace.fakturaUzIntegration);
  const integrationsLoading = useAppSelector((state) => state.xTrace.integrationsLoading);
  const xTraceValidation = useAppSelector((state) => state.xTrace.integrationValidation);
  const xTraceValidationLoading = useAppSelector((state) => state.xTrace.integrationValidationLoading);
  const xTraceCreateLoading = useAppSelector((state) => state.xTrace.integrationCreateLoading);
  const fakturaUzCreateLoading = useAppSelector((state) => state.xTrace.fakturaUzCreateLoading);
  const productGroupReferences = useAppSelector((state) => state.references.references.productGroup) ?? [];
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
  const canReadFakturaUz = hasPermission(Permissions.CompanyFakturaUzIntegrationsRead);
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

  const xTraceValidationData =
    xTraceValidation &&
    'success' in xTraceValidation &&
    xTraceValidation.success === true &&
    'data' in xTraceValidation
      ? xTraceValidation.data
      : null;

  useEffect(() => {
    if (!orgId) return;

    dispatch(getOrganizationById({ id: orgId }));
  }, [dispatch, orgId]);

  useEffect(() => {
    if (!orgId) return;

    if (canReadXTrace) {
      dispatch(getCompanyXTraceIntegration({ companyId: orgId }));
    }

    if (canReadFakturaUz) {
      dispatch(getCompanyFakturaUzIntegration({ companyId: orgId }));
    }
  }, [canReadFakturaUz, canReadXTrace, dispatch, orgId]);

  useEffect(() => {
    dispatch(fetchReferencesByType('productGroup'));
  }, [dispatch]);

  const closeXTraceModal = () => {
    setIsXTraceModalOpen(false);
    xTraceForm.resetFields();
    dispatch(clearXTraceIntegrationValidation());
  };

  const openXTraceModal = () => {
    xTraceForm.setFieldsValue({
      tin: organizationById?.tin ?? '',
      token: xTraceIntegration?.tokenInfo.token ?? '',
      businessPlaceId: xTraceIntegration?.businessPlaceId,
    });
    dispatch(clearXTraceIntegrationValidation());
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

    dispatch(clearXTraceIntegrationValidation());

    if (!orgId || !token || !canValidateXTrace) return;

    validationTimeoutRef.current = window.setTimeout(async () => {
      try {
        await dispatch(validateCompanyXTraceIntegrationToken({ companyId: orgId, token })).unwrap();

        if (requestId !== validationRequestRef.current) {
          dispatch(clearXTraceIntegrationValidation());
        }
      } catch (error: any) {
        if (requestId === validationRequestRef.current) {
          toast.error(getBackendErrorMessage(error, t('organizations.addUserForm.validation.xTrace.invalidToken')));
        }
      }
    }, 450);
  };

  const handleSaveXTrace = async () => {
    if (!orgId) return;

    try {
      const values = await xTraceForm.validateFields(['token', 'businessPlaceId']);
      await dispatch(
        createCompanyXTraceIntegration({
          companyId: orgId,
          token: String(values.token ?? '').trim(),
          businessPlaceId: Number(values.businessPlaceId),
        })
      ).unwrap();

      toast.success(t('organizations.messages.success.createXTraceIntegration'));
      closeXTraceModal();

      if (canReadXTrace) {
        await dispatch(getCompanyXTraceIntegration({ companyId: orgId }));
      }
    } catch (error: any) {
      if (error?.errorFields) return;
      toast.error(getBackendErrorMessage(error, t('organizations.messages.error.createXTraceIntegration')));
    }
  };

  const handleSaveFakturaUz = async () => {
    if (!orgId) return;

    try {
      const values = await fakturaUzForm.validateFields(['username', 'password', 'clientId', 'clientSecret']);
      await dispatch(
        createCompanyFakturaUzIntegration({
          companyId: orgId,
          username: String(values.username ?? '').trim(),
          password: String(values.password ?? ''),
          clientId: String(values.clientId ?? '').trim(),
          clientSecret: String(values.clientSecret ?? '').trim(),
        })
      ).unwrap();

      toast.success(t('organizations.messages.success.createFakturaUzIntegration'));
      setIsFakturaUzModalOpen(false);

      if (canReadFakturaUz) {
        await dispatch(getCompanyFakturaUzIntegration({ companyId: orgId }));
      }
    } catch (error: any) {
      if (error?.errorFields) return;
      toast.error(getBackendErrorMessage(error, t('organizations.messages.error.createFakturaUzIntegration')));
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

  return (
    <MainLayout>
      {isMobile && (
        <div className="mobile-route-toolbar">
          <div className="mobile-route-toolbar-back">
            <CustomButton className="outline" onClick={() => navigateBack('/organization')}>
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
          <CustomButton className="outline" onClick={() => navigateBack(`/organization/${orgId}`)}>
            {t('common.backToList')}
          </CustomButton>
        </Heading>
      )}

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
                      {showXTraceAction && (
                        <CustomButton className="outline" onClick={openXTraceModal}>
                          {t(xTraceIntegration ? 'btn.edit' : 'btn.create')}
                        </CustomButton>
                      )}
                    </div>
                    {renderDetailItems(xTraceItems)}
                  </div>
                )}

                {canReadFakturaUz && (
                  <div className="detail-card company-integration-card">
                    <div className="detail-card-header">
                      <h4>{t('organizations.integrations.fakturaUz.cardTitle')}</h4>
                      {showFakturaAction && (
                        <CustomButton className="outline" onClick={openFakturaUzModal}>
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
            <CustomButton className="outline" onClick={closeXTraceModal} disabled={xTraceCreateLoading}>
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
            <CustomButton className="outline" onClick={() => setIsFakturaUzModalOpen(false)} disabled={fakturaUzCreateLoading}>
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
