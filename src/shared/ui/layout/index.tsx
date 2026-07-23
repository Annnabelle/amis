import React, {
  useCallback,
  useState,
  type ReactNode,
  useEffect,
  useMemo,
} from 'react';
import { type MenuProps } from 'antd';
import { Button, Layout, Menu, Select, Switch, Tag } from 'antd';
import {
  ApartmentOutlined,
  UserOutlined,
  FileTextOutlined,
  LeftOutlined,
  AppstoreOutlined,
  CodeOutlined,
  ClusterOutlined,
  ShoppingCartOutlined,
  CarOutlined,
  FileDoneOutlined,
  ApiOutlined,
  LogoutOutlined,
  SunOutlined,
  MoonOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoClose } from 'react-icons/io5';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserInfo from 'widgets/userInfo';
import Session from 'widgets/session';
import { UserPreviewCardById } from 'entities/users/ui/userPreviewCard';
import Languages from '../languages';
import './styles.sass';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'app/store';
import { getDeliveryRoutes } from 'entities/deliveryRoutes/model';
import { getOrganizationById } from 'entities/organization/model';
import {
  acceptSystemAccessInvitation,
  declineSystemAccessInvitation,
  fetchRoleReferences,
  respondCompanyMembershipInvitation,
  setCurrentCompanyId,
} from 'entities/access/model';
import {
  AccessModules,
  getRoleReferenceCacheKey,
  RoleReferenceScope,
  type AccessModule,
} from 'entities/access/types';
import { useTheme } from 'app/themeContext';
import { useIsMobile } from 'shared/lib';
import { isLanguage, type Language } from 'shared/types/dtos';

const { Header, Content, Sider } = Layout;

interface MainLayoutProps {
  children: ReactNode;
}

type MobileNavItem = {
  key: string;
  label: string;
  meta: string;
  isActive: boolean;
  onClick: () => void | Promise<void>;
  status?: string;
};

type MobileNavConfig = {
  title: string;
  subtitle: string;
  backPath: string | null;
  items: MobileNavItem[];
};

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
  const routes = useAppSelector((state) => state.deliveryRoutes.routes);
  const organizations = useAppSelector(
    (state) => state.organizations.organizations
  );
  const organizationById = useAppSelector(
    (state) => state.organizations.organizationById
  );

  const systemModules = useMemo(
    () => access?.system.modules ?? [],
    [access?.system.modules]
  );
  const companies = useMemo(
    () => access?.companies ?? [],
    [access?.companies]
  );
  const pendingSystemInvitations = access?.invitations.systemAccess.filter(
    (invitation) => invitation.state === 'invited'
  ) ?? [];
  const pendingCompanyInvitations = access?.invitations.companyMemberships.filter(
    (invitation) => invitation.state === 'invited'
  ) ?? [];
  const currentLanguage = isLanguage(i18n.language) ? i18n.language : 'ru';
  const systemRoleReferences = useAppSelector(
    (state) => state.access.roleReferences[RoleReferenceScope.System] ?? []
  );
  const roleReferences = useAppSelector((state) => state.access.roleReferences);
  const roleReferencesLoaded = useAppSelector((state) => state.access.roleReferencesLoaded);
  const roleReferencesLoading = useAppSelector((state) => state.access.roleReferencesLoading);
  const areSystemRoleReferencesLoaded = useAppSelector((state) =>
    Boolean(state.access.roleReferencesLoaded[RoleReferenceScope.System])
  );
  const areSystemRoleReferencesLoading = useAppSelector((state) =>
    Boolean(state.access.roleReferencesLoading[RoleReferenceScope.System])
  );
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
          const key = getRoleReferenceCacheKey(
            RoleReferenceScope.Company,
            invitation.company.id
          );
          acc[invitation.company.id] = (roleReferences[key] ?? []).reduce<
            Record<string, string>
          >((roleAcc, role) => {
            roleAcc[role.alias] = getLocalizedText(role.name, currentLanguage);
            return roleAcc;
          }, {});
          return acc;
        },
        {}
      ),
    [currentLanguage, pendingCompanyInvitations, roleReferences]
  );
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const orgId = pathSegments[0] === 'organization' ? pathSegments[1] : undefined;
  const section = pathSegments[2];
  const routeId = section === 'delivery-routes' ? pathSegments[3] : undefined;
  const isOrganizationRoot = location.pathname === '/organization';
  const isOrganizationScreen = pathSegments[0] === 'organization' && Boolean(orgId) && !section;
  const isRoutesScreen = pathSegments[0] === 'organization' && Boolean(orgId) && section === 'delivery-routes' && !routeId;
  const isSystemScreen = [
    '/users',
    '/system-employees',
    '/audit-logs',
  ].some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`));
  const routeCompanyId = orgId;
  const selectedCompanyId = routeCompanyId ?? storedCompanyId ?? companies[0]?.companyId;
  const membershipCompany = companies.find(
    (company) => company.companyId === selectedCompanyId
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
    if (
      !access ||
      areSystemRoleReferencesLoaded ||
      areSystemRoleReferencesLoading
    ) {
      return;
    }

    void dispatch(fetchRoleReferences({ scope: RoleReferenceScope.System }));
  }, [
    areSystemRoleReferencesLoaded,
    areSystemRoleReferencesLoading,
    access,
    dispatch,
  ]);

  useEffect(() => {
    pendingCompanyInvitations.forEach((invitation) => {
      const key = getRoleReferenceCacheKey(
        RoleReferenceScope.Company,
        invitation.company.id
      );

      if (roleReferencesLoaded[key] || roleReferencesLoading[key]) {
        return;
      }

      void dispatch(fetchRoleReferences({
        scope: RoleReferenceScope.Company,
        companyId: invitation.company.id,
      }));
    });
  }, [
    dispatch,
    pendingCompanyInvitations,
    roleReferencesLoaded,
    roleReferencesLoading,
  ]);

  useEffect(() => {
    if (
      !selectedCompanyId ||
      membershipCompany ||
      (organizationById && String(organizationById.id) === selectedCompanyId)
    ) {
      return;
    }

    dispatch(getOrganizationById({ id: selectedCompanyId }));
  }, [
    dispatch,
    membershipCompany,
    organizationById,
    selectedCompanyId,
  ]);

  useEffect(() => {
    if (!isMobile || !orgId || section !== 'delivery-routes') {
      return;
    }

    dispatch(getDeliveryRoutes({}));
  }, [dispatch, isMobile, orgId, section]);

  type CompanyModuleMenuItem = {
    module: AccessModule;
    key: string;
    icon: ReactNode;
    path: string;
    label: string;
  };

  const getCompanyModuleItems = (
    companyId: string,
    modules: AccessModule[]
  ): CompanyModuleMenuItem[] => {
    const frontendModuleOrder: CompanyModuleMenuItem[] = [
      {
        module: AccessModules.CompanyMemberships,
        key: 'memberships',
        icon: <TeamOutlined />,
        path: `/organization/${companyId}/memberships`,
        label: t('navigation.companyMemberships'),
      },
      {
        module: AccessModules.Products,
        key: 'products',
        icon: <AppstoreOutlined />,
        path: `/organization/${companyId}/products`,
        label: t('navigation.products'),
      },
      {
        module: AccessModules.Orders,
        key: 'orders',
        icon: <CodeOutlined />,
        path: `/organization/${companyId}/orders`,
        label: t('navigation.markingCodes'),
      },
      {
        module: AccessModules.Reports,
        key: 'agregations',
        icon: <ClusterOutlined />,
        path: `/organization/${companyId}/agregations`,
        label: t('navigation.agregations'),
      },
      {
        module: AccessModules.SalesOrders,
        key: 'sales-orders',
        icon: <ShoppingCartOutlined />,
        path: `/organization/${companyId}/sales-orders`,
        label: t('navigation.deals'),
      },
      {
        module: AccessModules.DeliveryRoutes,
        key: 'delivery-routes',
        icon: <CarOutlined />,
        path: `/organization/${companyId}/delivery-routes`,
        label: t('navigation.routes'),
      },
      {
        module: AccessModules.Invoices,
        key: 'invoices',
        icon: <FileDoneOutlined />,
        path: `/organization/${companyId}/invoices`,
        label: t('navigation.invoices'),
      },
      {
        module: AccessModules.Integrations,
        key: 'integrations',
        icon: <ApiOutlined />,
        path: `/organization/${companyId}/integrations`,
        label: t('navigation.integrations'),
      },
    ];

    return frontendModuleOrder.filter((item) => modules.includes(item.module));
  };

  const systemMenuItems: MenuProps['items'] = [];

  if (systemModules.includes(AccessModules.Users)) {
    systemMenuItems.push({
      key: '/users',
      icon: <UserOutlined />,
      label: (
        <Link to="/users">
          {t('navigation.users') || 'Пользователи'}
        </Link>
      ),
    });
  }

  if (systemModules.includes(AccessModules.Employees)) {
    systemMenuItems.push({
      key: '/system-employees',
      icon: <TeamOutlined />,
      label: (
        <Link to="/system-employees">
          {t('navigation.systemEmployees')}
        </Link>
      ),
    });
  }

  if (systemModules.includes(AccessModules.Companies)) {
    systemMenuItems.push({
      key: '/organization',
      icon: <ApartmentOutlined />,
      label: (
        <Link to="/organization">
          {t('navigation.organizations') || 'Организации'}
        </Link>
      ),
    });
  }

  if (systemModules.includes(AccessModules.Audit)) {
    systemMenuItems.push({
      key: '/audit-logs',
      icon: <FileTextOutlined />,
      label: (
        <Link to="/audit-logs">
          {t('navigation.audit') || 'Логи системы'}
        </Link>
      ),
    });
  }

  const systemMobileNavItems = useMemo<MobileNavItem[]>(() => [
    ...(systemModules.includes(AccessModules.Users)
      ? [{
          key: '/users',
          label: t('navigation.users'),
          meta: '',
          isActive: location.pathname === '/users' || location.pathname.startsWith('/users/'),
          onClick: () => navigate('/users'),
        }]
      : []),
    ...(systemModules.includes(AccessModules.Employees)
      ? [{
          key: '/system-employees',
          label: t('navigation.systemEmployees'),
          meta: '',
          isActive:
            location.pathname === '/system-employees' ||
            location.pathname.startsWith('/system-employees/'),
          onClick: () => navigate('/system-employees'),
        }]
      : []),
    ...(systemModules.includes(AccessModules.Companies)
      ? [{
          key: '/organization',
          label: t('navigation.organizations'),
          meta: '',
          isActive: location.pathname === '/organization',
          onClick: () => navigate('/organization'),
        }]
      : []),
    ...(systemModules.includes(AccessModules.Audit)
      ? [{
          key: '/audit-logs',
          label: t('navigation.audit'),
          meta: '',
          isActive: location.pathname === '/audit-logs',
          onClick: () => navigate('/audit-logs'),
        }]
      : []),
  ], [location.pathname, navigate, systemModules, t]);

  const selectedCompanyModuleItems = selectedCompany
    ? getCompanyModuleItems(selectedCompany.companyId, selectedCompany.modules)
    : [];

  const companyMenuItems: MenuProps['items'] = selectedCompanyModuleItems.map(
    (item) => ({
      key: item.path,
      icon: item.icon,
      label: <Link to={item.path}>{item.label}</Link>,
    })
  );

  if (isSystemCompanyContext && selectedCompany) {
    companyMenuItems.push({
      key: 'exit-company',
      icon: <LogoutOutlined />,
      danger: true,
      label: t('navigation.exitCompany'),
      onClick: () => {
        dispatch(setCurrentCompanyId(null));
        navigate('/organization');
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
    return systemMenuItems.some((item) => item?.key === topLevel)
      ? [topLevel]
      : [];
  }, [location.pathname, selectedCompanyModuleItems, systemMenuItems]);

  const handleCompanyChange = (companyId: string) => {
    const company =
      selectableCompanies.find((item) => item.companyId === companyId) ?? null;

    dispatch(setCurrentCompanyId(companyId));
    const firstModule = company
      ? getCompanyModuleItems(company.companyId, company.modules)[0]
      : undefined;

    navigate(firstModule?.path ?? `/organization/${companyId}`);
  };

  const handleMobileCompanySelect = useCallback((companyId: string) => {
    dispatch(setCurrentCompanyId(companyId));
    navigate(`/organization/${companyId}`);
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
        backPath: '/organization',
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
        backPath: `/organization/${orgId}`,
        items: routes.map((route) => ({
          key: route.id,
          label: route.routeNumber,
          meta: t(`deliveryRoutes.status.${route.status}`),
          status: route.status,
          isActive: route.id === routeId,
          onClick: () => navigate(`/organization/${orgId}/delivery-routes/${route.id}`),
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
    routes,
    selectedCompany?.name,
    selectedCompanyModuleItems,
    systemMobileNavItems,
    mobileSelectableCompanies,
    handleMobileCompanySelect,
    t,
  ]);

  return (
    <Layout className="layout">
      {!isMobile && (
        <Header className="layout-header">
          <div className="layout-header-container">
            <div className="layout-header-container-items">
              <h1 className="logo">AMIS</h1>
            </div>

            <div className="layout-header-container-items">
              <div className="theme-toggle">
                <Switch
                  checked={isDarkTheme}
                  onChange={toggleTheme}
                  checkedChildren={<MoonOutlined />}
                  unCheckedChildren={<SunOutlined />}
                />
              </div>
              <Languages />
              <Session />
              <UserInfo />
            </div>
          </div>
        </Header>
      )}

      {isMobile && (
        <div className="mobile-header">
          <span className="mobile-header-logo">AMIS</span>
          <div className="mobile-header-profile">
            <UserInfo showProfileAction={false} />
          </div>
        </div>
      )}

      <div className="layout-content-wrapper">
        <Layout className="layout-content">
          {!isMobile && (
            <Sider
              collapsible
              collapsed={collapsed}
              trigger={null}
              width={260}
              collapsedWidth={80}
              className={`layout-sider ${collapsed ? 'is-collapsed' : 'is-opened'}`}
              style={{
                width: 'auto',
                minWidth: collapsed ? 80 : 220,
                maxWidth: collapsed ? 80 : 420,
                transition: 'min-width 0.3s ease, max-width 0.3s ease',
              }}
            >
              <div className={`layout-sider-trigger ${collapsed ? 'triggered' : ''}`}>
                <Button
                  type="text"
                  icon={collapsed ? <GiHamburgerMenu /> : <IoClose />}
                  onClick={() => setCollapsed(!collapsed)}
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
                        <Button
                          type="primary"
                          className="layout-sider-invitation-accept"
                          onClick={() => {
                            void dispatch(acceptSystemAccessInvitation({ id: invitation.id }));
                          }}
                        >
                          {t('systemEmployees.actions.accept')}
                        </Button>
                        <Button
                          danger
                          className="layout-sider-invitation-decline"
                          onClick={() => {
                            void dispatch(declineSystemAccessInvitation({ id: invitation.id }));
                          }}
                        >
                          {t('systemEmployees.actions.decline')}
                        </Button>
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
                        <Button
                          type="primary"
                          className="layout-sider-invitation-accept"
                          onClick={() => {
                            void dispatch(respondCompanyMembershipInvitation({
                              id: invitation.id,
                              decision: 'accept',
                            }));
                          }}
                        >
                          {t('companyMemberships.actions.accept')}
                        </Button>
                        <Button
                          danger
                          className="layout-sider-invitation-decline"
                          onClick={() => {
                            void dispatch(respondCompanyMembershipInvitation({
                              id: invitation.id,
                              decision: 'decline',
                            }));
                          }}
                        >
                          {t('companyMemberships.actions.decline')}
                        </Button>
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
                    inlineIndent={24}
                    className="layout-sider-menu layout-company-menu"
                  />
                </>
              )}
            </Sider>
          )}

          <Content className={`layout-content-container ${isMobile ? 'layout-content-container-mobile' : ''}`}>
            {mobileNav && (
              <div className="mobile-sider">
                <div className="mobile-sider-header">
                  {mobileNav.backPath ? (
                    <button
                      type="button"
                      className="mobile-sider-back"
                      onClick={() => navigate(mobileNav.backPath as string)}
                    >
                      <LeftOutlined />
                    </button>
                  ) : (
                    <span className="mobile-sider-back-placeholder is-hidden" />
                  )}

                  <div className="mobile-sider-header-copy">
                    <span className="mobile-sider-eyebrow">AMIS</span>
                    <h2>{mobileNav.title}</h2>
                    {mobileNav.subtitle ? <p>{mobileNav.subtitle}</p> : null}
                  </div>
                </div>

                <div className="mobile-sider-list">
                  {mobileNav.items.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      className={`mobile-sider-item ${item.isActive ? 'is-active' : ''}`}
                      onClick={item.onClick}
                    >
                      {item.status ? (
                        <div className="mobile-sider-item-row">
                          <span className="mobile-sider-item-label">{item.label}</span>
                          <span className={`status-badge ${item.status}`}>{item.meta}</span>
                        </div>
                      ) : (
                        <span className="mobile-sider-item-label">{item.label}</span>
                      )}
                      {!item.status && item.meta ? (
                        <span className="mobile-sider-item-meta">{item.meta}</span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {children}
          </Content>
        </Layout>
      </div>
    </Layout>
  );
};

export default MainLayout;
