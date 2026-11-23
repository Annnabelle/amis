import { Form } from "antd";
import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

import {
  useCreateCompanyMutation,
  useLazyGetCompanyByTinQuery,
} from "entities/organization/api";
import type { Company } from "entities/organization/types";
import { useGetReferencesByTypeQuery } from "entities/references/api";
import { buildProductGroupTitles } from "entities/references/lib/productGroupTitles";
import {
  useCreateCompanyFakturaUzIntegrationMutation,
  useCreateCompanyXTraceIntegrationMutation,
  useLazyValidateCompanyXTraceIntegrationTokenQuery,
} from "entities/xTrace/api";
import type { XTraceIntegrationTokenValidation } from "entities/xTrace/types";
import { getApiErrorMessage } from "shared/api";
import { isFormValidationError } from "shared/lib/formValidation";
import { normalizeLanguage } from "shared/lib/language";
import { notify } from "shared/lib/notify";

const TIN_LENGTH = 9;
/** Задержка проверки токена: поле заполняют вставкой и правкой подряд. */
const TOKEN_VALIDATION_DELAY = 450;

export const CompanyCreateSteps = {
  Company: "company",
  XTrace: "xTrace",
  FakturaUz: "fakturaUz",
} as const;

export type CompanyCreateStep =
  (typeof CompanyCreateSteps)[keyof typeof CompanyCreateSteps];

export const companyCreateStepIndex: Record<CompanyCreateStep, number> = {
  company: 0,
  xTrace: 1,
  fakturaUz: 2,
};

const normalizeTin = (value: string) => value.replace(/\D/g, "").slice(0, TIN_LENGTH);

/**
 * Подключение компании: поиск по ИНН, активация, затем две интеграции.
 *
 * Шаги идут подряд и опираются на результат предыдущего, поэтому состояние
 * мастера живёт одним куском, а экран получает готовые обработчики.
 */
export const useCompanyCreate = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = normalizeLanguage(i18n.language);

  const [form] = Form.useForm();
  const [xTraceForm] = Form.useForm();
  const [fakturaUzForm] = Form.useForm();

  const [step, setStep] = useState<CompanyCreateStep>(CompanyCreateSteps.Company);
  const [searchedCompanyByTin, setSearchedCompanyByTin] = useState<Company | null>(null);
  const [activatedCompany, setActivatedCompany] = useState<Company | null>(null);
  const [isSearchingCompanyByTin, setIsSearchingCompanyByTin] = useState(false);
  const [isActivatingCompany, setIsActivatingCompany] = useState(false);
  /** Проверка токена живёт в состоянии формы активации. */
  const [xTraceValidation, setXTraceValidation] =
    useState<XTraceIntegrationTokenValidation | null>(null);

  const companyLookupRequestRef = useRef(0);
  const xTraceValidationRequestRef = useRef(0);
  const xTraceValidationTimeoutRef = useRef<number | null>(null);

  const [findCompanyByTin] = useLazyGetCompanyByTinQuery();
  const [createCompany] = useCreateCompanyMutation();
  const [validateXTraceToken, { isFetching: xTraceValidationLoading }] =
    useLazyValidateCompanyXTraceIntegrationTokenQuery();
  const [createXTraceIntegration, { isLoading: xTraceCreateLoading }] =
    useCreateCompanyXTraceIntegrationMutation();
  const [
    createFakturaUzIntegration,
    { isLoading: fakturaUzCreateLoading, data: fakturaUzIntegration },
  ] = useCreateCompanyFakturaUzIntegrationMutation();
  const { data: productGroupReferences = [] } = useGetReferencesByTypeQuery("productGroup");

  const productGroupTitleByAlias = useMemo(
    () => buildProductGroupTitles(productGroupReferences, currentLanguage),
    [currentLanguage, productGroupReferences],
  );

  const reset = () => {
    form.resetFields();
    xTraceForm.resetFields();
    fakturaUzForm.resetFields();
    setSearchedCompanyByTin(null);
    setActivatedCompany(null);
    setStep(CompanyCreateSteps.Company);
    setXTraceValidation(null);

    if (xTraceValidationTimeoutRef.current) {
      window.clearTimeout(xTraceValidationTimeoutRef.current);
      xTraceValidationTimeoutRef.current = null;
    }
  };

  const findCompany = async (tin: string, requestId: number) => {
    const normalizedTin = normalizeTin(tin);
    setSearchedCompanyByTin(null);

    try {
      setIsSearchingCompanyByTin(true);
      const company = await findCompanyByTin(normalizedTin).unwrap();
      if (requestId !== companyLookupRequestRef.current) return;
      setSearchedCompanyByTin(company);
    } catch (error: unknown) {
      if (requestId === companyLookupRequestRef.current) {
        notify.error(getApiErrorMessage(error, t("common.dataNotFound")));
      }
    } finally {
      if (requestId === companyLookupRequestRef.current) {
        setIsSearchingCompanyByTin(false);
      }
    }
  };

  const handleTinChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const normalizedTin = normalizeTin(event.target.value);
    const requestId = ++companyLookupRequestRef.current;

    form.setFieldsValue({ tin: normalizedTin });
    setSearchedCompanyByTin(null);

    if (normalizedTin.length !== TIN_LENGTH || /^0+$/.test(normalizedTin)) {
      setIsSearchingCompanyByTin(false);
      return;
    }

    await findCompany(normalizedTin, requestId);
  };

  const handleActivateCompany = async () => {
    if (!searchedCompanyByTin) return;

    try {
      setIsActivatingCompany(true);
      const company = await createCompany({ companyId: searchedCompanyByTin.id }).unwrap();
      notify.success(t("organizations.messages.success.activateCompany"));
      setActivatedCompany(company);
      setStep(CompanyCreateSteps.XTrace);
      xTraceForm.setFieldsValue({ tin: company.tin });
    } catch (error: unknown) {
      notify.error(
        getApiErrorMessage(error, t("organizations.messages.error.activateCompany")),
      );
    } finally {
      setIsActivatingCompany(false);
    }
  };

  const handleXTraceTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
    const token = event.target.value.trim();
    const requestId = ++xTraceValidationRequestRef.current;
    setXTraceValidation(null);

    if (xTraceValidationTimeoutRef.current) {
      window.clearTimeout(xTraceValidationTimeoutRef.current);
    }

    if (!activatedCompany || !token) {
      return;
    }

    xTraceValidationTimeoutRef.current = window.setTimeout(async () => {
      try {
        const validation = await validateXTraceToken({
          companyId: activatedCompany.id,
          token,
        }).unwrap();

        if (requestId !== xTraceValidationRequestRef.current) return;

        setXTraceValidation(validation);
      } catch (error: unknown) {
        if (requestId === xTraceValidationRequestRef.current) {
          notify.error(
            getApiErrorMessage(
              error,
              t("organizations.addUserForm.validation.xTrace.invalidToken"),
            ),
          );
        }
      }
    }, TOKEN_VALIDATION_DELAY);
  };

  const handleCreateXTraceIntegration = async () => {
    if (!activatedCompany) return;

    try {
      const values = await xTraceForm.validateFields(["token", "businessPlaceId"]);
      const token = String(values.token ?? "").trim();
      const businessPlaceId = Number(values.businessPlaceId);

      if (!xTraceValidation) {
        notify.error(t("organizations.addUserForm.validation.xTrace.invalidToken"));
        return;
      }

      await createXTraceIntegration({
        companyId: activatedCompany.id,
        token,
        businessPlaceId,
      }).unwrap();

      notify.success(t("organizations.messages.success.createXTraceIntegration"));
      setStep(CompanyCreateSteps.FakturaUz);
    } catch (error: unknown) {
      if (isFormValidationError(error)) return;
      notify.error(
        getApiErrorMessage(error, t("organizations.messages.error.createXTraceIntegration")),
      );
    }
  };

  const handleCreateFakturaUzIntegration = async () => {
    if (!activatedCompany) return;

    try {
      const values = await fakturaUzForm.validateFields([
        "username",
        "password",
        "clientId",
        "clientSecret",
      ]);

      await createFakturaUzIntegration({
        companyId: activatedCompany.id,
        username: String(values.username ?? "").trim(),
        password: String(values.password ?? ""),
        clientId: String(values.clientId ?? "").trim(),
        clientSecret: String(values.clientSecret ?? "").trim(),
      }).unwrap();

      notify.success(t("organizations.messages.success.createFakturaUzIntegration"));
    } catch (error: unknown) {
      if (isFormValidationError(error)) return;
      notify.error(
        getApiErrorMessage(error, t("organizations.messages.error.createFakturaUzIntegration")),
      );
    }
  };

  return {
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
  };
};
