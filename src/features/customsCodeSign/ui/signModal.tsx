import { SyncOutlined } from "@ant-design/icons";
import { Alert, Select, Space } from "antd";
import { useTranslation } from "react-i18next";

import type { CustomsCodeSigning } from "features/customsCodeSign/lib/useCustomsCodeSigning";
import { getCertificateTitle } from "shared/lib/eImzo";
import CustomButton from "shared/ui/button";
import { DetailItems } from "shared/ui/details";
import ModalWindow from "shared/ui/modalWindow";

type SignModalProps = {
  signing: CustomsCodeSigning;
};

/** Окно подписи заказа ТН ВЭД: состав документа, ключ и отправка. */
const SignModal = ({ signing }: SignModalProps) => {
  const { t } = useTranslation();
  const {
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
    close,
    openEImzoApp,
    sign,
  } = signing;

  const busy = isSending || isSigningLocally;

  return (
    <ModalWindow
      title={t(`customsCodes.signModal.${mode}Title`)}
      openModal={isOpen}
      closeModal={close}
      width="640px"
      maskClosable={!busy}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {/* Под ЭЦП уходит base64, которого не видно: состав документа — здесь. */}
        {order && (
          <DetailItems
            items={[
              {
                label: t("customsCodes.table.accOrderNumber"),
                value: order.accOrderNumber ?? "-",
              },
              {
                label: t("customsCodes.table.customsCode"),
                value: order.customsCode ?? "-",
              },
              {
                label: t("customsCodes.table.product"),
                value: order.product ? `${order.product.name} · ${order.product.gtin}` : "-",
              },
              {
                label: t("customsCodes.table.quantity"),
                value: order.quantity,
              },
              {
                label: t("customsCodes.table.measurement"),
                value: order.measurement
                  ? `${order.measurement.value} · ${order.measurement.quantity}`
                  : "-",
              },
            ]}
          />
        )}

        <Alert
          type={eImzoError ? "warning" : "info"}
          showIcon
          message={eImzoError ?? t("customsCodes.signModal.hint")}
          description={eImzoError ? t("customsCodes.signModal.openAppHint") : undefined}
          action={
            eImzoError ? (
              <CustomButton size="sm" fullWidth={false} onClick={openEImzoApp}>
                {t("customsCodes.signModal.openApp")}
              </CustomButton>
            ) : undefined
          }
        />

        <Select
          size="large"
          style={{ width: "100%" }}
          loading={certificatesLoading}
          disabled={certificatesLoading || busy}
          placeholder={t("customsCodes.signModal.selectKey")}
          value={selectedCertificateIndex}
          notFoundContent={t("customsCodes.signModal.keysNotFound")}
          options={certificates.map((certificate, index) => ({
            value: String(index),
            label: getCertificateTitle(certificate),
          }))}
          onChange={setSelectedCertificateIndex}
        />

        <CustomButton
          onClick={sign}
          disabled={certificatesLoading || busy || !selectedCertificateIndex}
          className="btn-large"
        >
          {busy ? (
            <Space>
              <SyncOutlined spin />
              {t("customsCodes.actions.signing")}
            </Space>
          ) : (
            t("customsCodes.actions.signAndSend")
          )}
        </CustomButton>
      </Space>
    </ModalWindow>
  );
};

export default SignModal;
