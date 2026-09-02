import { Empty, Spin, Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCurrentUser, getUserById } from 'entities/users/model';
import { fetchRoleReferences } from 'entities/access/model';
import {
  getRoleReferenceCacheKey,
  RoleReferenceScope,
  type RoleReference,
} from 'entities/access/types';
import { useAppDispatch, useAppSelector } from 'app/store';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import CustomButton from 'shared/ui/button';
import { FormatUzbekPhoneNumber, useNavigationBack } from 'shared/lib';
import { getAllOrganizations } from 'entities/organization/model';
import { useCan } from 'entities/access/lib';
import { endpointAccessMap } from 'shared/config/endpointAccessMap';
import axiosInstance from 'shared/lib/axiosInstance';
import { getBackendErrorMessage } from 'shared/lib/getBackendErrorMessage';
import StatusBadge from 'shared/ui/statusBadge';
import type { StatusBadgeVariant } from 'shared/ui/statusBadge';
import {
  DetailCard,
  DetailGrid,
  DetailItem,
  DetailItems,
  RouteMetaChip,
} from 'shared/ui/details';
import type { SystemEmployee, SystemRole } from 'entities/systemEmployees/types';
import {
  isGetUserSystemAccessResponseSuccess,
  type GetUserSystemAccessResponseDto,
} from 'entities/systemEmployees/dtos';
import { mapSystemEmployeeDtoToEntity } from 'entities/systemEmployees/mappers';
import type { CompanyMembership, CompanyRole } from 'entities/companyMemberships/types';
import {
  isUserCompanyMembershipsResponseSuccess,
  type UserCompanyMembershipsResponseDto,
} from 'entities/companyMemberships/dtos';
import { mapCompanyMembershipDtoToEntity } from 'entities/companyMemberships/mappers';
import { isLanguage, type Language } from 'shared/types/dtos';

type UserDetailProps =
  | { self: true; userId?: undefined }
  | { self?: false; userId: string };

const getUserStatusVariant = (status?: string): StatusBadgeVariant =>
  status === 'active' ? 'success' : status === 'inactive' ? 'danger' : 'default';

const formatDateTime = (value?: Date | null) =>
  value ? dayjs(value).format('DD.MM.YYYY HH:mm') : '-';

const getLocalizedText = (
  value: Record<Language, string>,
  language: Language
) => value[language] || value.ru || value.en || value.uz;

const UserDetail = ({ self = false, userId }: UserDetailProps) => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const navigateBack = useNavigationBack();

  const reduxCurrentUser = useAppSelector((state) => state.users.currentUser);
  const userById = useAppSelector((state) => state.users.userById);
  const isUserLoading = useAppSelector((state) => state.users.isLoading);
  const organizations = useAppSelector((state) => state.organizations.organizations);
  const accessCompanies = useAppSelector((state) => state.access.data?.companies);
  const roleReferences = useAppSelector((state) => state.access.roleReferences);
  const roleReferencesLoading = useAppSelector((state) => state.access.roleReferencesLoading);
  const roleReferencesLoaded = useAppSelector((state) => state.access.roleReferencesLoaded);
  const canUpdateUser = useCan(endpointAccessMap.usersUpdate);
  const canListCompanies = useCan(endpointAccessMap.companiesList);
  const canReadCompany = useCan(endpointAccessMap.companiesRead);
  const canReadUser = useCan(endpointAccessMap.usersRead);
  const [systemAccess, setSystemAccess] = useState<SystemEmployee | null>(null);
  const [companyMemberships, setCompanyMemberships] = useState<CompanyMembership[]>([]);
  const [accessLoading, setAccessLoading] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);
  const currentLanguage = isLanguage(i18n.language) ? i18n.language : 'ru';

  const viewedUser = self
    ? reduxCurrentUser
    : userById?.id === userId
      ? userById
      : null;

  useEffect(() => {
    if (self) {
      dispatch(fetchCurrentUser());
    } else if (userId) {
      dispatch(getUserById({ id: userId }));
    }
  }, [dispatch, self, userId]);

  useEffect(() => {
    if (canListCompanies) {
      dispatch(getAllOrganizations({ page: 1, limit: 1000, sortOrder: 'asc' }));
    }
  }, [canListCompanies, dispatch]);

  const isViewedUserLoaded = Boolean(viewedUser);
  const userOrganizations = useMemo(
    () =>
      organizations.filter((organization) =>
        companyMemberships.some((membership) => membership.companyId === organization.id)
      ),
    [companyMemberships, organizations]
  );

  useEffect(() => {
    let isMounted = true;

    if (!viewedUser || (!self && !canReadUser)) {
      setSystemAccess(null);
      setCompanyMemberships([]);
      return () => {
        isMounted = false;
      };
    }

    const targetId = viewedUser.id;

    const loadAccess = async () => {
      setAccessLoading(true);
      setAccessError(null);

      try {
        const membershipsRequest = self
          ? axiosInstance.get<UserCompanyMembershipsResponseDto>('/users/me/company-memberships')
          : axiosInstance.get<UserCompanyMembershipsResponseDto>(`/users/${targetId}/company-memberships`);
        const systemAccessRequest = self
          ? axiosInstance.get<GetUserSystemAccessResponseDto>('/users/me/system-access')
          : axiosInstance.get<GetUserSystemAccessResponseDto>(`/users/${targetId}/system-access`);

        const [membershipsResponse, systemAccessResponse] = await Promise.all([
          membershipsRequest,
          systemAccessRequest,
        ]);

        const memberships = isUserCompanyMembershipsResponseSuccess(membershipsResponse.data)
          ? membershipsResponse.data.data.map(mapCompanyMembershipDtoToEntity)
          : [];
        const access =
          isGetUserSystemAccessResponseSuccess(systemAccessResponse.data) && systemAccessResponse.data.data
            ? mapSystemEmployeeDtoToEntity(systemAccessResponse.data.data)
            : null;

        if (isMounted) {
          setCompanyMemberships(memberships);
          setSystemAccess(access);
        }
      } catch (error) {
        if (isMounted) {
          setAccessError(getBackendErrorMessage(error, t('users.messages.error.loadAccess')));
        }
      } finally {
        if (isMounted) {
          setAccessLoading(false);
        }
      }
    };

    void loadAccess();

    return () => {
      isMounted = false;
    };
  }, [self, canReadUser, viewedUser, t]);

  useEffect(() => {
    const companyIds = new Set(companyMemberships.map((membership) => membership.companyId));

    companyIds.forEach((companyId) => {
      const key = getRoleReferenceCacheKey(RoleReferenceScope.Company, companyId);
      if (roleReferencesLoaded[key] || roleReferencesLoading[key]) return;

      void dispatch(fetchRoleReferences({ scope: RoleReferenceScope.Company, companyId }));
    });
  }, [companyMemberships, dispatch, roleReferencesLoaded, roleReferencesLoading]);

  useEffect(() => {
    if (!systemAccess) return;

    const key = getRoleReferenceCacheKey(RoleReferenceScope.System);
    if (roleReferencesLoaded[key] || roleReferencesLoading[key]) return;

    void dispatch(fetchRoleReferences({ scope: RoleReferenceScope.System }));
  }, [dispatch, roleReferencesLoaded, roleReferencesLoading, systemAccess]);

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
            <CustomButton variant="outline" onClick={() => navigateBack('/users')}>
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
  const systemRoleReferenceKey = getRoleReferenceCacheKey(RoleReferenceScope.System);
  const systemRoleReferences = (roleReferences[systemRoleReferenceKey] ?? []) as RoleReference<SystemRole>[];
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
            <CustomButton onClick={() => navigate('/change-password')}>
              {t('me.changePassword')}
            </CustomButton>
          ) : (
            <>
              {canUpdateUser && (
                <CustomButton onClick={() => navigate(`/users/${viewedUser.id}/edit`)}>
                  {t('btn.edit')}
                </CustomButton>
              )}
              <CustomButton variant="outline" onClick={() => navigateBack('/users')}>
                {t('common.backToList')}
              </CustomButton>
            </>
          )}
        </div>
      </Heading>
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
                        const referenceKey = getRoleReferenceCacheKey(
                          RoleReferenceScope.Company,
                          membership.companyId
                        );
                        const companyRoleReferences = (roleReferences[referenceKey] ?? []) as RoleReference<CompanyRole>[];
                        const roleLabels = new Map(
                          companyRoleReferences.map((role) => [
                            role.alias,
                            getLocalizedText(role.name, currentLanguage),
                          ])
                        );

                        return (
                          <DetailItem key={membership.id} label={companyName}>
                            {canReadCompany && company ? (
                              <Link className="value link" to={`/organization/${company.id}`}>
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
                            <Link className="value link" to={`/organization/${company.id}`}>
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
    </MainLayout>
  );
};

export default UserDetail;
