import React, { useState, type ReactNode } from 'react';
import type { MenuProps } from 'antd';
import { Button, Layout, Menu } from 'antd';
import { AppstoreOutlined} from '@ant-design/icons';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoClose } from 'react-icons/io5';
import UserInfo from '../widgets/userInfo';
import Session from '../widgets/session';
import Balance from '../widgets/balance';
import { Link } from 'react-router-dom';
import './styles.sass';

const { Header, Content, Sider } = Layout;

const menuItems: MenuProps['items'] = [
  {
    key: 'management',
    icon: <AppstoreOutlined className='menu-icon' />,
    label: 'Управление',
    children: [
      {
        key: 'organization',
        label: 'Организация',
      },
      {
        key: 'products',
        label: 'Продукция',
      },
      {
        key: 'users',
        label: <Link to="/users">Пользователи</Link>,
      },
    ],
  },
];

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
   const [collapsed, setCollapsed] = useState(false);
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
              <Balance />
            </div>
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
          <Sider collapsible collapsed={collapsed} trigger={null} className='layout-sider'>
            <div className='layout-sider-trigger'>
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
              defaultSelectedKeys={['organization']}
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
