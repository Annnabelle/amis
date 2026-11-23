import { Form, Input } from "antd";
import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

import type { XTraceIntegrationTokenValidation } from "entities/xTrace/types";
import CustomButton from "shared/ui/button";
import FormComponent from "shared/ui/formComponent";
import ModalWindow from "shared/ui/modalWindow";
import { formatDateTime } from "shared/lib/formatDate";
import {
  renderProductGroups,
  renderTestFlag,
} from "features/companyIntegrations/ui/renderers";
import type { FormInstance } from "antd";

type XTraceModalProps = {
  form: FormInstance;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  onTokenChange: (event: ChangeEvent<HTMLInputElement>) => void;
  validation: XTraceIntegrationTokenValidation | null;
  isValidating: boolean;
  isSaving: boolean;
  productGroupTitleByAlias: Map<string, string>;
};

/** Окно интеграции X-Trace: токен проверяется до сохранения. */
const XTraceModal = ({
  form: xTraceForm,
  open: isXTraceModalOpen,
  onClose: closeXTraceModal,
  onSave: handleSaveXTrace,
  onTokenChange: handleXTraceTokenChange,
  validation: xTraceValidationData,
  isValidating: xTraceValidationLoading,
  isSaving: xTraceCreateLoading,
  productGroupTitleByAlias,
}: XTraceModalProps) => {
  const { t } = useTranslation();

  return (
  <ModalWindow
    className="modal-large"
    width="880px"
    titleAction={t('organizations.modalWindow.editing')}
    title={t('organizations.integrations.xTrace.title')}
    openModal={isXTraceModalOpen}
    closeModal={closeXTraceModal}
  >
    <div className="organization-integration-step">
      <FormComponent form={xTraceForm}>
        <div className="form-inputs form-inputs-row">
          <Form.Item name="tin" className="input" label={t('organizations.addUserForm.label.tin')}>
            <Input size="large" className="input" disabled />
          </Form.Item>
          <Form.Item
            name="token"
            className="input"
            label={t('organizations.addUserForm.label.xTraceToken')}
            rules={[{ required: true, message: t('organizations.addUserForm.validation.required.token') }]}
          >
            <Input
              size="large"
              className="input"
              onChange={handleXTraceTokenChange}
              disabled={xTraceCreateLoading}
            />
          </Form.Item>
        </div>

        {xTraceValidationData && (
          <div className="detail-grid detail-grid-main organization-create-preview">
            <div className="detail-card detail-card-full organization-xtrace-validation-card">
              <h4>{t('organizations.integrations.receivedData')}</h4>
              <div className="detail-items">
                <div className="detail-item">
                  <span className="label inline-label">{t('organizations.addUserForm.label.expireDate')}</span>
                  <span className="detail-separator">:</span>
                  <span className="value">{formatDateTime(xTraceValidationData.expireDate)}</span>
                </div>
                <div className="detail-item">
                  <span className="label inline-label">{t('organizations.testFlag')}</span>
                  <span className="detail-separator">:</span>
                  <span className="value">{renderTestFlag(xTraceValidationData.isTest, t)}</span>
                </div>
                <div className="organization-product-group-row">
                  <span className="label">{t('organizations.addUserForm.label.productGroup')}</span>
                  {renderProductGroups(xTraceValidationData.productGroups, productGroupTitleByAlias)}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="form-inputs form-inputs-row">
          <Form.Item
            name="businessPlaceId"
            className="input"
            label={t('organizations.addUserForm.label.businessPlaceId')}
            rules={[{ required: true, message: t('organizations.addUserForm.validation.required.businessPlaceId') }]}
          >
            <Input size="large" className="input" type="number" disabled={xTraceCreateLoading} />
          </Form.Item>
        </div>
      </FormComponent>

      <div className="btns-group organization-integration-actions">
        <CustomButton variant="outline" onClick={closeXTraceModal} disabled={xTraceCreateLoading}>
          {t('btn.cancel')}
        </CustomButton>
        <CustomButton
          onClick={handleSaveXTrace}
          disabled={xTraceCreateLoading || xTraceValidationLoading || !xTraceValidationData}
        >
          {xTraceCreateLoading ? t('common.loading') : t('btn.save')}
        </CustomButton>
      </div>
    </div>
  </ModalWindow>
  );
};

export default XTraceModal;
