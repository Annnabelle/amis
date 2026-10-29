import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "app/store";
import { useCan } from "entities/access/lib";
import {
  getCurrentCompanyImport,
  startCompanyImport,
} from "entities/companyImport/model";
import {
  COMPANY_IMPORT_POLL_INTERVAL_MS,
  type CompanyImport,
  type CompanyImportStage,
  type CompanyImportStageState,
} from "entities/companyImport/types";
import { endpointAccessMap } from "shared/config/endpointAccessMap";
import { findCompanyImportStage, isCompanyImportActive } from "./stages";

export type UseCompanyImportResult = {
  canRead: boolean;
  canStart: boolean;
  companyImport: CompanyImport | null;
  /** Сервер ответил: до этого «прогона нет» показывать рано. */
  loaded: boolean;
  isLoading: boolean;
  isActive: boolean;
  error: string | null;
  startingStages: CompanyImportStage[] | null;
  start: (stages?: CompanyImportStage[]) => Promise<void>;
};

/**
 * Текущий прогон импорта компании: один запрос на открытие раздела и опрос,
 * пока прогон идёт. Потребителей несколько — кнопки разделов и панель на
 * странице интеграций, — поэтому состояние живёт в сторе, а не в компоненте.
 */
export const useCompanyImport = (
  companyId?: string
): UseCompanyImportResult => {
  const dispatch = useAppDispatch();
  const canRead = useCan(endpointAccessMap.companyImportCurrent);
  const canStart = useCan(endpointAccessMap.companyImportStart);
  const loadedCompanyId = useAppSelector((state) => state.companyImport.companyId);
  const current = useAppSelector((state) => state.companyImport.current);
  const loaded = useAppSelector((state) => state.companyImport.loaded);
  const isLoading = useAppSelector((state) => state.companyImport.loading);
  const error = useAppSelector((state) => state.companyImport.error);
  const startingStages = useAppSelector(
    (state) => state.companyImport.startingStages
  );

  const isCurrentCompany = loadedCompanyId === companyId;
  const companyImport = isCurrentCompany ? current : null;
  const isActive = isCompanyImportActive(companyImport);

  useEffect(() => {
    if (!companyId || !canRead) return;
    if (isCurrentCompany && (loaded || isLoading || error)) return;

    void dispatch(getCurrentCompanyImport({ companyId }));
  }, [canRead, companyId, dispatch, error, isCurrentCompany, isLoading, loaded]);

  useEffect(() => {
    if (!companyId || !canRead || !isActive) return;

    const intervalId = window.setInterval(() => {
      /** В свёрнутой вкладке опрашивать некого: смотреть на ответ никто не будет. */
      if (document.hidden) return;

      void dispatch(getCurrentCompanyImport({ companyId }));
    }, COMPANY_IMPORT_POLL_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [canRead, companyId, dispatch, isActive]);

  const start = useCallback(
    async (stages?: CompanyImportStage[]) => {
      if (!companyId) return;

      await dispatch(startCompanyImport({ companyId, stages })).unwrap();
    },
    [companyId, dispatch]
  );

  return {
    canRead,
    canStart,
    companyImport,
    loaded: isCurrentCompany && loaded,
    isLoading,
    isActive,
    error,
    startingStages,
    start,
  };
};

export type UseCompanyImportStageResult = {
  canStart: boolean;
  /** Состояние этапа в текущем прогоне; null — прогона нет или этап не брали. */
  stageState: CompanyImportStageState | null;
  /** Прогон идёт — второй запустить нельзя, независимо от выбора этапов. */
  isBusy: boolean;
  isStarting: boolean;
  start: () => Promise<void>;
};

/**
 * Запуск одного этапа из его раздела: «Синхронизировать товары» на странице
 * товаров, «Синхронизировать заказы» на странице заказов.
 */
export const useCompanyImportStage = (
  companyId: string | undefined,
  stage: CompanyImportStage
): UseCompanyImportStageResult => {
  const { canStart, companyImport, isActive, startingStages, start } =
    useCompanyImport(companyId);

  return {
    canStart,
    stageState: findCompanyImportStage(companyImport, stage),
    isBusy: isActive,
    isStarting: !!startingStages?.includes(stage),
    start: useCallback(() => start([stage]), [stage, start]),
  };
};
