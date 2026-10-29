import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "app/store";
import { getLifecycleSummary } from "entities/lifecycle/model";
import { getLifecycleTargetConfig, type LifecycleTargetType } from "./targets";
import { useCanReadLifecycle } from "./useCanReadLifecycle";

/**
 * Сводка запрашивается один раз на открытие карточки: её используют и шапка
 * (баннер активной ошибки), и вкладка с лентой. Повторный вызов из второго
 * потребителя отсекается по состоянию в сторе.
 */
export const useLifecycleSummary = (
  targetId: string | undefined,
  target: LifecycleTargetType
) => {
  const dispatch = useAppDispatch();
  const canRead = useCanReadLifecycle(target);
  const loadedTargetId = useAppSelector((state) => state.lifecycle.targetId);
  const summary = useAppSelector((state) => state.lifecycle.summary);
  const isLoading = useAppSelector((state) => state.lifecycle.summaryLoading);
  const error = useAppSelector((state) => state.lifecycle.summaryError);

  useEffect(() => {
    if (!targetId || !canRead) return;

    const isCurrentTarget = loadedTargetId === targetId;
    if (isCurrentTarget && (summary || isLoading || error)) return;

    void dispatch(
      getLifecycleSummary({
        targetId,
        companyScope: getLifecycleTargetConfig(target).companyScope,
      })
    );
  }, [canRead, dispatch, error, isLoading, loadedTargetId, summary, target, targetId]);

  return {
    canRead,
    summary: loadedTargetId === targetId ? summary : null,
    isLoading,
    error,
  };
};
