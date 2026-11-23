import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  useLazyGetCustomsCodeOrderByIdQuery,
  useSignCustomsCodeOrderDissolutionMutation,
  useSignCustomsCodeOrderRegistrationMutation,
} from "entities/customsCodes/api";
import type { CustomsCodeOrder } from "entities/customsCodes/types";
import {
  getDocumentForSigning,
  wait,
  type CustomsCodeSignMode,
} from "features/customsCodeSign/lib/orderActions";
import { getApiErrorMessage } from "shared/api";
import { eImzoClient, type EImzoCertificate } from "shared/lib/eImzo";
import { notify } from "shared/lib/notify";

/** Ошибки E-IMZO приходят ключом перевода: подпись у них своя на каждый случай. */
const E_IMZO_ERROR_KEY_PREFIX = "customsCodes.eImzoErrors.";
/** Приложению E-IMZO нужно время на запуск, прежде чем спрашивать ключи. */
const APP_START_DELAY = 3000;

/**
 * Подпись заказа ТН ВЭД через E-IMZO: ключи, выбор сертификата, отправка.
 *
 * Документ под подпись живёт в заказе, поэтому открытие окна подтягивает
 * полную запись, если в строке списка документа нет.
 */
export const useCustomsCodeSigning = () => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [order, setOrder] = useState<CustomsCodeOrder | null>(null);
  const [mode, setMode] = useState<CustomsCodeSignMode>("registration");
  const [certificates, setCertificates] = useState<EImzoCertificate[]>([]);
  const [selectedCertificateIndex, setSelectedCertificateIndex] = useState<string>();
  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [eImzoError, setEImzoError] = useState<string | null>(null);
  const [isSigningLocally, setIsSigningLocally] = useState(false);

  const [loadCustomsCodeOrder] = useLazyGetCustomsCodeOrderByIdQuery();
  const [signRegistration, { isLoading: signingRegistration }] =
    useSignCustomsCodeOrderRegistrationMutation();
  const [signDissolution, { isLoading: signingDissolution }] =
    useSignCustomsCodeOrderDissolutionMutation();

  const isSending = signingRegistration || signingDissolution;

  const getEImzoErrorMessage = useCallback(
    (error: unknown, fallback: string) => {
      if (error instanceof Error && error.message.startsWith(E_IMZO_ERROR_KEY_PREFIX)) {
        return t(error.message);
      }

      return error instanceof Error ? error.message : fallback;
    },
    [t],
  );

  const loadCertificates = useCallback(() => {
    setCertificatesLoading(true);
    setEImzoError(null);

    eImzoClient
      .listCertificates()
      .then((items) => {
        setCertificates(items);
        setSelectedCertificateIndex(items.length > 0 ? "0" : undefined);
      })
      .catch((error: Error) => {
        setEImzoError(getEImzoErrorMessage(error, t("customsCodes.messages.signError")));
        setCertificates([]);
        setSelectedCertificateIndex(undefined);
      })
      .finally(() => {
        setCertificatesLoading(false);
      });
  }, [getEImzoErrorMessage, t]);

  useEffect(() => {
    if (!isOpen) return;

    loadCertificates();
  }, [isOpen, loadCertificates]);

  const open = useCallback(
    async (target: CustomsCodeOrder, signMode: CustomsCodeSignMode) => {
      let full = target;

      if (!getDocumentForSigning(target, signMode)) {
        try {
          full = await loadCustomsCodeOrder(target.id).unwrap();
        } catch (error) {
          notify.error(getApiErrorMessage(error, t("customsCodes.messages.loadError")));
          return;
        }
      }

      setOrder(full);
      setMode(signMode);
      setSelectedCertificateIndex(undefined);
      setIsOpen(true);
    },
    [loadCustomsCodeOrder, t],
  );

  const close = () => {
    setIsOpen(false);
    setOrder(null);
    setMode("registration");
    setCertificates([]);
    setSelectedCertificateIndex(undefined);
    setEImzoError(null);
  };

  const openEImzoApp = async () => {
    eImzoClient.openApplication();
    await wait(APP_START_DELAY);
    loadCertificates();
  };

  const sign = async () => {
    if (!order) return;

    const documentBase64 = getDocumentForSigning(order, mode);
    const certificate = selectedCertificateIndex
      ? certificates[Number(selectedCertificateIndex)]
      : undefined;

    if (!documentBase64) {
      notify.error(t("customsCodes.messages.documentMissing"));
      return;
    }

    if (!certificate) {
      notify.error(t("customsCodes.messages.selectKey"));
      return;
    }

    try {
      setIsSigningLocally(true);
      const keyId = await eImzoClient.loadKey(certificate);
      await eImzoClient.validateCertificate(certificate, keyId);
      const signedDocumentBase64 = await eImzoClient.createPkcs7(documentBase64, keyId, {
        detached: true,
      });

      const payload = { accOrderId: order.id, signedDocumentBase64 };

      if (mode === "registration") {
        await signRegistration(payload).unwrap();
      } else {
        await signDissolution(payload).unwrap();
      }

      notify.success(t("customsCodes.messages.signSuccess"));
      close();
    } catch (error) {
      notify.error(
        getEImzoErrorMessage(
          error,
          getApiErrorMessage(error, t("customsCodes.messages.signError")),
        ),
      );
    } finally {
      setIsSigningLocally(false);
    }
  };

  return {
    isOpen,
    order,
    mode,
    certificates,
    selectedCertificateIndex,
    setSelectedCertificateIndex,
    certificatesLoading,
    eImzoError,
    isSending,
    isSigningLocally,
    open,
    close,
    openEImzoApp,
    sign,
  };
};

export type CustomsCodeSigning = ReturnType<typeof useCustomsCodeSigning>;
