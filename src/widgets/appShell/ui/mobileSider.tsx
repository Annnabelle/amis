import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import StatusBadge from "shared/ui/statusBadge";
import { getDeliveryRouteStatusBadgeVariant } from "shared/ui/statusBadge/variants";
import type { MobileNavConfig } from "widgets/appShell/lib/mobileNav";

type MobileSiderProps = {
  nav: MobileNavConfig;
};

/**
 * Мобильное меню: заголовок раздела, возврат и список переходов.
 *
 * Состав списка приходит готовым: он зависит от раздела, в котором стоит
 * пользователь, и собирается в оболочке.
 */
const MobileSider = ({ nav: mobileNav }: MobileSiderProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
      <div className="mobile-sider">
        <div className="mobile-sider-header">
          {mobileNav.backPath ? (
            <button
              type="button"
              className="mobile-sider-back"
              aria-label={t('common.backToList')}
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
                  <StatusBadge
                    variant={getDeliveryRouteStatusBadgeVariant(item.status)}
                    mode="compact"
                  >
                    {item.meta}
                  </StatusBadge>
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
  );
};

export default MobileSider;
