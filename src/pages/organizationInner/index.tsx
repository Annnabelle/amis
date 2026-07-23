import { Empty } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'app/store';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { setCurrentCompanyId } from 'entities/access/model';
import { AccessModules, type AccessModule } from 'entities/access/types';
import { getOrganizationById } from 'entities/organization/model';
import type { CompanyResponse } from 'entities/organization/types';
import { useIsMobile, useNavigationBack } from 'shared/lib';
import CustomButton from 'shared/ui/button';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';

type DetailItem = {
  label: string;
  value: string;
};

const hasValue = (value?: string | number | null) =>
  value !== undefined && value !== null && String(value).trim().length > 0;

const formatFullName = (
  employee?: CompanyResponse['responsibleEmployees']['director']
) => {
  if (!employee?.name) return '-';

  const value = [employee.name.last, employee.name.first, employee.name.middle]
    .filter(Boolean)
    .join(' ');

  return value || '-';
};

const renderDetailItems = (items: DetailItem[]) => (
  <div className="detail-items">
    {items.map((item) => (
      <div className="detail-item" key={item.label}>
        <span className="label inline-label">{item.label}</span>
        <span className="detail-separator">:</span>
        <span className="value" title={item.value}>
          {item.value}
        </span>
      </div>
    ))}
  </div>
);

const OrganizationsInner = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigateBack = useNavigationBack();
  const isMobile = useIsMobile();
  const organizationById = useAppSelector((state) => state.organizations.organizationById);
  const systemModules = useAppSelector((state) => state.access.data?.system.modules ?? []);
  const isLoading = useAppSelector((state) => state.organizations.isLoading);

  useEffect(() => {
    if (id) {
      dispatch(getOrganizationById({ id }));
    }
  }, [dispatch, id]);

  const getFirstCompanyModulePath = (
    companyId: string,
    modules: AccessModule[]
  ) => {
    const modulePaths: Array<{ module: AccessModule; path: string }> = [
      { module: AccessModules.Products, path: `/organization/${companyId}/products` },
      { module: AccessModules.Orders, path: `/organization/${companyId}/orders` },
      { module: AccessModules.Reports, path: `/organization/${companyId}/agregations` },
      { module: AccessModules.SalesOrders, path: `/organization/${companyId}/sales-orders` },
      { module: AccessModules.DeliveryRoutes, path: `/organization/${companyId}/delivery-routes` },
      { module: AccessModules.Invoices, path: `/organization/${companyId}/invoices` },
      { module: AccessModules.Integrations, path: `/organization/${companyId}/integrations` },
    ];

    return modulePaths.find((item) => modules.includes(item.module))?.path;
  };

  const handleEnterCompany = () => {
    if (!id) return;

    dispatch(setCurrentCompanyId(id));
    const firstModulePath = getFirstCompanyModulePath(id, systemModules);

    if (firstModulePath) {
      navigate(firstModulePath);
    }
  };

  const isCurrentOrganizationLoaded =
    Boolean(id) && String(organizationById?.id) === id;

  if (isLoading && !isCurrentOrganizationLoaded) {
    return null;
  }

  if (!organizationById || !isCurrentOrganizationLoaded) {
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
          <Heading title={t('organizations.title')} subtitle={t('common.details')}>
            <CustomButton className="outline" onClick={() => navigateBack('/organization')}>
              {t('common.backToList')}
            </CustomButton>
          </Heading>
        )}
        <div className="box">
          <div className="box-container">
            <div className="box-container-items">
              <Empty description={t('common.dataNotFound')} />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const organization = organizationById;
  const directorName = formatFullName(organization.responsibleEmployees.director);
  const accountantName = formatFullName(organization.responsibleEmployees.accountant);
  const statusLabel = t(`statuses.${organization.status}`, {
    defaultValue: organization.status,
  });

  const overviewItems: DetailItem[] = [
    { label: t('organizations.addUserForm.label.legalName'), value: organization.legalName || '-' },
    { label: t('organizations.addUserForm.label.tin'), value: organization.tin || '-' },
  ];

  const nameItems: DetailItem[] = [
    { label: `${t('organizations.addUserForm.label.companyName')} RU`, value: organization.name.ru || '-' },
    { label: `${t('organizations.addUserForm.label.companyName')} EN`, value: organization.name.en || '-' },
    { label: `${t('organizations.addUserForm.label.companyName')} UZ`, value: organization.name.uz || '-' },
  ];

  const directorItems: DetailItem[] = [
    { label: t('organizations.addUserForm.label.name', { defaultValue: 'Name' }), value: directorName },
    {
      label: t('organizations.addUserForm.label.tin'),
      value: organization.responsibleEmployees.director?.tin || '-',
    },
    {
      label: t('organizations.addUserForm.label.pinfl', { defaultValue: 'PINFL' }),
      value: organization.responsibleEmployees.director?.pinfl || '-',
    },
  ];

  const accountantItems: DetailItem[] = [
    {
      label: t('organizations.addUserForm.label.name', { defaultValue: 'Name' }),
      value: accountantName,
    },
    {
      label: t('organizations.addUserForm.label.tin'),
      value: organization.responsibleEmployees.accountant?.tin || '-',
    },
    {
      label: t('organizations.addUserForm.label.pinfl', { defaultValue: 'PINFL' }),
      value: organization.responsibleEmployees.accountant?.pinfl || '-',
    },
  ];

  const registrationItems: DetailItem[] = [
    {
      label: t('organizations.addUserForm.label.vatCode', { defaultValue: 'VAT code' }),
      value: organization.vatCode || '-',
    },
  ];

  const addressItems: DetailItem[] = [
    { label: t('organizations.addUserForm.label.region'), value: organization.address.region || '-' },
    { label: t('organizations.addUserForm.label.district'), value: organization.address.district || '-' },
    { label: t('organizations.addUserForm.label.address'), value: organization.address.address || '-' },
  ];

  const bankItems: DetailItem[] = [
    { label: t('organizations.addUserForm.label.bankName'), value: organization.bankDetails?.bankName || '-' },
    { label: t('organizations.addUserForm.label.ccea'), value: organization.bankDetails?.ccea || '-' },
    { label: t('organizations.addUserForm.label.account'), value: organization.bankDetails?.account || '-' },
    { label: t('organizations.addUserForm.label.mfo'), value: organization.bankDetails?.mfo || '-' },
  ];

  const contactItems: DetailItem[] = [
    { label: t('organizations.addUserForm.label.phone'), value: organization.contacts.phone || '-' },
    { label: t('organizations.addUserForm.label.email'), value: organization.contacts.email || '-' },
    { label: t('organizations.addUserForm.label.url'), value: organization.contacts.url || '-' },
    { label: t('organizations.addUserForm.label.person'), value: organization.contacts.person || '-' },
  ];

  const hasBankDetails = bankItems.some((item) => hasValue(item.value) && item.value !== '-');
  const hasContactDetails = contactItems.some((item) => hasValue(item.value) && item.value !== '-');

  return (
    <MainLayout>
      {isMobile && (
        <div className="mobile-route-toolbar">
          <div className="mobile-route-toolbar-back">
            <CustomButton className="outline" onClick={() => navigateBack('/organization')}>
              <LeftOutlined />
            </CustomButton>
          </div>
          <div className="mobile-route-toolbar-actions">
            <CustomButton onClick={handleEnterCompany}>
              {t('btn.enterCompany')}
            </CustomButton>
          </div>
        </div>
      )}
      {!isMobile && (
        <Heading
          title={organization.displayName}
          isTest={organization.isTest}
          subtitle={t('common.details')}
        >
          <div className="btns-group">
            <CustomButton className="outline" onClick={() => navigateBack('/organization')}>
              {t('common.backToList')}
            </CustomButton>
            <CustomButton onClick={handleEnterCompany}>
              {t('btn.enterCompany')}
            </CustomButton>
          </div>
        </Heading>
      )}

      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <div className="route-overview-card">
              <div className="route-overview-head">
                <div className="route-overview-title">
                  <h2>{organization.displayName}</h2>
                </div>
                <div className="route-overview-status">
                  <span className="label inline-label">{t('organizations.status')}</span>
                  <span className="detail-separator">:</span>
                  <span className={`status-badge ${organization.status}`}>
                    {statusLabel}
                  </span>
                </div>
              </div>

              <div className="route-overview-meta">
                {overviewItems.map((item) => (
                  <div className="route-meta-chip" key={item.label}>
                    <span className="label">{item.label}</span>
                    <span className="value" title={item.value}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-grid detail-grid-main">
              <div className="detail-card">
                <h4>{t('organizations.subtitles.name')}</h4>
                {renderDetailItems(nameItems)}
              </div>

              <div className="detail-card">
                <h4>{t('organizations.subtitles.address')}</h4>
                {renderDetailItems(addressItems)}
              </div>
            </div>

            <div className="detail-grid detail-grid-main">
              <div className="detail-card">
                <h4>{t('organizations.addUserForm.label.director')}</h4>
                {renderDetailItems(directorItems)}
              </div>

              <div className="detail-card">
                <h4>{t('organizations.addUserForm.label.accountant')}</h4>
                {renderDetailItems(accountantItems)}
              </div>
            </div>

            <div className="detail-grid detail-grid-main">
              {hasContactDetails && (
                <div className="detail-card">
                  <h4>{t('organizations.subtitles.contactDetails')}</h4>
                  {renderDetailItems(contactItems)}
                </div>
              )}

              <div className="detail-card">
                <h4>{t('common.details')}</h4>
                {renderDetailItems(registrationItems)}
              </div>
            </div>

            {hasBankDetails && (
              <div className="detail-grid detail-grid-single">
                <div className="detail-card detail-card-full">
                  <h4>{t('organizations.subtitles.bankDetails')}</h4>
                  {renderDetailItems(bankItems)}
                </div>
              </div>
            )}

            <div className="btns-group">
              <CustomButton className="outline" onClick={() => navigateBack('/organization')}>
                {t('common.backToList')}
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrganizationsInner;
