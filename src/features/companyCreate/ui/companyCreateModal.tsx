import { Form, Input, Spin, Steps, Tag } from "antd";
import { useTranslation } from "react-i18next";

import { formatEmployeeName } from "entities/organization/lib/formatCompany";
import { formatDateTime } from "shared/lib/formatDate";
import CustomButton from "shared/ui/button";
import FormComponent from "shared/ui/formComponent";
import ModalWindow from "shared/ui/modalWindow";
import StatusBadge from "shared/ui/statusBadge";
import { getIntegrationStatusBadgeVariant } from "shared/ui/statusBadge/variants";
import {
  CompanyCreateSteps,
  companyCreateStepIndex,
  useCompanyCreate,
} from "features/companyCreate/lib/useCompanyCreate";

type CompanyCreateModalProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * Подключение компании: ИНН, активация, интеграции X-Trace и Faktura.uz.
 *
 * Шаги показываются в одном окне, состояние мастера держит useCompanyCreate.
 */
const CompanyCreateModal = ({ open, onClose }: CompanyCreateModalProps) => {
  const { t } = useTranslation();
  const {
    form,
    xTraceForm,
    fakturaUzForm,
    step,
    setStep,
    searchedCompanyByTin,
    activatedCompany,
    isSearchingCompanyByTin,
    isActivatingCompany,
    xTraceValidation,
    xTraceValidationLoading,
    xTraceCreateLoading,
    fakturaUzCreateLoading,
    fakturaUzIntegration,
    productGroupTitleByAlias,
    reset,
    handleTinChange,
    handleActivateCompany,
    handleXTraceTokenChange,
    handleCreateXTraceIntegration,
    handleCreateFakturaUzIntegration,
  } = useCompanyCreate();

  const close = () => {
    reset();
    onClose();
  };

  return (
<ModalWindow
    maskClosable={false}
    className="modal-large"
    titleAction={t('organizations.modalWindow.adding')}
    title={step === CompanyCreateSteps.XTrace
        ? t('organizations.integrations.xTrace.title')
        : step === CompanyCreateSteps.FakturaUz
            ? t('organizations.integrations.fakturaUz.title')
        : t('organizations.modalWindow.organization')}
    openModal={open}
    closeModal={close}
>
    <div className="organization-create-steps">
        <Steps
            size="small"
            current={companyCreateStepIndex[step]}
            items={[
                { title: t('organizations.integrations.steps.company') },
                { title: t('organizations.integrations.steps.xTrace') },
                { title: t('organizations.integrations.steps.fakturaUz') },
            ]}
        />
    </div>
    {step === CompanyCreateSteps.Company && (
        <>
    <FormComponent form={form}>
        <div className="form-inputs form-inputs-row organization-create-search-row">
            <Form.Item
                name="tin"
                className="input"
                label={t('organizations.addUserForm.label.tin')}
                getValueFromEvent={(event) => event.target.value.replace(/\D/g, '')}
                rules={[
                    { required: true, message: t('organizations.addUserForm.validation.required.tin') },
                    { pattern: /^[0-9]{9}$/, message: t('organizations.addUserForm.validation.pattern.tin') },
                    {
                        validator: async (_, value) => {
                            const tin = String(value ?? "");

                            if (!tin || !/^0+$/.test(tin)) {
                                return Promise.resolve();
                            }

                            return Promise.reject(new Error(t('organizations.addUserForm.validation.pattern.tin')));
                        },
                    },
                ]}
            >
                <Input
                    size="large"
                    className="input"
                    inputMode="numeric"
                    maxLength={9}
                    placeholder={t('organizations.addUserForm.placeholder.tin')}
                    disabled={isActivatingCompany}
                    onChange={handleTinChange}
                    suffix={isSearchingCompanyByTin ? <Spin size="small" /> : undefined}
                />
            </Form.Item>
            {searchedCompanyByTin && (
                <CustomButton
                    className="organization-create-search-action"
                    onClick={handleActivateCompany}
                    disabled={isActivatingCompany}
                >
                    {isActivatingCompany
                        ? t('common.loading', { defaultValue: 'Loading' })
                        : t('organizations.actions.activate', { defaultValue: 'Activate' })}
                </CustomButton>
            )}
        </div>
    </FormComponent>

    {searchedCompanyByTin && (
        <div className="detail-grid detail-grid-single organization-create-preview">
            <div className="route-overview-card">
                <div className="route-overview-head">
                    <div className="route-overview-title">
                        <h2>{searchedCompanyByTin.displayName}</h2>
                    </div>
                </div>
                <div className="route-overview-meta">
                    <div className="route-meta-chip">
                        <span className="label">{t('organizations.addUserForm.label.legalName')}</span>
                        <span className="value" title={searchedCompanyByTin.legalName}>{searchedCompanyByTin.legalName || '-'}</span>
                    </div>
                    <div className="route-meta-chip">
                        <span className="label">{t('organizations.addUserForm.label.tin')}</span>
                        <span className="value">{searchedCompanyByTin.tin || '-'}</span>
                    </div>
                </div>
            </div>

            <div className="detail-grid detail-grid-main">
                <div className="detail-card">
                    <h4>{t('organizations.addUserForm.label.director')}</h4>
                    <div className="detail-items">
                        <div className="detail-item">
                            <span className="label inline-label">{t('organizations.addUserForm.label.name')}</span>
                            <span className="detail-separator">:</span>
                            <span className="value">{formatEmployeeName(searchedCompanyByTin.responsibleEmployees.director) || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label inline-label">{t('organizations.addUserForm.label.tin')}</span>
                            <span className="detail-separator">:</span>
                            <span className="value">{searchedCompanyByTin.responsibleEmployees.director?.tin || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label inline-label">{t('organizations.addUserForm.label.pinfl')}</span>
                            <span className="detail-separator">:</span>
                            <span className="value">{searchedCompanyByTin.responsibleEmployees.director?.pinfl || '-'}</span>
                        </div>
                    </div>
                </div>

                <div className="detail-card">
                    <h4>{t('organizations.addUserForm.label.accountant')}</h4>
                    <div className="detail-items">
                        <div className="detail-item">
                            <span className="label inline-label">{t('organizations.addUserForm.label.name')}</span>
                            <span className="detail-separator">:</span>
                            <span className="value">{formatEmployeeName(searchedCompanyByTin.responsibleEmployees.accountant) || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label inline-label">{t('organizations.addUserForm.label.tin')}</span>
                            <span className="detail-separator">:</span>
                            <span className="value">{searchedCompanyByTin.responsibleEmployees.accountant?.tin || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label inline-label">{t('organizations.addUserForm.label.pinfl')}</span>
                            <span className="detail-separator">:</span>
                            <span className="value">{searchedCompanyByTin.responsibleEmployees.accountant?.pinfl || '-'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="detail-grid detail-grid-main">
                <div className="detail-card">
                    <h4>{t('organizations.subtitles.address')}</h4>
                    <div className="detail-items">
                        <div className="detail-item">
                            <span className="label inline-label">{t('organizations.addUserForm.label.region')}</span>
                            <span className="detail-separator">:</span>
                            <span className="value">{searchedCompanyByTin.address.region || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label inline-label">{t('organizations.addUserForm.label.district')}</span>
                            <span className="detail-separator">:</span>
                            <span className="value">{searchedCompanyByTin.address.district || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label inline-label">{t('organizations.addUserForm.label.address')}</span>
                            <span className="detail-separator">:</span>
                            <span className="value">{searchedCompanyByTin.address.address || '-'}</span>
                        </div>
                    </div>
                </div>

                <div className="detail-card">
                    <h4>{t('organizations.subtitles.bankDetails')}</h4>
                    <div className="detail-items">
                        <div className="detail-item">
                            <span className="label inline-label">{t('organizations.addUserForm.label.bankName')}</span>
                            <span className="detail-separator">:</span>
                            <span className="value">{searchedCompanyByTin.bankDetails?.bankName || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label inline-label">{t('organizations.addUserForm.label.account')}</span>
                            <span className="detail-separator">:</span>
                            <span className="value">{searchedCompanyByTin.bankDetails?.account || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label inline-label">{t('organizations.addUserForm.label.ccea')}</span>
                            <span className="detail-separator">:</span>
                            <span className="value">{searchedCompanyByTin.bankDetails?.ccea || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label inline-label">{t('organizations.addUserForm.label.mfo')}</span>
                            <span className="detail-separator">:</span>
                            <span className="value">{searchedCompanyByTin.bankDetails?.mfo || '-'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="btns-group">
                <CustomButton
                    onClick={handleActivateCompany}
                    disabled={isActivatingCompany}
                >
                    {isActivatingCompany
                        ? t('common.loading', { defaultValue: 'Loading' })
                        : t('organizations.actions.activate', { defaultValue: 'Activate' })}
                </CustomButton>
            </div>
        </div>
    )}
        </>
    )}
    {step === CompanyCreateSteps.XTrace && activatedCompany && (
        <div className="organization-integration-step">
            <div className="route-overview-card">
                <div className="route-overview-meta">
                    <div className="route-meta-chip">
                        <span className="label">{t('organizations.addUserForm.label.legalName')}</span>
                        <span className="value">{activatedCompany.displayName || activatedCompany.legalName}</span>
                    </div>
                    <div className="route-meta-chip">
                        <span className="label">{t('organizations.addUserForm.label.tin')}</span>
                        <span className="value">{activatedCompany.tin}</span>
                    </div>
                </div>
            </div>

            <FormComponent form={xTraceForm}>
                <div className="form-inputs form-inputs-row">
                    <Form.Item
                        name="tin"
                        className="input"
                        label={t('organizations.addUserForm.label.tin')}
                    >
                        <Input
                            size="large"
                            className="input"
                            disabled
                        />
                    </Form.Item>

                    <Form.Item
                        name="token"
                        className="input"
                        label={t('organizations.addUserForm.label.xTraceToken')}
                        rules={[
                            { required: true, message: t('organizations.addUserForm.validation.required.token', { defaultValue: 'Token is required' }) },
                        ]}
                    >
                        <Input
                            size="large"
                            className="input"
                            placeholder={t('organizations.addUserForm.placeholder.enterXTraceToken')}
                            onChange={handleXTraceTokenChange}
                            disabled={xTraceCreateLoading}
                            suffix={xTraceValidationLoading ? <Spin size="small" /> : undefined}
                        />
                    </Form.Item>
                </div>

                {xTraceValidation && (
                    <>
                        <div className="detail-grid detail-grid-main organization-create-preview">
                            <div className="detail-card detail-card-full organization-xtrace-validation-card">
                                <h4>{t('organizations.integrations.receivedData')}</h4>
                                <div className="detail-items">
                                    <div className="detail-item">
                                        <span className="label inline-label">{t('organizations.addUserForm.label.expireDate')}</span>
                                        <span className="detail-separator">:</span>
                                        <span className="value">{formatDateTime(xTraceValidation.expireDate)}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label inline-label">{t('organizations.testFlag')}</span>
                                        <span className="detail-separator">:</span>
                                        <span className="value">
                                            {xTraceValidation.isTest ? (
                                                <Tag className="test-flag tag-flat" color="blue-inverse">
                                                    {t('organizations.testFlag')}
                                                </Tag>
                                            ) : '-'}
                                        </span>
                                    </div>
                                    <div className="organization-product-group-row">
                                        <span className="label">{t('organizations.addUserForm.label.productGroup')}</span>
                                        <div className="organization-product-group-pills">
                                            {xTraceValidation.productGroups.length > 0
                                                ? xTraceValidation.productGroups.map((productGroup) => {
                                                    const normalizedProductGroup = productGroup.trim().toLowerCase();
                                                    const productGroupTitle =
                                                        productGroupTitleByAlias.get(productGroup) ??
                                                        productGroupTitleByAlias.get(normalizedProductGroup) ??
                                                        productGroup;

                                                    return (
                                                        <span key={productGroup} className="organization-product-group-pill">
                                                            {productGroupTitle}
                                                        </span>
                                                    );
                                                })
                                                : <span className="value">-</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-inputs form-inputs-row">
                            <Form.Item
                                name="businessPlaceId"
                                className="input"
                                label={t('organizations.addUserForm.label.businessPlaceId')}
                                rules={[
                                    { required: true, message: t('organizations.addUserForm.validation.required.businessPlaceId', { defaultValue: 'Business place is required' }) },
                                    {
                                        validator: async (_, value) => {
                                            const businessPlaceId = Number(value);

                                            if (Number.isInteger(businessPlaceId) && businessPlaceId > 0) {
                                                return Promise.resolve();
                                            }

                                            return Promise.reject(new Error(t('organizations.addUserForm.validation.required.businessPlaceId', { defaultValue: 'Business place is required' })));
                                        },
                                    },
                                ]}
                            >
                                <Input
                                    size="large"
                                    className="input"
                                    inputMode="numeric"
                                    placeholder={t('organizations.addUserForm.placeholder.businessPlaceId')}
                                    disabled={xTraceCreateLoading}
                                    onChange={(event) => {
                                        const value = event.target.value.replace(/\D/g, '');
                                        xTraceForm.setFieldsValue({ businessPlaceId: value });
                                    }}
                                />
                            </Form.Item>
                        </div>
                    </>
                )}
            </FormComponent>

            <div className="btns-group organization-integration-actions">
                <CustomButton
                    variant="outline"
                    onClick={() => setStep(CompanyCreateSteps.FakturaUz)}
                    disabled={xTraceCreateLoading}
                >
                    {t('btn.skip')}
                </CustomButton>
                <CustomButton
                    onClick={handleCreateXTraceIntegration}
                    disabled={!xTraceValidation || xTraceValidationLoading || xTraceCreateLoading}
                >
                    {xTraceCreateLoading
                        ? t('common.loading', { defaultValue: 'Loading' })
                        : t('btn.save')}
                </CustomButton>
            </div>
        </div>
    )}
    {step === CompanyCreateSteps.FakturaUz && activatedCompany && (
        <div className="organization-integration-step">
            <div className="route-overview-card">
                <div className="route-overview-meta">
                    <div className="route-meta-chip">
                        <span className="label">{t('organizations.addUserForm.label.legalName')}</span>
                        <span className="value">{activatedCompany.displayName || activatedCompany.legalName}</span>
                    </div>
                    <div className="route-meta-chip">
                        <span className="label">{t('organizations.addUserForm.label.tin')}</span>
                        <span className="value">{activatedCompany.tin}</span>
                    </div>
                </div>
            </div>

            <FormComponent form={fakturaUzForm}>
                <div className="form-inputs form-inputs-row">
                    <Form.Item
                        name="username"
                        className="input"
                        label={t('organizations.integrations.fakturaUz.username')}
                        rules={[{ required: true, message: t('organizations.integrations.fakturaUz.validation.username') }]}
                    >
                        <Input
                            size="large"
                            className="input"
                            disabled={fakturaUzCreateLoading || Boolean(fakturaUzIntegration)}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        className="input"
                        label={t('organizations.integrations.fakturaUz.password')}
                        rules={[{ required: true, message: t('organizations.integrations.fakturaUz.validation.password') }]}
                    >
                        <Input.Password
                            size="large"
                            className="input"
                            disabled={fakturaUzCreateLoading || Boolean(fakturaUzIntegration)}
                        />
                    </Form.Item>
                </div>
                <div className="form-inputs form-inputs-row">
                    <Form.Item
                        name="clientId"
                        className="input"
                        label={t('organizations.integrations.fakturaUz.clientId')}
                        rules={[{ required: true, message: t('organizations.integrations.fakturaUz.validation.clientId') }]}
                    >
                        <Input
                            size="large"
                            className="input"
                            disabled={fakturaUzCreateLoading || Boolean(fakturaUzIntegration)}
                        />
                    </Form.Item>
                    <Form.Item
                        name="clientSecret"
                        className="input"
                        label={t('organizations.integrations.fakturaUz.clientSecret')}
                        rules={[{ required: true, message: t('organizations.integrations.fakturaUz.validation.clientSecret') }]}
                    >
                        <Input.Password
                            size="large"
                            className="input"
                            disabled={fakturaUzCreateLoading || Boolean(fakturaUzIntegration)}
                        />
                    </Form.Item>
                </div>
            </FormComponent>

            {fakturaUzIntegration && (
                <div className="detail-grid detail-grid-main organization-create-preview">
                    <div className="detail-card detail-card-full organization-xtrace-validation-card">
                        <h4>{t('organizations.integrations.receivedData')}</h4>
                        <div className="detail-items">
                            <div className="detail-item">
                                <span className="label inline-label">{t('organizations.status')}</span>
                                <span className="detail-separator">:</span>
                                <StatusBadge variant={getIntegrationStatusBadgeVariant(fakturaUzIntegration.status)}>
                                    {t(`statuses.${fakturaUzIntegration.status}`, { defaultValue: fakturaUzIntegration.status })}
                                </StatusBadge>
                            </div>
                            <div className="detail-item">
                                <span className="label inline-label">{t('organizations.testFlag')}</span>
                                <span className="detail-separator">:</span>
                                <span className="value">
                                    {fakturaUzIntegration.isTest ? (
                                        <Tag className="test-flag tag-flat" color="blue-inverse">
                                            {t('organizations.testFlag')}
                                        </Tag>
                                    ) : '-'}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="label inline-label">{t('organizations.addUserForm.label.createdAt')}</span>
                                <span className="detail-separator">:</span>
                                <span className="value">{formatDateTime(fakturaUzIntegration.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="btns-group organization-integration-actions">
                {fakturaUzIntegration ? (
                    <CustomButton onClick={() => void close()}>
                        {t('btn.finish')}
                    </CustomButton>
                ) : (
                    <>
                        <CustomButton
                            variant="outline"
                            onClick={() => void close()}
                            disabled={fakturaUzCreateLoading}
                        >
                            {t('btn.skip')}
                        </CustomButton>
                        <CustomButton
                            onClick={handleCreateFakturaUzIntegration}
                            disabled={fakturaUzCreateLoading}
                        >
                            {fakturaUzCreateLoading
                                ? t('common.loading', { defaultValue: 'Loading' })
                                : t('btn.save')}
                        </CustomButton>
                    </>
                )}
            </div>
        </div>
    )}
</ModalWindow>
  );
};

export default CompanyCreateModal;
