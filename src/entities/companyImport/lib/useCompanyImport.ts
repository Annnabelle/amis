import { useCallback } from "react";
import { useCan } from "entities/access/lib";
import {
  COMPANY_IMPORT_START_CACHE_KEY,
  companyImportApi,
  useGetCurrentCompanyImportQuery,
  useStartCompanyImportMutation,
} from "entities/companyImport/api";
import {
  COMPANY_IMPORT_POLL_INTERVAL_MS,
  CompanyImportErrorCode,
  type CompanyImport,
  type CompanyImportStage,
  type CompanyImportStageState,
} from "entities/companyImport/types";
import { getApiErrorMessage } from "shared/api";
import { endpointAccessMap } from "shared/config/endpointAccessMap";
import { readBackendErrorCode } from "./backendErrorCode";
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
 * странице интеграций, — и RTK Query сводит их к одной подписке: лишних
 * запросов нет, а состояние запуска общее через fixedCacheKey.
 */
export const useCompanyImport = (
  companyId?: string
): UseCompanyImportResult => {
  const canRead = useCan(endpointAccessMap.companyImportCurrent);
  const canStart = useCan(endpointAccessMap.companyImportStart);
  /** Читаем кеш без подписки: по нему решаем, нужен ли опрос. */
  const cached =
    companyImportApi.endpoints.getCurrentCompanyImport.useQueryState();
  const isPollingNeeded = isCompanyImportActive(cached.data ?? null);

  const {
    data: companyImport,
    isFetching,
    isSuccess,
    error: requestError,
    refetch,
  } = useGetCurrentCompanyImportQuery(undefined, {
    skip: !companyId || !canRead,
    /** Опрашиваем, только пока прогон идёт: завершённый сам не изменится. */
    pollingInterval: isPollingNeeded ? COMPANY_IMPORT_POLL_INTERVAL_MS : 0,
    // В свёрнутой вкладке опрашивать некого: смотреть на ответ никто не будет.
    skipPollingIfUnfocused: true,
  });
  const [startCompanyImport, startState] = useStartCompanyImportMutation({
    fixedCacheKey: COMPANY_IMPORT_START_CACHE_KEY,
  });

  /** Прогонов не было — это не сбой, а пустое состояние раздела. */
  const isNotFound =
    readBackendErrorCode(requestError) === CompanyImportErrorCode.NotFound;

  const start = useCallback(
    async (stages?: CompanyImportStage[]) => {
      if (!companyId) return;

      try {
        await startCompanyImport({ stages }).unwrap();
      } catch (error) {
        /**
         * Запуск второго прогона запрещён уникальностью: нажавшему интереснее
         * увидеть тот, что уже идёт, чем сообщение об отказе.
         */
        if (
          readBackendErrorCode(error) === CompanyImportErrorCode.AlreadyRunning
        ) {
          await refetch();
          return;
        }

        throw error;
      }
    },
    [companyId, refetch, startCompanyImport]
  );

  return {
    canRead,
    canStart,
    companyImport: companyImport ?? null,
    loaded: isSuccess || isNotFound,
    isLoading: isFetching,
    isActive: isCompanyImportActive(companyImport ?? null),
    error:
      requestError && !isNotFound
        ? getApiErrorMessage(requestError, "companyImport.errors.load")
        : null,
    startingStages: startState.isLoading
      ? startState.originalArgs?.stages ?? null
      : null,
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
