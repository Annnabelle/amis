import React, {
  useState,
  type ReactNode,
  useEffect,
  useMemo,
} from 'react';
import { type MenuProps } from 'antd';
import { Button, Layout, Menu, Switch } from 'antd';
import {
  ApartmentOutlined,
  UserOutlined,
  FileTextOutlined,
  LeftOutlined,
  AppstoreOutlined,
  CodeOutlined,
  ClusterOutlined,
  BuildOutlined,
  ShoppingCartOutlined,
  CarOutlined,
  FileDoneOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoClose } from 'react-icons/io5';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserInfo from 'widgets/userInfo';
import Session from 'widgets/session';
import Languages from '../languages';
import './styles.sass';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'app/store';
import { getAllOrganizations } from 'entities/organization/model';
import { getDeliveryRoutes } from 'entities/deliveryRoutes/model';
import { useTheme } from 'app/themeContext';
import { useIsMobile } from 'shared/lib';

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

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { isDarkTheme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const getOrgOpenKeys = (pathname: string) => {
    const parts = pathname.split('/');
    if (parts[1] !== 'organization' || !parts[2]) {
      return [];
    }

    const currentOrgId = parts[2];
    return ['my-organizations-group', `my-org-${currentOrgId}`];
  };

  const [openKeys, setOpenKeys] = useState<string[]>(() => getOrgOpenKeys(window.location.pathname));
  const organizations = useAppSelector((state) => state.organizations.organizations);
  const routes = useAppSelector((state) => state.deliveryRoutes.routes);

  const isSuperAdmin = true;
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const orgId = pathSegments[0] === 'organization' ? pathSegments[1] : undefined;
  const section = pathSegments[2];
  const routeId = section === 'delivery-routes' ? pathSegments[3] : undefined;
  const isOrganizationRoot = location.pathname === '/organization';
  const isOrganizationScreen = pathSegments[0] === 'organization' && Boolean(orgId) && !section;
  const isRoutesScreen = pathSegments[0] === 'organization' && Boolean(orgId) && section === 'delivery-routes' && !routeId;
  const selectedOrganization = organizations.find((org) => String(org.id) === orgId);

  useEffect(() => {
    if (collapsed) return;

    const parts = location.pathname.split('/');
    if (parts[1] !== 'organization' || !parts[2]) {
      return;
    }

    const currentOrgId = parts[2];
    const requiredKeys = ['my-organizations-group', `my-org-${currentOrgId}`];

    setOpenKeys((prev) => {
      const hasAll = requiredKeys.every((key) => prev.includes(key));
      if (hasAll) {
        return prev;
      }

      const newSet = new Set(prev);
      requiredKeys.forEach((key) => newSet.add(key));
      return Array.from(newSet);
    });
  }, [location.pathname, collapsed]);

  useEffect(() => {
    dispatch(
      getAllOrganizations({
        page: 1,
        limit: 10,
        sortOrder: 'asc',
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (!isMobile || !orgId || section !== 'delivery-routes') {
      return;
    }

    dispatch(
      getDeliveryRoutes({
        companyId: orgId,
      })
    );
  }, [dispatch, isMobile, orgId, section]);

  const getOrgSubMenuItems = (currentOrgId: string): MenuProps['items'] => [
    {
      key: 'products',
      icon: <AppstoreOutlined />,
      className: 'org-submenu-item',
      label: (
        <Link to={`/organization/${currentOrgId}/products`}>
          {t('navigation.products')}
        </Link>
      ),
    },
    {
      key: 'orders',
      icon: <CodeOutlined />,
      className: 'org-submenu-item',
      label: (
        <Link to={`/organization/${currentOrgId}/orders`}>
          {t('navigation.markingCodes')}
        </Link>
      ),
    },
    {
      key: 'agregations',
      icon: <ClusterOutlined />,
      className: 'org-submenu-item',
      label: (
        <Link to={`/organization/${currentOrgId}/agregations`}>
          {t('navigation.agregations')}
        </Link>
      ),
    },
    {
      key: 'sales-orders',
      icon: <ShoppingCartOutlined />,
      className: 'org-submenu-item',
      label: (
        <Link to={`/organization/${currentOrgId}/sales-orders`}>
          {t('navigation.deals')}
        </Link>
      ),
    },
    {
      key: 'delivery-routes',
      icon: <CarOutlined />,
      className: 'org-submenu-item',
      label: (
        <Link to={`/organization/${currentOrgId}/delivery-routes`}>
          {t('navigation.routes')}
        </Link>
      ),
    },
    {
      key: 'invoices',
      icon: <FileDoneOutlined />,
      className: 'org-submenu-item',
      label: (
        <Link to={`/organization/${currentOrgId}/invoices`}>
          {t('navigation.invoices')}
        </Link>
      ),
    },
  ];

  const myOrganizations = useMemo(
    () =>
      organizations?.map((org) => ({
        id: String(org.id),
        name: org.displayName,
        isTest: !!org.isTest,
      })) || [],
    [organizations]
  );

  const prefixMenuKeys = (items: MenuProps['items'], prefix: string): MenuProps['items'] =>
    items?.map((item) => {
      if (!item) {
        return item;
      }

      const baseKey = String(item.key);
      const nextKey = `${prefix}-${baseKey}`;
      const hasChildren = 'children' in item && Boolean((item as any).children);
      const children = hasChildren
        ? prefixMenuKeys((item as any).children as MenuProps['items'], nextKey)
        : undefined;

      return {
        ...item,
        key: nextKey,
        ...(hasChildren ? { children } : {}),
      };
    });

  const myOrganizationsItems: MenuProps['items'] = myOrganizations.map((org) => ({
    key: `my-org-${org.id}`,
    icon: (
      <span className="org-icon-wrapper">
        <BuildOutlined />
        {org.isTest && (
          <span className="org-test-badge">
            {t('organizations.testFlag')}
          </span>
        )}
      </span>
    ),
    label: <span className="org-name">{org.name}</span>,
    className: org.isTest ? 'test-org-menu-item' : undefined,
    title: org.isTest ? `${org.name} ${t('organizations.testFlag')}` : org.name,
    children: prefixMenuKeys(getOrgSubMenuItems(org.id), org.id),
  }));

  const menuItems: MenuProps['items'] = [];

  if (isSuperAdmin) {
    menuItems.push({
      key: '/organization',
      icon: <ApartmentOutlined />,
      label: (
        <Link to="/organization">
          {t('navigation.organizations') || 'Организации'}
        </Link>
      ),
    });
  }

  menuItems.push({
    key: '/users',
    icon: <UserOutlined />,
    label: (
      <Link to="/users">
        {t('navigation.users') || 'Пользователи'}
      </Link>
    ),
  });

  menuItems.push({
    key: '/audit-logs',
    icon: <FileTextOutlined />,
    label: (
      <Link to="/audit-logs">
        {t('navigation.audit') || 'Логи системы'}
      </Link>
    ),
  });

  if (myOrganizations.length > 0) {
    menuItems.push({
      key: 'my-organizations-group',
      icon: <ApartmentOutlined />,
      className: 'no-left-margin',
      label: t('navigation.myOrganizations') || 'Мои организации',
      children: myOrganizationsItems,
    });
  }

  const selectedKeys = useMemo(() => {
    const parts = location.pathname.split('/');
    const currentOrgId = parts[2];
    const currentSection = parts[3];

    if (
      currentOrgId &&
      ['products', 'orders', 'agregations', 'sales-orders', 'delivery-routes', 'delivery-tasks', 'invoices'].includes(currentSection)
    ) {
      return [`${currentOrgId}-${currentSection}`];
    }

    const topLevel = `/${parts[1]}`;
    return menuItems.some((item) => item?.key === topLevel) ? [topLevel] : [];
  }, [location.pathname, menuItems]);

  const mobileNav = useMemo<MobileNavConfig | null>(() => {
    if (!isMobile) {
      return null;
    }

    if (isOrganizationRoot) {
      return {
        title: t('navigation.myOrganizations'),
        subtitle: '',
        backPath: null as string | null,
        items: organizations.map((org) => ({
          key: org.id,
          label: org.displayName,
          meta: '',
          isActive: false,
          onClick: () => navigate(`/organization/${org.id}`),
        })),
      };
    }

    if (isOrganizationScreen && orgId) {
      return {
        title: selectedOrganization?.displayName ?? t('navigation.myOrganizations'),
        subtitle: t('navigation.myOrganizations'),
        backPath: '/organization',
        items: [
          {
            key: `${orgId}-delivery-routes`,
            label: t('navigation.routes'),
            meta: t('deliveryRoutes.title'),
            isActive: location.pathname === `/organization/${orgId}/delivery-routes`,
            onClick: () => navigate(`/organization/${orgId}/delivery-routes`),
          },
        ],
      };
    }

    if (isRoutesScreen && orgId) {
      return {
        title: t('navigation.routes'),
        subtitle: selectedOrganization?.displayName ?? '',
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
    isOrganizationRoot,
    isOrganizationScreen,
    isRoutesScreen,
    location.pathname,
    navigate,
    orgId,
    organizations,
    routes,
    selectedOrganization?.displayName,
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

              <Menu
                key={`menu-${collapsed ? 'collapsed' : 'open'}`}
                mode="inline"
                inlineCollapsed={collapsed}
                selectedKeys={selectedKeys}
                openKeys={collapsed ? [] : openKeys}
                onOpenChange={setOpenKeys}
                items={menuItems}
                inlineIndent={24}
                className="layout-sider-menu"
              />
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
