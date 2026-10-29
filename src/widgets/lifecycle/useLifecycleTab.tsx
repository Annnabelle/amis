import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import {
  useLifecycleSummary,
  type LifecycleTargetType,
} from "entities/lifecycle/lib";
import LifecycleActiveErrorAlert from "entities/lifecycle/ui/activeErrorAlert";
import CustomButton from "shared/ui/button";
import type { EntityTabItem } from "shared/ui/entityTabs";
import LifecyclePanel from "./index";

export const LIFECYCLE_TAB_KEY = "lifecycle";

type UseLifecycleTabOptions = {
  targetId?: string;
  target: LifecycleTargetType;
  /** Должен совпадать с paramName у EntityTabs на этой карточке. */
  paramName?: string;
};

type UseLifecycleTabResult = {
  /** Баннер незакрытой серии ошибок — рендерится над вкладками, виден всегда. */
  banner: React.ReactNode;
  /** Пусто, когда прав нет: вкладку тогда не показываем вовсе. */
  items: EntityTabItem[];
};

/**
 * Подключение таймлайна к карточке сущности:
 * const { banner, items } = useLifecycleTab({ targetId, target });
 * ...
 * {banner}
 * <EntityTabs items={[overviewTab, ...items]} />
 */
export const useLifecycleTab = ({
  targetId,
  target,
  paramName = "tab",
}: UseLifecycleTabOptions): UseLifecycleTabResult => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { canRead, summary } = useLifecycleSummary(targetId, target);

  const openLifecycleTab = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set(paramName, LIFECYCLE_TAB_KEY);
    setSearchParams(nextParams, { replace: true });
  };

  const banner =
    canRead && summary?.activeError ? (
      <LifecycleActiveErrorAlert
        error={summary.activeError}
        action={
          <CustomButton
            variant="text"
            size="sm"
            fullWidth={false}
            onClick={openLifecycleTab}
          >
            {t("lifecycle.activeError.open")}
          </CustomButton>
        }
      />
    ) : null;

  if (!targetId || !canRead) {
    return { banner, items: [] };
  }

  return {
    banner,
    items: [
      {
        key: LIFECYCLE_TAB_KEY,
        label: (
          <>
            {t("lifecycle.tabs.lifecycle")}
            {summary?.activeError && <span className="entity-tabs-dot" />}
          </>
        ),
        children: (
          <div className="box">
            <div className="box-container">
              <div className="box-container-items">
                <LifecyclePanel targetId={targetId} target={target} />
              </div>
            </div>
          </div>
        ),
      },
    ],
  };
};
