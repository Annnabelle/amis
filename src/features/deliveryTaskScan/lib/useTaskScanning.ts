import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  useCancelScanMutation,
  useCreateScanSessionMutation,
  useCompleteScanSessionMutation,
  useScanSessionCodeMutation,
} from "entities/scanSessions/api";
import { ScanSessionType } from "entities/scanSessions/types";
import type { DeliveryTask } from "entities/deliveryTasks/types";
import { createScanToast, formatCodeForToast } from "features/scanning/lib/scanToast";
import { getApiErrorMessage } from "shared/api";
import { notify } from "shared/lib/notify";

export type ScannerMode = "delivery" | "delete" | null;

const pushSingleScanToast = createScanToast("delivery-task-scan-result");

/**
 * Сканирование по задаче: сессия, приём кодов и удаление сканов.
 *
 * Режим сканера решает, что делает код: прибавляет выдачу или снимает её,
 * поэтому сессия и режим живут одним куском.
 */
export const useTaskScanning = ({
  task,
  scanSession,
  refreshTask,
}: {
  task?: DeliveryTask | null;
  scanSession?: { id?: string; status?: string } | null;
  refreshTask: () => Promise<void>;
}) => {
  const { t } = useTranslation();
  const [scannerMode, setScannerMode] = useState<ScannerMode>(null);
  const [isClosingSession, setIsClosingSession] = useState(false);

  const [createScanSession] = useCreateScanSessionMutation();
  const [completeScanSession] = useCompleteScanSessionMutation();
  const [scanSessionCode] = useScanSessionCodeMutation();
  const [cancelScan] = useCancelScanMutation();

const handleStartScanning = async () => {
  if (!task?.id) return;

  if (scanSession?.id && scanSession.status === 'active') {
    setScannerMode('delivery');
    return;
  }

  try {
    await createScanSession({
        type: ScanSessionType.Delivery,
        routeId: task.deliveryRouteId,
        taskId: task.id,
      }).unwrap();
    setScannerMode('delivery');
  } catch (error) {
    notify.error(
      getApiErrorMessage(
        error,
        t('deliveryTasks.messages.error.createScanSession', {
          defaultValue: 'Не удалось начать сессию сканирования',
        })
      )
    );
  }
};

const handleStartDeleteScanning = () => {
  setScannerMode('delete');
};

const handleScannerClose = async () => {
  if (scannerMode !== 'delivery' || !scanSession?.id) {
    setScannerMode(null);
    return;
  }

  if (scanSession.status !== 'active') {
    setScannerMode(null);
    return;
  }

  try {
    setIsClosingSession(true);
    await completeScanSession(scanSession.id).unwrap();
  } catch (error) {
    notify.error(
      getApiErrorMessage(
        error,
        t('deliveryTasks.messages.error.completeScanSession', {
          defaultValue: 'Не удалось завершить сессию сканирования',
        })
      )
    );
  } finally {
    setIsClosingSession(false);
    setScannerMode(null);
  }
};

const handleScan = async (code: string) => {
  if (!task?.id) {
    return {
      status: 'rejected' as const,
      reason: t('common.dataNotFound'),
    };
  }

  if (scannerMode === 'delete') {
    try {
      await cancelScan({
          code,
          routeId: task.deliveryRouteId,
          taskId: task.id,
        }).unwrap();

      await refreshTask();
      pushSingleScanToast(
        'success',
        t('deliveryTasks.messages.success.cancelScan', {
          defaultValue: 'Скан {{code}} удалён',
          code: formatCodeForToast(code),
        })
      );

      return { status: 'accepted' as const };
    } catch (error: unknown) {
      const reason = getApiErrorMessage(
        error,
        t('deliveryTasks.messages.error.cancelScan', {
          defaultValue: 'Не удалось удалить скан',
        })
      );

      pushSingleScanToast(
        'error',
        t('deliveryTasks.messages.error.scanCodeDetailed', {
          defaultValue: 'Код {{code}} отклонён: {{reason}}',
          code: formatCodeForToast(code),
          reason,
        })
      );

      return {
        status: 'rejected' as const,
        reason,
      };
    }
  }

  if (!scanSession?.id) {
    return {
      status: 'rejected' as const,
      reason: t('deliveryTasks.messages.error.scanSessionRequired', {
        defaultValue: 'Сначала запустите сессию сканирования',
      }),
    };
  }

  try {
    await scanSessionCode({
        sessionId: scanSession.id,
        code,
      }).unwrap();

    await refreshTask();
    pushSingleScanToast(
      'success',
      t('deliveryTasks.messages.success.scanCode', {
        defaultValue: 'Код {{code}} отсканирован',
        code: formatCodeForToast(code),
      })
    );

    return { status: 'accepted' as const };
  } catch (error: unknown) {
    const reason = getApiErrorMessage(
      error,
      t('deliveryTasks.messages.error.scanCode', {
        defaultValue: 'Ошибка сканирования',
      })
    );

    pushSingleScanToast(
      'error',
      t('deliveryTasks.messages.error.scanCodeDetailed', {
        defaultValue: 'Код {{code}} отклонён: {{reason}}',
        code: formatCodeForToast(code),
        reason,
      })
    );

    return {
      status: 'rejected' as const,
      reason,
    };
  }
};


  return {
    scannerMode,
    setScannerMode,
    isClosingSession,
    handleStartScanning,
    handleStartDeleteScanning,
    handleScannerClose,
    handleScan,
    completeSession: completeScanSession,
    cancelScan,
  };
};
