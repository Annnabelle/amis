import type { ReactNode } from 'react';
import { Layout } from 'antd';

const { Header, Content, Sider } = Layout;

type PageLayoutProps = {
  /** Шапка десктопа: логотип, тема, язык, профиль. */
  header?: ReactNode;
  /** Шапка мобильного экрана — у неё своя разметка. */
  mobileHeader?: ReactNode;
  /** Содержимое бокового меню; без него сайдера нет вовсе. */
  sider?: ReactNode;
  siderCollapsed?: boolean;
  isMobile?: boolean;
  children: ReactNode;
};

/**
 * Сетка приложения: шапка, сайдер и область контента.
 *
 * Презентационная: ни стора, ни прав, ни маршрутов — всё это приносит
 * оболочка в props.
 */
const PageLayout = ({
  header,
  mobileHeader,
  sider,
  siderCollapsed = false,
  isMobile = false,
  children,
}: PageLayoutProps) => (
  <Layout className="layout">
    {!isMobile && header && <Header className="layout-header">{header}</Header>}

    {isMobile && mobileHeader}

    <div className="layout-content-wrapper">
      <Layout className="layout-content">
        {!isMobile && sider && (
          <Sider
            collapsible
            collapsed={siderCollapsed}
            trigger={null}
            width={260}
            collapsedWidth={80}
            className={`layout-sider ${siderCollapsed ? 'is-collapsed' : 'is-opened'}`}
            style={{
              width: 'auto',
              minWidth: siderCollapsed ? 80 : 220,
              maxWidth: siderCollapsed ? 80 : 420,
              transition: 'min-width 0.3s ease, max-width 0.3s ease',
            }}
          >
            {sider}
          </Sider>
        )}

        <Content
          className={`layout-content-container ${
            isMobile ? 'layout-content-container-mobile' : ''
          }`}
        >
          {children}
        </Content>
      </Layout>
    </div>
  </Layout>
);

export default PageLayout;
