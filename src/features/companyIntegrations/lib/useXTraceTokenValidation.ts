import { useRef, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

import { useLazyValidateCompanyXTraceIntegrationTokenQuery } from "entities/xTrace/api";
import type { XTraceIntegrationTokenValidation } from "entities/xTrace/types";
import { getApiErrorMessage } from "shared/api";
import { notify } from "shared/lib/notify";

/** Токен вставляют и правят подряд: проверка ждёт паузу в наборе. */
const VALIDATION_DELAY = 450;

/**
 * Проверка токена X-Trace по мере ввода.
 *
 * Ответ вендора показывает, какой компании принадлежит токен, поэтому
 * сохранение интеграции открыто только после удачной проверки.
 */
export const useXTraceTokenValidation = ({
  companyId,
  enabled = true,
}: {
  companyId?: string;
  enabled?: boolean;
}) => {
  const { t } = useTranslation();
  const [validation, setValidation] = useState<XTraceIntegrationTokenValidation | null>(null);
  const requestRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  const [validateToken, { isFetching: isValidating }] =
    useLazyValidateCompanyXTraceIntegrationTokenQuery();

  const reset = () => {
    setValidation(null);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
    const token = event.target.value.trim();
    const requestId = ++requestRef.current;

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    setValidation(null);

    if (!companyId || !token || !enabled) return;

    timeoutRef.current = window.setTimeout(async () => {
      try {
        const result = await validateToken({ companyId, token }).unwrap();

        if (requestId !== requestRef.current) return;

        setValidation(result);
      } catch (error: unknown) {
        if (requestId === requestRef.current) {
          notify.error(
            getApiErrorMessage(
              error,
              t("organizations.addUserForm.validation.xTrace.invalidToken"),
            ),
          );
        }
      }
    }, VALIDATION_DELAY);
  };

  return { validation, isValidating, handleTokenChange, reset };
};
