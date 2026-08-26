import { Empty, Spin, Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getUserById } from 'entities/users/model';
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
import type { SystemEmployee } from 'entities/systemEmployees/types';
import {
  isSystemEmployeesResponseSuccess,
  type SystemEmployeesResponseDto,
} from 'entities/systemEmployees/dtos';
import { mapSystemEmployeeDtoToEntity } from 'entities/systemEmployees/mappers';
import type { CompanyMembership } from 'entities/companyMemberships/types';
import {
  isCompanyMembershipsResponseSuccess,
  type CompanyMembershipsResponseDto,
} from 'entities/companyMemberships/dtos';
import { mapCompanyMembershipDtoToEntity } from 'entities/companyMemberships/mappers';

const getUserStatusVariant = (status?: string): StatusBadgeVariant =>
  status === 'active' ? 'success' : status === 'inactive' ? 'danger' : 'default';

const formatDateTime = (value?: Date | null) =>
  value ? dayjs(value).format('DD.MM.YYYY HH:mm') : '-';

const UsersRetrieve = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const navigateBack = useNavigationBack();
  const userById = useAppSelector((state) => state.users.userById);
  const isUserLoading = useAppSelector((state) => state.users.isLoading);
  const organizations = useAppSelector((state) => state.organizations.organizations);
  const canUpdateUser = useCan(endpointAccessMap.usersUpdate);
  const canListCompanies = useCan(endpointAccessMap.companiesList);
  const canReadCompany = useCan(endpointAccessMap.companiesRead);
  const canListSystemEmployees = useCan(endpointAccessMap.systemEmployeesList);
  const canSearchCompanyMemberships = useCan(endpointAccessMap.companyMembershipsSearch);
  const [systemEmployees, setSystemEmployees] = useState<SystemEmployee[]>([]);
  const [companyMemberships, setCompanyMemberships] = useState<CompanyMembership[]>([]);
  const [accessLoading, setAccessLoading] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    dispatch(getUserById({ id }));
  }, [dispatch, id]);

  useEffect(() => {
    if (canListCompanies) {
      dispatch(getAllOrganizations({ page: 1, limit: 1000, sortOrder: 'asc' }));
    }
  }, [canListCompanies, dispatch]);

  const currentUser = userById?.id === id ? userById : null;
  const isCurrentUserLoaded = Boolean(currentUser);
  const userOrganizations = useMemo(
    () =>
      currentUser
        ? organizations.filter((org) => currentUser.companyIds.includes(org.id))
        : [],
    [currentUser, organizations]
  );

  useEffect(() => {
    let isMounted = true;

    if (!currentUser?.email) {
      setSystemEmployees([]);
      setCompanyMemberships([]);
      return () => {
        isMounted = false;
      };
    }

    const user = currentUser;

    const loadAccess = async () => {
      setAccessLoading(true);
      setAccessError(null);

      try {
        const [systemResult, companyResults] = await Promise.all([
          canListSystemEmployees
            ? axiosInstance
                .get<SystemEmployeesResponseDto>('/system/employees', {
                  params: { page: 1, limit: 20, query: user.email },
                })
                .then((response) =>
                  isSystemEmployeesResponseSuccess(response.data)
                    ? response.data.data
                        .map(mapSystemEmployeeDtoToEntity)
                        .filter((employee) => employee.user.id === user.id)
                    : []
                )
            : Promise.resolve([]),
          canSearchCompanyMemberships && user.companyIds.length > 0
            ? Promise.all(
                user.companyIds.map((companyId) =>
                  axiosInstance
                    .get<CompanyMembershipsResponseDto>('/company-memberships/search', {
                      params: { query: user.email, page: 1, limit: 10 },
                      headers: { 'x-company-id': companyId },
                    })
                    .then((response) =>
                      isCompanyMembershipsResponseSuccess(response.data)
                        ? response.data.data
                            .map(mapCompanyMembershipDtoToEntity)
                            .filter((membership) => membership.userId === user.id)
                        : []
                    )
                )
              ).then((items) => items.flat())
            : Promise.resolve([]),
        ]);

        if (isMounted) {
          setSystemEmployees(systemResult);
          setCompanyMemberships(companyResults);
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
  }, [
    canListSystemEmployees,
    canSearchCompanyMemberships,
    currentUser,
    t,
  ]);

  if (isUserLoading && !isCurrentUserLoaded) {
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

  if (!isCurrentUserLoaded || !userById) {
    return (
      <MainLayout>
        <Heading title={t('users.details.title')} subtitle={t('common.details')}>
          <CustomButton variant="outline" onClick={() => navigateBack('/users')}>
            {t('common.backToList')}
          </CustomButton>
        </Heading>
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

  const fullName = [userById.firstName, userById.lastName].filter(Boolean).join(' ') || userById.email;
  const companyById = new Map(organizations.map((company) => [company.id, company]));
  const companyCount = companyMemberships.length || userOrganizations.length || userById.companyIds.length;
  const showAccessSummary = accessLoading || accessError || systemEmployees.length > 0 || companyCount > 0;
  const showSystemAccess = accessLoading || Boolean(accessError) || systemEmployees.length > 0;
  const showCompanies = accessLoading || Boolean(accessError) || companyMemberships.length > 0 || userOrganizations.length > 0;
  const profileItems = [
    { label: t('users.addUserForm.label.firstName'), value: userById.firstName || '-' },
    { label: t('users.addUserForm.label.lastName'), value: userById.lastName || '-' },
    { label: t('users.addUserForm.label.email'), value: userById.email || '-' },
    { label: t('users.addUserForm.label.phone'), value: userById.phone ? FormatUzbekPhoneNumber(userById.phone) : '-' },
    { label: t('users.addUserForm.label.lastLoggedInAt'), value: formatDateTime(userById.lastLoggedInAt) },
  ].concat(
    userById.pinfl
      ? [{ label: t('users.addUserForm.label.pinfl'), value: userById.pinfl }]
      : []
  );

  return (
    <MainLayout>
      <Heading title={`${t('users.details.title')} - ${fullName}`} subtitle={t('common.details')}>
        <div className="btns-group">
          {canUpdateUser && (
            <CustomButton onClick={() => navigate(`/users/${userById.id}/edit`)}>
              {t('btn.edit')}
            </CustomButton>
          )}
          <CustomButton variant="outline" onClick={() => navigateBack('/users')}>
            {t('common.backToList')}
          </CustomButton>
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
                  <StatusBadge variant={getUserStatusVariant(userById.status)}>
                    {t(`statuses.${userById.status}`, { defaultValue: userById.status })}
                  </StatusBadge>
                </div>
              </div>
              <div className="route-overview-meta">
                <RouteMetaChip label={t('users.addUserForm.label.email')} value={userById.email || '-'} />
                <RouteMetaChip label={t('users.addUserForm.label.phone')} value={userById.phone ? FormatUzbekPhoneNumber(userById.phone) : '-'} />
                {userById.pinfl && (
                  <RouteMetaChip label={t('users.addUserForm.label.pinfl')} value={userById.pinfl} />
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
                    {(accessLoading || accessError || systemEmployees.length > 0) && (
                      <DetailItem label={t('users.details.systemAccess')}>
                        <span className="value">
                          {systemEmployees.length > 0 ? t('users.details.enabled') : t('users.details.notAssigned')}
                        </span>
                      </DetailItem>
                    )}
                    {(accessLoading || accessError || companyCount > 0) && (
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
                  ) : systemEmployees.length > 0 ? (
                    <div className="detail-items">
                      {systemEmployees.map((employee) => (
                        <DetailItem key={employee.id} label={t('systemEmployees.fields.state')}>
                          <StatusBadge variant={getUserStatusVariant(employee.state)}>
                            {t(`systemEmployees.states.${employee.state}`, { defaultValue: employee.state })}
                          </StatusBadge>
                          {employee.roles.map((role) => (
                            <Tag key={role}>{t(`systemEmployees.roles.${role}`, { defaultValue: role })}</Tag>
                          ))}
                        </DetailItem>
                      ))}
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
                        const companyName = company?.displayName ?? membership.companyId;

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
                              <Tag key={role}>{t(`companyMemberships.roles.${role}`, { defaultValue: role })}</Tag>
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

export default UsersRetrieve;
