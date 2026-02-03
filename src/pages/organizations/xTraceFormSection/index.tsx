import { Form, Input, Tag} from "antd";
import { useAppDispatch, useAppSelector } from "app/store";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { validateCompanyXTraceToken } from "entities/xTrace/model";
import { isXTraceSuccess } from "shared/lib/validateCompanyXTraceFunction.ts";
import type { LanguageKey } from "shared/lib";
import dayjs from "dayjs";

interface XTraceFormSectionProps {
    form: any;
    setIsValidated: (val: boolean) => void;
    referencesProductGroups: Record<string, string>;
    isFieldDisabled?: (name: any) => boolean;
}

interface XTraceError {
    message?: string;
    error?: string;
    statusCode?: number;
}

interface XTraceBackendError {
    success: false;
    errorCode?: number;
    errorMessage?: Record<LanguageKey, string>;
}


const XTraceFormSection = ({ form, setIsValidated }: XTraceFormSectionProps) => {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const lang = i18n.language as LanguageKey;

    const { data, loading, error } = useAppSelector((state) => state.xTrace) as {
        data: any;
        loading: boolean;
        error: string | XTraceError | XTraceBackendError | null;
    };

    const [xTraceValidated, setXTraceValidated] = useState(false);

    const xData = isXTraceSuccess(data) ? data.data : undefined;

    const isFieldDisabled = (fieldName: string | string[]) => {
        if (!xTraceValidated) return false; // не блокируем до валидации
        const value = form.getFieldValue(fieldName);
        return value !== undefined && value !== null && value !== "";
    };

    useEffect(() => {
        if (!data) return;

        // Проверка, что это не ошибка, а ответ с success/data
        if ("success" in data && "data" in data) {
            // xData для успешного ответа
            const xData = isXTraceSuccess(data) ? data.data : undefined;

            // Проверяем невалидный токен
            if (data.success === false && data.data?.isTokenValid === false) {
                toast.error(t("organizations.addUserForm.validation.xTrace.invalidToken"));
                setIsValidated(false);
                setXTraceValidated(false);
                return; // прекращаем дальнейшую обработку
            }

            if (xData) {
                setIsValidated(true);
                setXTraceValidated(true);

                form.setFieldsValue({
                    tin: form.getFieldValue("tin"),
                    legalName: xData.fullName,
                    name: xData.name,
                    displayName: xData.name?.[lang] ?? "",
                    productGroups: xData.productGroups,
                    isTest: xData.isTest, // <-- сохраняем в форме
                    accessCodes: {
                        xTrace: {
                            token: form.getFieldValue(["accessCodes", "xTrace", "token"]),
                            expireDate: xData.expireDate
                                ? dayjs(xData.expireDate).format("YYYY-MM-DD HH:mm:ss")
                                : undefined,
                        },
                    },
                });
            }
        } else if ("message" in data) {
            toast.error(String(data.message));
            setIsValidated(false);
            setXTraceValidated(false);
        }
    }, [data, form, lang, setIsValidated, t]);
    useEffect(() => {
        if (!error) return;

        let errorMessage = "";

        if (typeof error === "string") {
            errorMessage = error;
        }
        else if (typeof error === "object") {

            if ("errorMessage" in error && error.errorMessage) {
                const messages = error.errorMessage as Record<LanguageKey, string>;

                errorMessage =
                    messages[lang] ??
                    messages.ru ??
                    t("common.errors.unknown");
            }
            else if ("message" in error && error.message === "No token provided") {
                errorMessage = t("organizations.addUserForm.validation.xTrace.noToken");
            }
            else {
                errorMessage =
                    ("message" in error && error.message) ||
                    ("error" in error && error.error) ||
                    t("common.errors.unknown");
            }
        }

        toast.error(errorMessage);
        setIsValidated(false);
        setXTraceValidated(false);
    }, [error, lang, setIsValidated, t]);

    const handleValidateXTrace = () => {
        const tin = form.getFieldValue("tin");
        const token = form.getFieldValue(["accessCodes", "xTrace", "token"]); // <-- исправлено

        if (!tin || !token) return;

        dispatch(validateCompanyXTraceToken({ tin, token }));
    };

    return (
        <>
            {xData?.isTest && <Tag className="tag-organization-test" color="#1890ff">{t("organizations.testFlag")}</Tag>}

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



