import { Form, Input } from "antd";
import type { FormInstance } from "antd";
import { useTranslation } from "react-i18next";

import CustomButton from "shared/ui/button";
import FormComponent from "shared/ui/formComponent";
import ModalWindow from "shared/ui/modalWindow";

type FakturaUzModalProps = {
  form: FormInstance;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
};

/** Окно интеграции Faktura.uz: учётные данные кабинета. */
const FakturaUzModal = ({
  form: fakturaUzForm,
  open: isFakturaUzModalOpen,
  onClose,
  onSave: handleSaveFakturaUz,
  isSaving: fakturaUzCreateLoading,
}: FakturaUzModalProps) => {
  const { t } = useTranslation();

  return (
  <ModalWindow
    className="modal-large"
    width="880px"
    titleAction={t('organizations.modalWindow.editing')}
    title={t('organizations.integrations.fakturaUz.title')}
    openModal={isFakturaUzModalOpen}
    closeModal={onClose}
  >
    <div className="organization-integration-step">
      <FormComponent form={fakturaUzForm}>
        <div className="form-inputs form-inputs-row">
          <Form.Item
            name="username"
            className="input"
            label={t('organizations.integrations.fakturaUz.username')}
            rules={[{ required: true, message: t('organizations.integrations.fakturaUz.validation.username') }]}
          >
            <Input size="large" className="input" disabled={fakturaUzCreateLoading} />
          </Form.Item>
          <Form.Item
            name="password"
            className="input"
            label={t('organizations.integrations.fakturaUz.password')}
            rules={[{ required: true, message: t('organizations.integrations.fakturaUz.validation.password') }]}
          >
            <Input.Password size="large" className="input" disabled={fakturaUzCreateLoading} />
          </Form.Item>
        </div>
        <div className="form-inputs form-inputs-row">
          <Form.Item
            name="clientId"
            className="input"
            label={t('organizations.integrations.fakturaUz.clientId')}
            rules={[{ required: true, message: t('organizations.integrations.fakturaUz.validation.clientId') }]}
          >
            <Input size="large" className="input" disabled={fakturaUzCreateLoading} />
          </Form.Item>
          <Form.Item
            name="clientSecret"
            className="input"
            label={t('organizations.integrations.fakturaUz.clientSecret')}
            rules={[{ required: true, message: t('organizations.integrations.fakturaUz.validation.clientSecret') }]}
          >
            <Input.Password size="large" className="input" disabled={fakturaUzCreateLoading} />
          </Form.Item>
        </div>
      </FormComponent>

      <div className="btns-group organization-integration-actions">
        <CustomButton variant="outline" onClick={onClose} disabled={fakturaUzCreateLoading}>
          {t('btn.cancel')}
        </CustomButton>
        <CustomButton onClick={handleSaveFakturaUz} disabled={fakturaUzCreateLoading}>
          {fakturaUzCreateLoading ? t('common.loading') : t('btn.save')}
        </CustomButton>
      </div>
    </div>
  </ModalWindow>
  );
};

export default FakturaUzModal;
