import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import UserInfo from '../widgets/userInfo';
import './styles.sass';
import Session from '../widgets/session';
import Balance from '../widgets/balance';

const { Header, Content, Sider } = Layout;

const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1);

    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `subnav ${key}`,
      children: Array.from({ length: 4 }).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `option${subKey}`,
        };
      }),
    };
  },
);

const MainLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
      <div style={{ padding: '24px 48px' }}>
        <Layout
          style={{ padding: '24px 0', background: colorBgContainer, borderRadius: borderRadiusLG }}
        >
          <Sider style={{ background: colorBgContainer }} width={200}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%' }}
              items={items2}
            />
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>Content</Content>
        </Layout>
      </div>
    </Layout>
  );
};

export default MainLayout;