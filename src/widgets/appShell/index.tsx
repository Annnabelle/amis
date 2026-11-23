import React, { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { routes } from "shared/config/routes";
import {
  buildCompanyModuleItems,
  COMPANY_MENU_GROUPS,
  type CompanyMenuGroup,
  type CompanyModuleMenuItem,
} from 'widgets/appShell/lib/companyMenuItems';
import { type MenuProps } from 'antd';
import { Menu, Select, Switch, Tag } from 'antd';

import ConnectionBadge from './connectionBadge';
import PageLayout from './pageLayout';
import MobileSider from 'widgets/appShell/ui/mobileSider';
import type { MobileNavConfig, MobileNavItem } from 'widgets/appShell/lib/mobileNav';
import { ApartmentOutlined, CloseOutlined, ContactsOutlined, FileTextOutlined, LogoutOutlined, MenuOutlined, MoonOutlined, SunOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserInfo from 'widgets/userInfo';
import { UserPreviewCardById } from 'entities/users/ui/userPreviewCard';
import Languages from 'shared/ui/languages';
import CustomButton from 'shared/ui/button';
import './styles.sass';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'app/store';
import { useGetDeliveryRoutesQuery } from 'entities/deliveryRoutes/api';
import {
  useGetCompaniesQuery,
  useGetCompanyByIdQuery,
} from 'entities/organization/api';
import { setCurrentCompanyId } from 'entities/access/model';
import { useUpdateUserPreferencesMutation } from 'entities/users/api';
import {
  useDecideSystemAccessInvitationMutation,
  useGetRoleReferencesQuery,
  useLazyGetRoleReferencesQuery,
  useRespondCompanyMembershipInvitationMutation,
} from 'entities/access/api';
import {
  AccessModules,
  RoleScope,
  type AccessModule,
  type RoleReference,
} from 'entities/access/types';
import { useTheme } from 'app/providers/theme';
import { useIsMobile } from 'shared/lib/useIsMobile';
import { parseCompanyFromPath } from 'shared/lib/companyPath';
import { isLanguage, type Language } from 'shared/types/dtos';
import { useCan } from 'entities/access/lib';
import { endpointAccessMap } from 'shared/config/endpointAccessMap';

// Порядок групп в меню компании. Системное меню не группируется.


// Разделы нижней панели на телефоне, в порядке приоритета. Пункты
// отбираются из доступных пользователю, поэтому панель не ведёт туда,
// где нет прав.
const MOBILE_TABBAR_KEYS = ['orders', 'delivery-routes', 'waybills', 'products'] as const;

interface MainLayoutProps {
  children: ReactNode;
}

const getLocalizedText = (
  value: Record<Language, string>,
  language: Language
) => value[language] || value.ru || value.en || value.uz;

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { isDarkTheme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const isMobile = useIsMobile();

  const access = useAppSelector((state) => state.access.data);
  const storedCompanyId = useAppSelector((state) => state.access.currentCompanyId);
  const isAuthenticated = useAppSelector((state) => state.users.isAuthenticated);
  const [updateUserPreferences] = useUpdateUserPreferencesMutation();

  /** Выбранный язык сохраняется в профиле; на экране входа сохранять некому. */
  const handleLanguageChange = useCallback(
    (language: Language) => {
      if (!isAuthenticated) return;

      void updateUserPreferences({ language });
    },
    [isAuthenticated, updateUserPreferences]
  );


  const systemModules = useMemo(
    () => access?.system.modules ?? [],
    [access?.system.modules]
  );
  const companies = useMemo(
    () => access?.companies ?? [],
    [access?.companies]
  );
  const pendingSystemInvitations = useMemo(
    () =>
      access?.invitations.systemAccess.filter(
        (invitation) => invitation.state === 'invited'
      ) ?? [],
    [access?.invitations.systemAccess]
  );
  const pendingCompanyInvitations = useMemo(
    () =>
      access?.invitations.companyMemberships.filter(
        (invitation) => invitation.state === 'invited'
      ) ?? [],
    [access?.invitations.companyMemberships]
  );
  const currentLanguage = isLanguage(i18n.language) ? i18n.language : 'ru';
  const { data: systemRoleReferences = [] } = useGetRoleReferencesQuery(
    { scope: RoleScope.System },
    { skip: !access }
  );
  const [loadCompanyRoleReferences] = useLazyGetRoleReferencesQuery();
  const [decideSystemAccessInvitation] =
    useDecideSystemAccessInvitationMutation();
  const [respondCompanyMembershipInvitation] =
    useRespondCompanyMembershipInvitationMutation();
  /**
   * Роли читаются на каждое приглашение своим запросом, а хук в цикле звать
   * нельзя, поэтому ответы складываются здесь по компании.
   */
  const [companyInvitationRoles, setCompanyInvitationRoles] = useState<
    Record<string, RoleReference[]>
  >({});
  const systemRoleLabels = useMemo(
    () =>
      systemRoleReferences.reduce<Record<string, string>>((acc, role) => {
        acc[role.alias] = getLocalizedText(role.name, currentLanguage);
        return acc;
      }, {}),
    [currentLanguage, systemRoleReferences]
  );
  const companyRoleLabelsByCompany = useMemo(
    () =>
      pendingCompanyInvitations.reduce<Record<string, Record<string, string>>>(
        (acc, invitation) => {
          acc[invitation.company.id] = (
            companyInvitationRoles[invitation.company.id] ?? []
          ).reduce<Record<string, string>>((roleAcc, role) => {
            roleAcc[role.alias] = getLocalizedText(role.name, currentLanguage);
            return roleAcc;
          }, {});
          return acc;
        },
        {}
      ),
    [companyInvitationRoles, currentLanguage, pendingCompanyInvitations]
  );
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const orgId = parseCompanyFromPath(location.pathname) ?? undefined;
  const section = pathSegments[2];
  const routeId = section === 'delivery-routes' ? pathSegments[3] : undefined;
  const isOrganizationRoot = location.pathname === routes.companies();
  const isOrganizationScreen = pathSegments[0] === 'organization' && Boolean(orgId) && !section;
  const isRoutesScreen = pathSegments[0] === 'organization' && Boolean(orgId) && section === 'delivery-routes' && !routeId;
  /** Рейсы нужны только мобильному меню рейсов, поэтому вне него запрос не идёт. */
  const { data: deliveryRoutes = [] } = useGetDeliveryRoutesQuery(
    {},
    { skip: !isMobile || !orgId || section !== 'delivery-routes' }
  );
  const isSystemScreen = [
    routes.users(),
    routes.systemEmployees(),
    routes.leads(),
    routes.auditLogs(),
  ].some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`));
  const routeCompanyId = orgId;
  const selectedCompanyId = routeCompanyId ?? storedCompanyId ?? companies[0]?.companyId;
  const membershipCompany = companies.find(
    (company) => company.companyId === selectedCompanyId
  );
  const canListCompanies = useCan(endpointAccessMap.companiesList);
  /** Системный сотрудник в контуре компании: названия в меню берём из неё. */
  const { data: organizationById } = useGetCompanyByIdQuery(
    { id: selectedCompanyId ?? '' },
    { skip: !selectedCompanyId || Boolean(membershipCompany) || !canListCompanies }
  );
  /** Список компаний нужен только мобильному переключателю. */
  const { data: companiesPage } = useGetCompaniesQuery(
    { page: 1, limit: 1000, sortOrder: 'asc' },
    { skip: !isMobile || !canListCompanies }
  );
  const organizations = useMemo(
    () => companiesPage?.items ?? [],
    [companiesPage]
  );
  const isSystemCompanyContext = Boolean(
    selectedCompanyId && storedCompanyId === selectedCompanyId && !membershipCompany
  );
  const systemCompany =
    isSystemCompanyContext &&
    organizationById &&
    String(organizationById.id) === selectedCompanyId
      ? {
          companyId: selectedCompanyId,
          name: organizationById.displayName,
          roles: [],
          permissions: access?.system.permissions ?? [],
          modules: systemModules,
        }
      : null;
  const selectedCompany = membershipCompany ?? systemCompany;
  const selectableCompanies = systemCompany
    ? [...companies, systemCompany]
    : companies;
  const mobileSelectableCompanies = useMemo(() => {
    const result = [...companies];

    organizations.forEach((organization) => {
      if (result.some((company) => company.companyId === String(organization.id))) {
        return;
      }

      result.push({
        companyId: String(organization.id),
        name: organization.displayName,
        roles: [],
        permissions: access?.system.permissions ?? [],
        modules: systemModules,
      });
    });

    return result;
  }, [access?.system.permissions, companies, organizations, systemModules]);

  useEffect(() => {
    pendingCompanyInvitations.forEach((invitation) => {
      const companyId = invitation.company.id;

      if (companyInvitationRoles[companyId]) return;

      // true — отдать значение из кеша, если роли этой компании уже брали.
      void loadCompanyRoleReferences(
        { scope: RoleScope.Company, companyId },
        true
      )
        .unwrap()
        .then((roles) => {
          setCompanyInvitationRoles((prev) => ({ ...prev, [companyId]: roles }));
        })
        .catch(() => undefined);
    });
  }, [companyInvitationRoles, loadCompanyRoleReferences, pendingCompanyInvitations]);

  const getCompanyModuleItems = useCallback(
    (companyId: string, modules: AccessModule[]) =>
      access ? buildCompanyModuleItems({ companyId, modules, access, t }) : [],
    [access, t]
  );

  const systemMenuItems = useMemo<MenuProps['items']>(() => {
    const items: MenuProps['items'] = [];

  if (systemModules.includes(AccessModules.Users)) {
    items.push({
      key: routes.users(),
      icon: <UserOutlined />,
      label: (
        <Link to={routes.users()}>
          {t('navigation.users') || 'Пользователи'}
        </Link>
      ),
    });
  }

  if (systemModules.includes(AccessModules.SystemEmployees)) {
    items.push({
      key: routes.systemEmployees(),
      icon: <TeamOutlined />,
      label: (
        <Link to={routes.systemEmployees()}>
          {t('navigation.systemEmployees')}
        </Link>
      ),
    });
  }

  if (systemModules.includes(AccessModules.Companies)) {
    items.push({
      key: routes.companies(),
      icon: <ApartmentOutlined />,
      label: (
        <Link to={routes.companies()}>
          {t('navigation.organizations') || 'Организации'}
        </Link>
      ),
    });
  }

  if (systemModules.includes(AccessModules.Leads)) {
    items.push({
      key: routes.leads(),
      icon: <ContactsOutlined />,
      label: (
        <Link to={routes.leads()}>
          {t('navigation.leads')}
        </Link>
      ),
    });
  }

  if (systemModules.includes(AccessModules.Audit)) {
    items.push({
      key: routes.auditLogs(),
      icon: <FileTextOutlined />,
      label: (
        <Link to={routes.auditLogs()}>
          {t('navigation.audit') || 'Логи системы'}
        </Link>
      ),
    });
  }

    return items;
  }, [systemModules, t]);

  const hasSidebarNavigation =
    (systemMenuItems?.length ?? 0) > 0 ||
    selectableCompanies.length > 0 ||
    pendingSystemInvitations.length > 0 ||
    pendingCompanyInvitations.length > 0;

  const systemMobileNavItems = useMemo<MobileNavItem[]>(() => [
    ...(systemModules.includes(AccessModules.Users)
      ? [{
          key: routes.users(),
          label: t('navigation.users'),
          meta: '',
          isActive: location.pathname === routes.users() || location.pathname.startsWith(`${routes.users()}/`),
          onClick: () => navigate(routes.users()),
        }]
      : []),
    ...(systemModules.includes(AccessModules.SystemEmployees)
      ? [{
          key: routes.systemEmployees(),
          label: t('navigation.systemEmployees'),
          meta: '',
          isActive:
            location.pathname === routes.systemEmployees() ||
            location.pathname.startsWith(`${routes.systemEmployees()}/`),
          onClick: () => navigate(routes.systemEmployees()),
        }]
      : []),
    ...(systemModules.includes(AccessModules.Companies)
      ? [{
          key: routes.companies(),
          label: t('navigation.organizations'),
          meta: '',
          isActive: location.pathname === routes.companies(),
          onClick: () => navigate(routes.companies()),
        }]
      : []),
    ...(systemModules.includes(AccessModules.Leads)
      ? [{
          key: routes.leads(),
          label: t('navigation.leads'),
          meta: '',
          isActive: location.pathname === routes.leads(),
          onClick: () => navigate(routes.leads()),
        }]
      : []),
    ...(systemModules.includes(AccessModules.Audit)
      ? [{
          key: routes.auditLogs(),
          label: t('navigation.audit'),
          meta: '',
          isActive: location.pathname === routes.auditLogs(),
          onClick: () => navigate(routes.auditLogs()),
        }]
      : []),
  ], [location.pathname, navigate, systemModules, t]);

  const selectedCompanyModuleItems = useMemo(
    () =>
      selectedCompany
        ? getCompanyModuleItems(selectedCompany.companyId, selectedCompany.modules)
        : [],
    [getCompanyModuleItems, selectedCompany]
  );

  const companyMenuGroupLabels: Record<CompanyMenuGroup, string> = {
    marking: t('navigation.groups.marking'),
    shipping: t('navigation.groups.shipping'),
    company: t('navigation.groups.company'),
  };

  // Пункты компании раскладываются по группам в фиксированном порядке.
  // Группа без доступных пунктов не рендерится, в свёрнутом сайдбаре
  // заголовки скрыты — иначе они ломают узкую колонку.
  const companyMenuItems: NonNullable<MenuProps['items']> = COMPANY_MENU_GROUPS
    .map((group) => {
      const children = selectedCompanyModuleItems
        .filter((item) => item.group === group)
        .map((item) => ({
          key: item.path,
          icon: item.icon,
          label: <Link to={item.path}>{item.label}</Link>,
        }));

      return children.length > 0
        ? {
            key: `group-${group}`,
            type: 'group' as const,
            label: collapsed ? null : companyMenuGroupLabels[group],
            children,
          }
        : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (isSystemCompanyContext && selectedCompany) {
    companyMenuItems.push({
      key: 'exit-company',
      icon: <LogoutOutlined />,
      danger: true,
      label: t('navigation.exitCompany'),
      onClick: () => {
        dispatch(setCurrentCompanyId(null));
        navigate(routes.companies());
      },
    });
  }

  const selectedKeys = useMemo(() => {
    const selectedCompanyModule = selectedCompanyModuleItems.find((item) =>
      location.pathname.startsWith(item.path)
    );

    if (selectedCompanyModule) {
      return [selectedCompanyModule.path];
    }

    const topLevel = `/${location.pathname.split('/')[1]}`;
    return (systemMenuItems ?? []).some((item) => item?.key === topLevel)
      ? [topLevel]
      : [];
  }, [location.pathname, selectedCompanyModuleItems, systemMenuItems]);

  const mobileTabbarItems = MOBILE_TABBAR_KEYS
    .map((key) => selectedCompanyModuleItems.find((item) => item.key === key))
    .filter((item): item is CompanyModuleMenuItem => item !== undefined);

  const handleCompanyChange = (companyId: string) => {
    const company =
      selectableCompanies.find((item) => item.companyId === companyId) ?? null;

    dispatch(setCurrentCompanyId(companyId));
    const firstModule = company
      ? getCompanyModuleItems(company.companyId, company.modules)[0]
      : undefined;

    navigate(firstModule?.path ?? routes.company(companyId));
  };

  const handleMobileCompanySelect = useCallback((companyId: string) => {
    dispatch(setCurrentCompanyId(companyId));
    navigate(routes.company(companyId));
  }, [dispatch, navigate]);

  const mobileNav = useMemo<MobileNavConfig | null>(() => {
    if (!isMobile) {
      return null;
    }

    if (isSystemScreen && systemMobileNavItems.length > 0) {
      return {
        title: t('navigation.management'),
        subtitle: '',
        backPath: null as string | null,
        items: systemMobileNavItems,
      };
    }

    if (isOrganizationRoot) {
      return {
        title: t('navigation.myOrganizations'),
        subtitle: '',
        backPath: null as string | null,
        items: mobileSelectableCompanies.map((company) => ({
          key: company.companyId,
          label: company.name,
          meta: '',
          isActive: false,
          onClick: () => handleMobileCompanySelect(company.companyId),
        })),
      };
    }

    if (isOrganizationScreen && orgId) {
      return {
        title: selectedCompany?.name ?? t('navigation.myOrganizations'),
        subtitle: t('navigation.myOrganizations'),
        backPath: routes.companies(),
        items: selectedCompanyModuleItems.map((item) => ({
          key: `${orgId}-${item.key}`,
          label: item.label,
          meta: '',
          isActive: location.pathname === item.path,
          onClick: () => navigate(item.path),
        })),
      };
    }

    if (isRoutesScreen && orgId) {
      return {
        title: t('navigation.routes'),
        subtitle: selectedCompany?.name ?? '',
        backPath: routes.company(orgId),
        items: deliveryRoutes.map((route) => ({
          key: route.id,
          label: route.routeNumber,
          meta: t(`deliveryRoutes.status.${route.status}`),
          status: route.status,
          isActive: route.id === routeId,
          onClick: () => navigate(routes.deliveryRoute(orgId, route.id)),
        })),
      };
    }

    return null;
  }, [
    isMobile,
    isSystemScreen,
    isOrganizationRoot,
    isOrganizationScreen,
    isRoutesScreen,
    location.pathname,
    navigate,
    orgId,
    routeId,
    deliveryRoutes,
    selectedCompany?.name,
    selectedCompanyModuleItems,
    systemMobileNavItems,
    mobileSelectableCompanies,
    handleMobileCompanySelect,
    t,
  ]);

  return (
    <PageLayout
      isMobile={isMobile}
      siderCollapsed={collapsed}
      header={
        <>
          <div className="layout-header-container">
            <div className="layout-header-container-items">
              <h1 className="logo">AMIS</h1>
            </div>

            <div className="layout-header-container-items">
              <ConnectionBadge />
              <div className="theme-toggle">
                <Switch
                  checked={isDarkTheme}
                  onChange={toggleTheme}
                  checkedChildren={<MoonOutlined />}
                  unCheckedChildren={<SunOutlined />}
                />
              </div>
              <Languages onLanguageChange={handleLanguageChange} />
              <UserInfo />
            </div>
          </div>
        </>
      }
      mobileHeader={
        <>
        <div className="mobile-header">
          <span className="mobile-header-logo">AMIS</span>
          <div className="mobile-header-profile">
            <UserInfo showProfileAction={false} />
          </div>
        </div>
        </>
      }
      sider={
        hasSidebarNavigation ? (
          <>
            <div className={`layout-sider-trigger ${collapsed ? 'triggered' : ''}`}>
              <CustomButton
                variant="text"
                icon={collapsed ? <MenuOutlined /> : <CloseOutlined />}
                iconOnly
                onClick={() => setCollapsed(!collapsed)}
                aria-label={collapsed ? t('navigation.openMenu', { defaultValue: 'Открыть меню' }) : t('navigation.closeMenu', { defaultValue: 'Закрыть меню' })}
              />
            </div>

            {!collapsed && (pendingSystemInvitations.length > 0 || pendingCompanyInvitations.length > 0) && (
              <div className="layout-sider-invitations">
                {pendingSystemInvitations.map((invitation) => (
                  <div className="layout-sider-invitation" key={invitation.id}>
                    <div className="layout-sider-invitation-copy">
                      <p className="layout-sider-invitation-title">
                        {t('systemEmployees.invitations.title')}
                      </p>
                      <p className="layout-sider-invitation-subtitle">
                        {t('systemEmployees.invitations.rolesPrefix')}
                      </p>
                      <div className="layout-sider-invitation-roles">
                        {invitation.roles.map((role) => (
                          <Tag key={role} style={{ width: 'auto' }}>
                            {systemRoleLabels[role] ?? role}
                          </Tag>
                        ))}
                      </div>
                      <div className="layout-sider-invitation-created-by">
                        <span className="layout-sider-invitation-created-by-label">
                          {t('systemEmployees.fields.invitedBy')}
                        </span>
                        <UserPreviewCardById userId={invitation.createdBy} />
                      </div>
                    </div>
                    <div className="layout-sider-invitation-actions">
                      <CustomButton
                        className="layout-sider-invitation-accept"
                        size="sm"
                        onClick={() => {
                          void decideSystemAccessInvitation({
                            id: invitation.id,
                            decision: 'accept',
                          });
                        }}
                      >
                        {t('systemEmployees.actions.accept')}
                      </CustomButton>
                      <CustomButton
                        variant="danger"
                        className="layout-sider-invitation-decline"
                        size="sm"
                        onClick={() => {
                          void decideSystemAccessInvitation({
                            id: invitation.id,
                            decision: 'decline',
                          });
                        }}
                      >
                        {t('systemEmployees.actions.decline')}
                      </CustomButton>
                    </div>
                  </div>
                ))}
                {pendingCompanyInvitations.map((invitation) => (
                  <div className="layout-sider-invitation" key={invitation.id}>
                    <div className="layout-sider-invitation-copy">
                      <p className="layout-sider-invitation-title">
                        {t('companyMemberships.invitations.title')}
                      </p>
                      <p className="layout-sider-invitation-subtitle">
                        {invitation.company.name}
                      </p>
                      <p className="layout-sider-invitation-subtitle">
                        {t('companyMemberships.invitations.rolesPrefix')}
                      </p>
                      <div className="layout-sider-invitation-roles">
                        {invitation.roles.map((role) => (
                          <Tag key={role} style={{ width: 'auto' }}>
                            {companyRoleLabelsByCompany[invitation.company.id]?.[role] ?? role}
                          </Tag>
                        ))}
                      </div>
                      <div className="layout-sider-invitation-created-by">
                        <span className="layout-sider-invitation-created-by-label">
                          {t('companyMemberships.fields.invitedBy')}
                        </span>
                        <UserPreviewCardById userId={invitation.createdBy} />
                      </div>
                    </div>
                    <div className="layout-sider-invitation-actions">
                      <CustomButton
                        className="layout-sider-invitation-accept"
                        size="sm"
                        onClick={() => {
                          void respondCompanyMembershipInvitation({
                            id: invitation.id,
                            decision: 'accept',
                          });
                        }}
                      >
                        {t('companyMemberships.actions.accept')}
                      </CustomButton>
                      <CustomButton
                        variant="danger"
                        className="layout-sider-invitation-decline"
                        size="sm"
                        onClick={() => {
                          void respondCompanyMembershipInvitation({
                            id: invitation.id,
                            decision: 'decline',
                          });
                        }}
                      >
                        {t('companyMemberships.actions.decline')}
                      </CustomButton>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Menu
              key={`menu-${collapsed ? 'collapsed' : 'open'}`}
              mode="inline"
              inlineCollapsed={collapsed}
              selectedKeys={selectedKeys}
              items={systemMenuItems}
              inlineIndent={24}
              className="layout-sider-menu"
            />

            {selectableCompanies.length > 0 && (
              <>
                {!collapsed && (
                  <div className="layout-company-selector">
                    <Select
                      value={selectedCompanyId}
                      options={selectableCompanies.map((company) => ({
                        value: company.companyId,
                        label: company.name,
                      }))}
                      onChange={handleCompanyChange}
                      className="layout-company-selector-control"
                      popupClassName="company-selector-popup"
                      popupMatchSelectWidth={false}
                    />
                  </div>
                )}

                <Menu
                  mode="inline"
                  inlineCollapsed={collapsed}
                  selectedKeys={selectedKeys}
                  items={companyMenuItems}
                  inlineIndent={16}
                  className="layout-sider-menu layout-company-menu"
                />
                </>
              )}
          </>
        ) : null
      }
    >
          {mobileNav && <MobileSider nav={mobileNav} />}

          {children}

          {isMobile && orgId && mobileTabbarItems.length > 0 && (
            <nav
              className="mobile-tabbar"
              style={{
                gridTemplateColumns: `repeat(${mobileTabbarItems.length}, minmax(0, 1fr))`,
              }}
              aria-label={t('navigation.mobileTabs')}
            >
              {mobileTabbarItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`mobile-tabbar-item ${section === item.key ? 'is-active' : ''}`}
                >
                  <span className="mobile-tabbar-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="mobile-tabbar-label">{item.label}</span>
                </Link>
              ))}
            </nav>
          )}
    </PageLayout>
  );
};

export default MainLayout;
