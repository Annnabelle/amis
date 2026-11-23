import { Empty, Spin, Tag } from 'antd';
import { routes } from "shared/config/routes";
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
  useGetCurrentUserQuery,
  useGetUserByIdQuery,
  useGetUserCompanyMembershipsQuery,
  useGetUserSystemAccessQuery,
} from 'entities/users/api';
import { getApiErrorMessage } from 'shared/api';
import {
  useGetRoleReferencesQuery,
  useLazyGetRoleReferencesQuery,
} from 'entities/access/api';
import {
  RoleScope,
  type RoleReference,
} from 'entities/access/types';
import { useAppSelector } from 'app/store';
import MainLayout from 'widgets/appShell';
import Heading from 'shared/ui/mainHeading';
import CustomButton from 'shared/ui/button';
import { FormatUzbekPhoneNumber, useNavigationBack } from 'shared/lib';
import { useGetCompaniesQuery } from 'entities/organization/api';
import { useCan } from 'entities/access/lib';
import { endpointAccessMap } from 'shared/config/endpointAccessMap';
import StatusBadge from 'shared/ui/statusBadge';
import type { StatusBadgeVariant } from 'shared/ui/statusBadge';
import {
  DetailCard,
  DetailGrid,
  DetailItem,
  DetailItems,
  RouteMetaChip,
} from 'shared/ui/details';
import type { SystemRole } from 'entities/systemEmployees/types';
import type { CompanyRole } from 'entities/companyMemberships/types';
import { isLanguage, type Language } from 'shared/types/dtos';
import { LifecycleTargetEntity } from 'entities/lifecycle/lib';
import { useLifecycleTab } from 'widgets/lifecycle/useLifecycleTab';
import EntityTabs, { OVERVIEW_TAB_KEY } from 'shared/ui/entityTabs';

import { formatDateTime } from 'shared/lib/formatDate';
type UserDetailProps =
  | { self: true; userId?: undefined }
  | { self?: false; userId: string };

const getUserStatusVariant = (status?: string): StatusBadgeVariant =>
  status === 'active' ? 'success' : status === 'inactive' ? 'danger' : 'default';

const getLocalizedText = (
  value: Record<Language, string>,
  language: Language
) => value[language] || value.ru || value.en || value.uz;

const UserDetail = ({ self = false, userId }: UserDetailProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const navigateBack = useNavigationBack();

  const reduxCurrentUser = useAppSelector((state) => state.users.currentUser);
  const { isFetching: isCurrentUserLoading } = useGetCurrentUserQuery(undefined, {
    skip: !self,
  });
  const { data: userById, isFetching: isUserByIdLoading } = useGetUserByIdQuery(
    { id: userId ?? '' },
    { skip: self || !userId }
  );
  const isUserLoading = self ? isCurrentUserLoading : isUserByIdLoading;
  const accessCompanies = useAppSelector((state) => state.access.data?.companies);
  const [loadCompanyRoleReferences] = useLazyGetRoleReferencesQuery();
  /**
   * Роли читаются на каждую компанию пользователя своим запросом, а хук в
   * цикле звать нельзя, поэтому ответы складываются здесь по компании.
   */
  const [companyRoleReferencesById, setCompanyRoleReferencesById] = useState<
    Record<string, RoleReference[]>
  >({});
  const canUpdateUser = useCan(endpointAccessMap.usersUpdate);
  const canListCompanies = useCan(endpointAccessMap.companiesList);
  const canReadCompany = useCan(endpointAccessMap.companiesRead);
  const canReadUser = useCan(endpointAccessMap.usersRead);
  const { data: companiesPage } = useGetCompaniesQuery(
    { page: 1, limit: 1000, sortOrder: 'asc' },
    { skip: !canListCompanies }
  );
  const organizations = useMemo(
    () => companiesPage?.items ?? [],
    [companiesPage]
  );

  const accessTarget = { self, id: userId };
  const canLoadAccess = self || canReadUser;
  const {
    data: companyMemberships = [],
    isFetching: areMembershipsLoading,
    error: membershipsError,
  } = useGetUserCompanyMembershipsQuery(accessTarget, {
    skip: !canLoadAccess || (!self && !userId),
  });
  const {
    data: systemAccess = null,
    isFetching: isSystemAccessLoading,
    error: systemAccessError,
  } = useGetUserSystemAccessQuery(accessTarget, {
    skip: !canLoadAccess || (!self && !userId),
  });
  const accessLoading = areMembershipsLoading || isSystemAccessLoading;
  const accessRequestError = membershipsError ?? systemAccessError;
  const accessError = accessRequestError
    ? getApiErrorMessage(accessRequestError, t('users.messages.error.loadAccess'))
    : null;
  const { data: systemRoles } = useGetRoleReferencesQuery(
    { scope: RoleScope.System },
    { skip: !systemAccess }
  );

  const currentLanguage = isLanguage(i18n.language) ? i18n.language : 'ru';

  const viewedUser = self
    ? reduxCurrentUser
    : userById?.id === userId
      ? userById
      : null;

  const isViewedUserLoaded = Boolean(viewedUser);
  const userOrganizations = useMemo(
    () =>
      organizations.filter((organization) =>
        companyMemberships.some((membership) => membership.companyId === organization.id)
      ),
    [companyMemberships, organizations]
  );

  useEffect(() => {
    const companyIds = new Set(
      companyMemberships.map((membership) => membership.companyId)
    );

    companyIds.forEach((companyId) => {
      if (companyRoleReferencesById[companyId]) return;

      // true — отдать значение из кеша, если роли этой компании уже брали.
      void loadCompanyRoleReferences(
        { scope: RoleScope.Company, companyId },
        true
      )
        .unwrap()
        .then((roles) => {
          setCompanyRoleReferencesById((prev) => ({
            ...prev,
            [companyId]: roles,
          }));
        })
        .catch(() => undefined);
    });
  }, [companyMemberships, companyRoleReferencesById, loadCompanyRoleReferences]);

  const { banner: lifecycleBanner, items: lifecycleTabItems } = useLifecycleTab({
    targetId: viewedUser?.id,
    target: LifecycleTargetEntity.User,
  });

  if (isUserLoading && !isViewedUserLoaded) {
    return (
      <MainLayout>
        <div className="box">
          <div className="box-container">
            <div className="box-container-items">
              <Spin size="large" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!viewedUser) {
    return (
      <MainLayout>
        <Heading title={self ? t('me.title') : t('users.details.title')} subtitle={t('common.details')}>
          {!self && (
            <CustomButton variant="outline" onClick={() => navigateBack(routes.users())}>
              {t('common.backToList')}
            </CustomButton>
          )}
        </Heading>
        <div className="box">
          <div className="box-container">
            <div className="box-container-items">
              <Empty description={self ? t('me.loadError') : t('common.dataNotFound')} />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const fullName = [viewedUser.firstName, viewedUser.lastName].filter(Boolean).join(' ') || viewedUser.email;
  const companyById = new Map(organizations.map((company) => [company.id, company]));
  // fallback company names when the viewer can't list companies (e.g. own /profile)
  const companyNameById = new Map((accessCompanies ?? []).map((company) => [company.companyId, company.name]));
  const systemRoleReferences = (systemRoles ?? []) as RoleReference<SystemRole>[];
  const systemRoleLabels = new Map(
    systemRoleReferences.map((role) => [
      role.alias,
      getLocalizedText(role.name, currentLanguage),
    ])
  );
  const assignedSystemRoles = systemAccess?.roles ?? [];
  const companyCount = companyMemberships.length || userOrganizations.length;
  const hasSystemAccess = Boolean(systemAccess);
  const showAccessSummary = accessLoading || Boolean(accessError) || hasSystemAccess || companyCount > 0;
  const showSystemAccess = accessLoading || Boolean(accessError) || hasSystemAccess;
  const showCompanies = accessLoading || Boolean(accessError) || companyMemberships.length > 0 || userOrganizations.length > 0;
  const profileItems = [
    { label: t('users.addUserForm.label.firstName'), value: viewedUser.firstName || '-' },
    { label: t('users.addUserForm.label.lastName'), value: viewedUser.lastName || '-' },
    { label: t('users.addUserForm.label.email'), value: viewedUser.email || '-' },
    { label: t('users.addUserForm.label.phone'), value: viewedUser.phone ? FormatUzbekPhoneNumber(viewedUser.phone) : '-' },
    { label: t('users.addUserForm.label.lastLoggedInAt'), value: formatDateTime(viewedUser.lastLoggedInAt) },
  ].concat(
    viewedUser.pinfl
      ? [{ label: t('users.addUserForm.label.pinfl'), value: viewedUser.pinfl }]
      : []
  );

  return (
    <MainLayout>
      <Heading
        title={self ? t('me.title') : `${t('users.details.title')} - ${fullName}`}
        subtitle={t('common.details')}
      >
        <div className="btns-group">
          {self ? (
            <CustomButton onClick={() => navigate(routes.changePassword())}>
              {t('me.changePassword')}
            </CustomButton>
          ) : (
            <>
              {canUpdateUser && (
                <CustomButton onClick={() => navigate(routes.userEdit(viewedUser.id))}>
                  {t('btn.edit')}
                </CustomButton>
              )}
              <CustomButton variant="outline" onClick={() => navigateBack(routes.users())}>
                {t('common.backToList')}
              </CustomButton>
            </>
          )}
        </div>
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
                  <span className="label">{t('users.details.profile')}</span>
                  <h2>{fullName}</h2>
                </div>
                <div className="route-overview-status">
                  <span className="label inline-label">{t('organizations.status')}</span>
                  <span className="detail-separator">:</span>
                  <StatusBadge variant={getUserStatusVariant(viewedUser.status)}>
                    {t(`statuses.${viewedUser.status}`, { defaultValue: viewedUser.status })}
                  </StatusBadge>
                </div>
              </div>
              <div className="route-overview-meta">
                <RouteMetaChip label={t('users.addUserForm.label.email')} value={viewedUser.email || '-'} />
                <RouteMetaChip label={t('users.addUserForm.label.phone')} value={viewedUser.phone ? FormatUzbekPhoneNumber(viewedUser.phone) : '-'} />
                {viewedUser.pinfl && (
                  <RouteMetaChip label={t('users.addUserForm.label.pinfl')} value={viewedUser.pinfl} />
                )}
              </div>
            </div>

            <DetailGrid variant="main">
              <DetailCard title={t('users.details.personalData')}>
                <DetailItems items={profileItems} />
              </DetailCard>

              {showAccessSummary && (
                <DetailCard title={t('users.details.accessSummary')}>
                  <DetailItems>
                    {(accessLoading || Boolean(accessError) || hasSystemAccess) && (
                      <DetailItem label={t('users.details.systemAccess')}>
                        {assignedSystemRoles.length > 0 ? (
                          assignedSystemRoles.map((role) => (
                            <Tag
                              key={role}
                              style={{ width: 'fit-content', marginInlineEnd: 0 }}
                            >
                              {systemRoleLabels.get(role) ?? role}
                            </Tag>
                          ))
                        ) : (
                          <span className="value">{t('users.details.notAssigned')}</span>
                        )}
                      </DetailItem>
                    )}
                    {(accessLoading || Boolean(accessError) || companyCount > 0) && (
                      <DetailItem label={t('users.companies')}>
                        <span className="value">{companyCount}</span>
                      </DetailItem>
                    )}
                  </DetailItems>
                </DetailCard>
              )}
            </DetailGrid>

            {showSystemAccess && (
            <DetailGrid variant="single">
              <DetailCard full title={t('users.details.systemAccess')}>
                <Spin spinning={accessLoading}>
                  {accessError ? (
                    <div className="detail-note">{accessError}</div>
                  ) : systemAccess ? (
                    <div className="detail-items">
                      <DetailItem label={t('systemEmployees.fields.state')}>
                        <StatusBadge variant={getUserStatusVariant(systemAccess.state)}>
                          {t(`systemEmployees.states.${systemAccess.state}`, { defaultValue: systemAccess.state })}
                        </StatusBadge>
                        {systemAccess.roles.map((role) => (
                          <Tag
                            key={role}
                            style={{ width: 'fit-content', marginInlineEnd: 0 }}
                          >
                            {systemRoleLabels.get(role) ?? role}
                          </Tag>
                        ))}
                      </DetailItem>
                    </div>
                  ) : (
                    <Empty description={t('users.details.noSystemAccess')} />
                  )}
                </Spin>
              </DetailCard>
            </DetailGrid>
            )}

            {showCompanies && (
            <DetailGrid variant="single">
              <DetailCard full title={t('users.companies')}>
                <Spin spinning={accessLoading}>
                  {accessError ? (
                    <div className="detail-note">{accessError}</div>
                  ) : companyMemberships.length > 0 ? (
                    <div className="detail-items">
                      {companyMemberships.map((membership) => {
                        const company = companyById.get(membership.companyId);
                        const companyName =
                          company?.displayName ?? companyNameById.get(membership.companyId) ?? membership.companyId;
                        const companyRoleReferences = (companyRoleReferencesById[
                          membership.companyId
                        ] ?? []) as RoleReference<CompanyRole>[];
                        const roleLabels = new Map(
                          companyRoleReferences.map((role) => [
                            role.alias,
                            getLocalizedText(role.name, currentLanguage),
                          ])
                        );

                        return (
                          <DetailItem key={membership.id} label={companyName}>
                            {canReadCompany && company ? (
                              <Link className="value link" to={routes.company(company.id)}>
                                {companyName}
                              </Link>
                            ) : (
                              <span className="value">{companyName}</span>
                            )}
                            <StatusBadge variant={getUserStatusVariant(membership.state)}>
                              {t(`companyMemberships.states.${membership.state}`, { defaultValue: membership.state })}
                            </StatusBadge>
                            {membership.roles.map((role) => (
                              <Tag
                                key={role}
                                style={{ width: 'fit-content', marginInlineEnd: 0 }}
                              >
                                {roleLabels.get(role) ?? role}
                              </Tag>
                            ))}
                          </DetailItem>
                        );
                      })}
                    </div>
                  ) : userOrganizations.length > 0 ? (
                    <div className="detail-items">
                      {userOrganizations.map((company) => (
                        <DetailItem key={company.id} label={t('organizations.addUserForm.label.displayName')}>
                          {canReadCompany ? (
                            <Link className="value link" to={routes.company(company.id)}>
                              {company.displayName}
                            </Link>
                          ) : (
                            <span className="value">{company.displayName}</span>
                          )}
                        </DetailItem>
                      ))}
                    </div>
                  ) : (
                    <Empty description={t('users.details.noCompanies')} />
                  )}
                </Spin>
              </DetailCard>
            </DetailGrid>
            )}
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

export default UserDetail;
