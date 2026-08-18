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
import {
  DetailCard,
  DetailGrid,
  DetailItems,
  RouteMetaChip,
  type DetailItemData,
} from 'shared/ui/details';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import StatusBadge from 'shared/ui/statusBadge';

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
              <CustomButton variant="outline" onClick={() => navigateBack('/organization')}>
                <LeftOutlined />
              </CustomButton>
            </div>
          </div>
        )}
        {!isMobile && (
          <Heading title={t('organizations.title')} subtitle={t('common.details')}>
            <CustomButton variant="outline" onClick={() => navigateBack('/organization')}>
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

  const overviewItems: DetailItemData[] = [
    { label: t('organizations.addUserForm.label.legalName'), value: organization.legalName || '-' },
    { label: t('organizations.addUserForm.label.tin'), value: organization.tin || '-' },
  ];

  const nameItems: DetailItemData[] = [
    { label: `${t('organizations.addUserForm.label.companyName')} RU`, value: organization.name.ru || '-' },
    { label: `${t('organizations.addUserForm.label.companyName')} EN`, value: organization.name.en || '-' },
    { label: `${t('organizations.addUserForm.label.companyName')} UZ`, value: organization.name.uz || '-' },
  ];

  const directorItems: DetailItemData[] = [
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

  const accountantItems: DetailItemData[] = [
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

  const registrationItems: DetailItemData[] = [
    {
      label: t('organizations.addUserForm.label.vatCode', { defaultValue: 'VAT code' }),
      value: organization.vatCode || '-',
    },
  ];

  const addressItems: DetailItemData[] = [
    { label: t('organizations.addUserForm.label.region'), value: organization.address.region || '-' },
    { label: t('organizations.addUserForm.label.district'), value: organization.address.district || '-' },
    { label: t('organizations.addUserForm.label.address'), value: organization.address.address || '-' },
  ];

  const bankItems: DetailItemData[] = [
    { label: t('organizations.addUserForm.label.bankName'), value: organization.bankDetails?.bankName || '-' },
    { label: t('organizations.addUserForm.label.ccea'), value: organization.bankDetails?.ccea || '-' },
    { label: t('organizations.addUserForm.label.account'), value: organization.bankDetails?.account || '-' },
    { label: t('organizations.addUserForm.label.mfo'), value: organization.bankDetails?.mfo || '-' },
  ];

  const contactItems: DetailItemData[] = [
    { label: t('organizations.addUserForm.label.phone'), value: organization.contacts.phone || '-' },
    { label: t('organizations.addUserForm.label.email'), value: organization.contacts.email || '-' },
    { label: t('organizations.addUserForm.label.url'), value: organization.contacts.url || '-' },
    { label: t('organizations.addUserForm.label.person'), value: organization.contacts.person || '-' },
  ];

  const hasBankDetails = bankItems.some((item) => hasValue(String(item.value)) && item.value !== '-');
  const hasContactDetails = contactItems.some((item) => hasValue(String(item.value)) && item.value !== '-');

  return (
    <MainLayout>
      {isMobile && (
        <div className="mobile-route-toolbar">
          <div className="mobile-route-toolbar-back">
            <CustomButton variant="outline" onClick={() => navigateBack('/organization')}>
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
            <CustomButton variant="outline" onClick={() => navigateBack('/organization')}>
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
                  <StatusBadge status={organization.status}>
                    {statusLabel}
                  </StatusBadge>
                </div>
              </div>

              <div className="route-overview-meta">
                {overviewItems.map((item) => (
                  <RouteMetaChip
                    key={String(item.label)}
                    label={item.label}
                    value={item.value}
                    valueTitle={String(item.value)}
                  />
                ))}
              </div>
            </div>

            <DetailGrid variant="main">
              <DetailCard title={t('organizations.subtitles.name')}>
                <DetailItems items={nameItems} />
              </DetailCard>

              <DetailCard title={t('organizations.subtitles.address')}>
                <DetailItems items={addressItems} />
              </DetailCard>
            </DetailGrid>

            <DetailGrid variant="main">
              <DetailCard title={t('organizations.addUserForm.label.director')}>
                <DetailItems items={directorItems} />
              </DetailCard>

              <DetailCard title={t('organizations.addUserForm.label.accountant')}>
                <DetailItems items={accountantItems} />
              </DetailCard>
            </DetailGrid>

            <DetailGrid variant="main">
              {hasContactDetails && (
                <DetailCard title={t('organizations.subtitles.contactDetails')}>
                  <DetailItems items={contactItems} />
                </DetailCard>
              )}

              <DetailCard title={t('common.details')}>
                <DetailItems items={registrationItems} />
              </DetailCard>
            </DetailGrid>

            {hasBankDetails && (
              <DetailGrid variant="single">
                <DetailCard full title={t('organizations.subtitles.bankDetails')}>
                  <DetailItems items={bankItems} />
                </DetailCard>
              </DetailGrid>
            )}

            <div className="btns-group">
              <CustomButton variant="outline" onClick={() => navigateBack('/organization')}>
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
