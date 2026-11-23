import type { ReactNode } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import CustomButton from "shared/ui/button";
import Heading from "shared/ui/mainHeading";
import { useIsMobile } from "shared/lib/useIsMobile";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  isTest?: boolean;
  /** Возврат к списку: на мобильном — стрелка, на десктопе — кнопка с текстом. */
  onBack?: () => void;
  backLabel?: string;
  actions?: ReactNode;
  /** Действия в мобильной панели, когда они у́же десктопных. */
  mobileActions?: ReactNode;
}

/**
 * Заголовок страницы: панель со стрелкой на мобильном, Heading на десктопе.
 *
 * Раскладки различаются разметкой, поэтому выбор между ними держит один
 * компонент, а страницы просто передают заголовок и действия.
 */
const PageHeader = ({
  title,
  subtitle,
  isTest,
  onBack,
  backLabel,
  actions,
  mobileActions,
}: PageHeaderProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  if (isMobile) {
    const toolbarActions = mobileActions === undefined ? actions : mobileActions;

    return (
      <div className="mobile-route-toolbar">
        {onBack && (
          <div className="mobile-route-toolbar-back">
            <CustomButton
              variant="outline"
              onClick={onBack}
              aria-label={backLabel ?? t("common.backToList")}
            >
              <LeftOutlined />
            </CustomButton>
          </div>
        )}
        {toolbarActions && (
          <div className="mobile-route-toolbar-actions">{toolbarActions}</div>
        )}
      </div>
    );
  }

  const backButton = onBack && backLabel && (
    <CustomButton variant="outline" onClick={onBack}>
      {backLabel}
    </CustomButton>
  );

  return (
    <Heading title={title} subtitle={subtitle} isTest={isTest}>
      {(backButton || actions) && (
        <div className="btns-group">
          {backButton}
          {actions}
        </div>
      )}
    </Heading>
  );
};

export default PageHeader;
