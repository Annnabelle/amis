import React, { useState, type ReactNode } from 'react';
import type { MenuProps } from 'antd';
import { Button, Layout, Menu } from 'antd';
import { AppstoreOutlined} from '@ant-design/icons';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoClose } from 'react-icons/io5';
import { Link, useLocation } from 'react-router-dom';
import UserInfo from '../widgets/userInfo';
import Session from '../widgets/session';
import Balance from '../widgets/balance';
import Languages from '../languages';
import './styles.sass';
import { useTranslation } from 'react-i18next';

const { Header, Content, Sider } = Layout;


interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems: MenuProps['items'] = [
    {
      key: 'management',
      icon: <AppstoreOutlined className='menu-icon' />,
      label: t('navigation.management'),
      children: [
        {
          key: '/organization',
          label: <Link to="/organization">{t("categories.organization")}</Link>,
        },
        // {
        //   key: '/products',
        //   label: <Link to="/products">{t('navigation.products')}</Link>,
        // },
        {
          key: '/users',
          label: <Link to="/users">{t('navigation.users')}</Link>,
        },
        {
          key: '/marking-codes',
          label: <Link to="/marking-codes">{t('navigation.markingCodes')}</Link>,
        },
        {
          key: '/audit-logs',
          label: <Link to="/audit-logs">{t('navigation.audit')}</Link>,
        },
      ],
    },
  ];

  return (
    <Layout className='layout'>
      <Header className='layout-header'>
        <div className="layout-header-container">
          <div className="layout-header-container-items">
            <div className="layout-header-container-items-item">
              <h1 className="logo">logo</h1>
            </div>
          </div>
          <div className="layout-header-container-items">
            <div className="layout-header-container-items-item">
              <Languages  />
            </div>
            {/* <div className="layout-header-container-items-item">
              <Balance />
            </div> */}
            <div className="layout-header-container-items-item">
              <Session />
            </div>
            <div className="layout-header-container-items-item">
              <UserInfo />
            </div>
          </div>
        </div>
      </Header>
      <div className='layout-content-wrapper'>
        <Layout className='layout-content'>
          <Sider collapsible collapsed={collapsed} trigger={null} className={`layout-sider ${collapsed ? '' : 'sider-opened'}`}>
            <div className={`layout-sider-trigger ${collapsed ? 'triggered' : ''}`}>
              <div className="layout-sider-trigger-container">
                <Button
                  type="text"
                  icon={collapsed ? <GiHamburgerMenu/> : <IoClose />}
                  onClick={() => setCollapsed(!collapsed)}
                  className='layout-sider-trigger-container-button'
                />
              </div>
            </div>
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]} 
              defaultOpenKeys={['management']}
              style={{ height: '100%' }}
              items={menuItems}
              className='layout-sider-menu'
            />
          </Sider>
          <Content className='layout-content-container'>{children}</Content>
        </Layout>
      </div>
    </Layout>
  );
};

export default MainLayout;
