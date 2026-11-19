import { useGetLifecycleSummaryQuery } from "entities/lifecycle/api";
import { getApiErrorMessage } from "shared/api";
import { getLifecycleTargetConfig, type LifecycleTargetEntity } from "./targets";
import { useCanReadLifecycle } from "./useCanReadLifecycle";

/**
 * Сводка запрашивается один раз на открытие карточки: её используют и шапка
 * (баннер активной ошибки), и вкладка с лентой — RTK Query сводит их к одной
 * подписке.
 */
export const useLifecycleSummary = (
  targetId: string | undefined,
  target: LifecycleTargetEntity
) => {
  const canRead = useCanReadLifecycle(target);
  const {
    data: summary,
    isFetching,
    error: requestError,
  } = useGetLifecycleSummaryQuery(
    {
      targetId: targetId ?? "",
      companyScope: getLifecycleTargetConfig(target).companyScope,
    },
    { skip: !targetId || !canRead }
  );

  return {
    canRead,
    summary: summary ?? null,
    isLoading: isFetching,
    error: requestError
      ? getApiErrorMessage(requestError, "lifecycle.errors.loadSummary")
      : null,
  };
};
