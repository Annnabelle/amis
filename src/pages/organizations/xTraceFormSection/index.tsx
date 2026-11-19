import { Form, Input, Tag} from "antd";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useLazyValidateCompanyXTraceTokenQuery } from "entities/xTrace/api";
import { getApiErrorMessage } from "shared/api";
import type { LanguageKey } from "shared/lib";
import dayjs from "dayjs";

interface XTraceFormSectionProps {
    form: any;
    setIsValidated: (val: boolean) => void;
    referencesProductGroups: Record<string, string>;
    isFieldDisabled?: (name: any) => boolean;
}


const XTraceFormSection = ({ form, setIsValidated }: XTraceFormSectionProps) => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language as LanguageKey;

    const [validateXTraceToken, { data, isFetching: loading, error: requestError }] =
        useLazyValidateCompanyXTraceTokenQuery();
    const error = requestError
        ? getApiErrorMessage(requestError, t("organizations.addUserForm.validation.xTrace.invalidToken"))
        : null;

    const [xTraceValidated, setXTraceValidated] = useState(false);

    const xData = data ?? undefined;

    const isFieldDisabled = (fieldName: string | string[]) => {
        if (!xTraceValidated) return false; // не блокируем до валидации
        const value = form.getFieldValue(fieldName);
        return value !== undefined && value !== null && value !== "";
    };

    useEffect(() => {
        if (!data) return;

        setIsValidated(true);
        setXTraceValidated(true);

        form.setFieldsValue({
            tin: form.getFieldValue("tin"),
            legalName: data.fullName,
            name: data.name,
            displayName: data.name?.[lang] ?? "",
            productGroups: data.productGroups,
            isTest: data.isTest,
            accessCodes: {
                xTrace: {
                    token: form.getFieldValue(["accessCodes", "xTrace", "token"]),
                    expireDate: data.expireDate
                        ? dayjs(data.expireDate).format("DD.MM.YYYY HH:mm:ss")
                        : undefined,
                },
            },
        });
    }, [data, form, lang, setIsValidated]);
    useEffect(() => {
        if (!error) return;

        toast.error(error);
        setIsValidated(false);
        setXTraceValidated(false);
    }, [error, setIsValidated]);

    const handleValidateXTrace = () => {
        const tin = form.getFieldValue("tin");
        const token = form.getFieldValue(["accessCodes", "xTrace", "token"]); // <-- исправлено

        if (!tin || !token) return;

        void validateXTraceToken({ tin, token });
    };

    return (
        <>
            {xData?.isTest && <Tag className="tag-organization-test" color="var(--main-primary)">{t("organizations.testFlag")}</Tag>}

            {/* Первые два поля */}
            <div className="form-inputs form-inputs-row">
                <Form.Item
                    name="tin"
                    className='input'
                    label={t("organizations.addUserForm.label.tin")}
                    // rules={[
                    //     { required: true, message: t("organizations.addUserForm.validation.required.tin") },
                    //     { pattern: /^[0-9]{9}$/, message: t("organizations.addUserForm.validation.pattern.tin") },
                    // ]}
                >
                    <Input
                        size="large"

                        className='input'
                        placeholder={t("organizations.addUserForm.placeholder.tin")}
                        disabled={isFieldDisabled("tin") || loading}
                    />
                </Form.Item>

                <Form.Item
                    className='input'
                    name={["accessCodes", "xTrace", "token"]}
                    label={t("organizations.addUserForm.label.xTraceToken")}
                    // rules={[{ required: true, message: t("organizations.addUserForm.validation.required.token") }]}
                >
                    <Input
                        size="large"
                        className='input'
                        placeholder={t("organizations.addUserForm.placeholder.enterXTraceToken")}
                        onBlur={handleValidateXTrace}
                        disabled={isFieldDisabled(["accessCodes", "xTrace", "token"]) || loading}
                    />
                </Form.Item>
            </div>
        </>
    );
};

export default XTraceFormSection;



