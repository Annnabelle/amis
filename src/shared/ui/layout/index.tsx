import React, {
  useState,
  type ReactNode,
  useEffect,
  useMemo,
} from 'react';
import { type MenuProps} from 'antd';
import { Button, Layout, Menu, Switch } from 'antd';
import {
  ApartmentOutlined,
  UserOutlined,
  FileTextOutlined,
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
import { Link, useLocation } from 'react-router-dom';
import UserInfo from 'widgets/userInfo';
import Session from 'widgets/session';
import Languages from '../languages';
import './styles.sass';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'app/store';
import { getAllOrganizations } from 'entities/organization/model';
import { useTheme } from 'app/themeContext';

const { Header, Content, Sider } = Layout;

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { isDarkTheme, toggleTheme } = useTheme();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
    const getOrgOpenKeys = (pathname: string) => {
        const parts = pathname.split('/');
        if (parts[1] !== 'organization' || !parts[2]) {
            return [];
        }
        const orgId = parts[2];
        const baseKeys = ['my-organizations-group', `my-org-${orgId}`];
        return baseKeys;
    };

    const [openKeys, setOpenKeys] = useState<string[]>(() => getOrgOpenKeys(window.location.pathname));
  const organizations = useAppSelector((state) => state.organizations.organizations);

    const isSuperAdmin = true;

    useEffect(() => {
        if (collapsed) return;

        const parts = location.pathname.split('/');
        if (parts[1] !== 'organization' || !parts[2]) {
            return;
        }

         const orgId = parts[2];
         const requiredKeys = ['my-organizations-group', `my-org-${orgId}`];

         setOpenKeys((prev) => {
             const hasAll = requiredKeys.every(key => prev.includes(key));
             if (hasAll) {
                return prev;
            }
            const newSet = new Set(prev);
            requiredKeys.forEach(key => newSet.add(key));
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

    const getOrgSubMenuItems = (orgId: string): MenuProps['items'] => [
        {
            key: 'products',
            icon: <AppstoreOutlined />,
            className: 'org-submenu-item',
            label: (
                <Link to={`/organization/${orgId}/products`}>
                    {t("navigation.products")}
                </Link>
            ),
        },
        {
            key: 'orders',
            icon: <CodeOutlined />,
            className: 'org-submenu-item',
            label: (
                <Link to={`/organization/${orgId}/orders`}>
                    {t("navigation.markingCodes")}
                </Link>
            ),
        },
         {
             key: 'agregations',
             icon: <ClusterOutlined />,
             className: 'org-submenu-item',
             label: (
                 <Link to={`/organization/${orgId}/agregations`}>
                     {t("navigation.agregations")}
                 </Link>
             ),
         },
         {
             key: 'sales-orders',
             icon: <ShoppingCartOutlined />,
             className: 'org-submenu-item',
             label: (
                 <Link to={`/organization/${orgId}/sales-orders`}>
                     {t('navigation.deals')}
                 </Link>
             ),
         },
         {
             key: 'delivery-routes',
             icon: <CarOutlined />,
             className: 'org-submenu-item',
             label: (
                 <Link to={`/organization/${orgId}/delivery-routes`}>
                     {t('navigation.routes')}
                 </Link>
             ),
         },
        //  {
        //      key: 'delivery-tasks',
        //      icon: <DeploymentUnitOutlined />,
        //      className: 'org-submenu-item',
        //      label: (
        //          <Link to={`/organization/${orgId}/delivery-tasks`}>
        //              {t('navigation.deliveryTasks')}
        //          </Link>
        //      ),
        //  },
         {
             key: 'invoices',
             icon: <FileDoneOutlined />,
             className: 'org-submenu-item',
             label: (
                 <Link to={`/organization/${orgId}/invoices`}>
                     {t('navigation.invoices')}
                 </Link>
             ),
         },
     ];

    const myOrganizations = useMemo(
        () => {
            const mapped = organizations?.map((org) => {
                return {
                    id: String(org.id),
                    name: org.displayName,
                    isTest: !!org.isTest,   // преобразуем в boolean
                };
            }) || [];
            return mapped;
        },
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
                    {t("organizations.testFlag")}
                  </span>
                            )}
              </span>
        ),
        label: (
            <span className="org-name">
                {org.name}
            </span>
        ),
        className: org.isTest ? 'test-org-menu-item' : undefined,
        title: org.isTest ? `${org.name} ${t("organizations.testFlag")}` : org.name,
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
      label:
          t('navigation.myOrganizations') ||
          'Мои организации',
      children: myOrganizationsItems,
    });
  }

    const selectedKeys = useMemo(() => {
        const parts = location.pathname.split('/');

        // Страницы организаций
         const orgId = parts[2];
         const section = parts[3];
         if (
             orgId &&
             ['products', 'orders', 'agregations', 'sales-orders', 'delivery-routes', 'delivery-tasks', 'invoices'].includes(section)
         ) {
             return [`${orgId}-${section}`];
         }

        // Верхний уровень меню
        const topLevel = `/${parts[1]}`;
        return menuItems.some(item => item?.key === topLevel) ? [topLevel] : [];
    }, [location.pathname, menuItems]);


    return (
      <Layout className="layout">
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

        <div className="layout-content-wrapper">
          <Layout className="layout-content">
            <Sider
                collapsible
                collapsed={collapsed}
                trigger={null}
                width={260}            // обычная ширина
                collapsedWidth={80}
                className={`layout-sider ${
                    collapsed ? 'is-collapsed' : 'is-opened'
                }`}
                style={{
                  width: 'auto',
                  minWidth: collapsed ? 80 : 220,
                  maxWidth: collapsed ? 80 : 420,
                  transition:
                      'min-width 0.3s ease, max-width 0.3s ease',
                }}
            >
              <div
                  className={`layout-sider-trigger ${
                      collapsed ? 'triggered' : ''
                  }`}
              >
                <Button
                    type="text"
                    icon={
                      collapsed ? (
                          <GiHamburgerMenu />
                      ) : (
                          <IoClose />
                      )
                    }
                    onClick={() =>
                        setCollapsed(!collapsed)
                    }
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

            <Content className="layout-content-container">
              {children}
            </Content>
          </Layout>
        </div>
      </Layout>
  );
};

export default MainLayout;





