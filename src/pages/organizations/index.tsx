import {Form, Input, Tag} from 'antd'
import { IoSearch } from 'react-icons/io5'
import { useAppDispatch, useAppSelector } from 'app/store'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MainLayout from 'shared/ui/layout'
import Heading from 'shared/ui/mainHeading'
import ComponentTable from 'shared/ui/table'
import { createOrganization, deleteOrganization, getAllOrganizations, getOrganizationById, searchOrganizations } from 'entities/organization/model'
import { OrganizationsTableColumns } from 'entities/organization/ui/tableData/organizations'
import type { OrganizationTableDataType } from 'entities/organization/ui/tableData/organizations/types'
import type {CompanyResponse} from 'entities/organization/types'
import { toast } from 'react-toastify'
import CustomButton from 'shared/ui/button'
import ModalWindow from 'shared/ui/modalWindow'
import FormComponent from 'shared/ui/formComponent'
import { useNavigate } from 'react-router-dom'
import type {CreateCompanyDto} from "entities/organization/dtos";
import type {MultiLanguage} from "shared/types/dtos";
import type {LanguageKey} from "shared/lib";
import XTraceFormSection from "./xTraceFormSection";
import {fetchReferencesByType} from "entities/references/model";
import {clearXTrace} from "entities/xTrace/model";
import {getBackendErrorMessage} from "shared/lib/getBackendErrorMessage.ts";
import FilterBar from "shared/ui/filterBar/filterBar.tsx";
import FilterBarItem from "shared/ui/filterBar/filterBarItems.tsx";

const Organizations = () => {
    const navigate = useNavigate()
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch()
    const organizations = useAppSelector((state) => state.organizations.organizations)
    const dataLimit = useAppSelector((state) => state.organizations.limit)
    const dataPage = useAppSelector((state) => state.organizations.page)
    const dataTotal = useAppSelector((state) => state.organizations.total)
    const organizationById = useAppSelector((state) => state.organizations.organizationById)
    const [form] = Form.useForm();
    const [isXTraceValidated, setIsXTraceValidated] = useState(false);
    const lang = i18n.language as LanguageKey;
    const productGroupReferences = useAppSelector(
        (state) => state.references.references.productGroup
    ) ?? [];

    useEffect(() => {
        dispatch(fetchReferencesByType("productGroup"));
    }, [dispatch]);

    useEffect(() => {
        if (!organizationById) return;

        const lang = i18n.language.split('-')[0] as keyof MultiLanguage;

        form.setFieldsValue({
            displayName: organizationById.displayName,

            productGroups: organizationById.productGroups,

            tin: organizationById.tin,

            legalName: organizationById.legalName[lang],

            director: organizationById.director,

            address: {
                region: organizationById.address?.region,
                district: organizationById.address?.district,
                address: organizationById.address?.address,
            },

            bankDetails: {
                bankName: organizationById.bankDetails?.bankName,
                ccea: organizationById.bankDetails?.ccea,
                account: organizationById.bankDetails?.account,
                mfo: organizationById.bankDetails?.mfo,
            },

            contacts: {
                phone: organizationById.contacts?.phone,
                email: organizationById.contacts?.email,
                url: organizationById.contacts?.url,
                person: organizationById.contacts?.person,
            },

            accessCodes: {
                gcpCode: organizationById.accessCodes?.gcpCode,
                token: organizationById.accessCodes?.xTrace?.token,
            },

            status: organizationById.status,
            isTest: organizationById.isTest,
        });
    }, [organizationById, form, i18n.language]);

    useEffect(() => {
        dispatch(getAllOrganizations({
            page: dataPage || 1,
            limit: dataLimit || 10,
            sortOrder: 'asc',
        })) 
    }, [dispatch, dataPage, dataLimit])

    const OrganizationsData = useMemo<OrganizationTableDataType[]>(() => {
        return organizations.map((organization, index) => ({
            key: organization.id,
            number: index + 1,
            displayName: organization.displayName,
            director: organization.director,
            legalName: organization.legalName[lang], // ✅ string
            contacts: organization.contacts.phone ?? '',
            status: organization.status,
            isTest: organization.isTest,
            action: 'Действие',
        }));
    }, [organizations, lang]);

    const [modalState, setModalState] = useState<{
        addCompany: boolean;
        editCompany: boolean;
        retrieveCompany: boolean;
        deleteCompany: boolean;
        companyData: CompanyResponse | null; 
      }>({
        addCompany: false,
        editCompany: false,
        retrieveCompany: false,
        deleteCompany: false,
        companyData: null, 
      });

    const handleModal = (modalName: string, value: boolean) => {
        setModalState((prev) => ({ ...prev, [modalName]: value }));

        if (modalName === "addCompany" && !value) {
            form.resetFields();
            setIsXTraceValidated(false);
            dispatch(clearXTrace());
        }
    };

    const handleCreateCompany = async (values: any) => {
        if (!isXTraceValidated) {
            toast.error(t("organizations.addUserForm.validation.xTrace.notValidated"));
            return;
        }

        const langKey = i18n.language as LanguageKey;

        const payload: CreateCompanyDto = {
            companyType: "type1",
            displayName: values.displayName ?? values.name?.[langKey] ?? "",
            name: values.name ?? { ru: "", uz: "" },
            legalName: values.legalName ?? { ru: "", uz: "" },
            tin: values.tin,
            productGroups: values.productGroups ?? [],
            isTest: Boolean(values.isTest),
            businessPlaceId: Number(values.businessPlaceId),
        };

        if (values.director) {
            payload.director = values.director;
        }

        if (values.address?.region || values.address?.district || values.address?.address) {
            payload.address = {
                region: values.address.region,
                district: values.address.district,
                address: values.address.address,
            };
        }

        if (
            values.bankDetails?.bankName ||
            values.bankDetails?.account ||
            values.bankDetails?.mfo
        ) {
            payload.bankDetails = {
                bankName: values.bankDetails.bankName,
                ccea: values.bankDetails.ccea,
                account: values.bankDetails.account,
                mfo: values.bankDetails.mfo,
            };
        }

        if (
            values.contacts?.phone ||
            values.contacts?.email ||
            values.contacts?.url ||
            values.contacts?.person
        ) {
            payload.contacts = {
                phone: values.contacts.phone,
                email: values.contacts.email,
                url: values.contacts.url,
                person: values.contacts.person,
            };
        }

        if (values.accessCodes?.xTrace?.token) {
            payload.accessCodes = {
                xTrace: {
                    token: values.accessCodes.xTrace.token,
                    expireDate: values.accessCodes.xTrace.expireDate,
                },
            };
        }

        try {
            const result = await dispatch(createOrganization(payload));

            if (result.meta.requestStatus === "fulfilled") {
                toast.success(t("organizations.messages.success.createUser"));
                handleModal("addCompany", false);

                // 🔄 Перезагрузка страницы
                window.location.reload();
            } else {
                const errorMessage =
                    typeof result.payload === "string"
                        ? result.payload
                        : t("organizations.messages.error.createUser");

                toast.error(errorMessage);
            }
        } catch (error: any) {
            toast.error(
                getBackendErrorMessage(error, t('organizations.messages.error.createUser'))
            );
        }
    };

    const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | null>(null);

    const handleRowClick = (type: 'Company', action: 'retrieve' | 'edit' | 'delete', record: OrganizationTableDataType) => {
        if (type === "Company" && action === "retrieve") {
            navigate(`/organization/${record.key}`); 
        }
        if (action === "edit") {
            navigate(`/organization/${record.key}/edit`);
        }
    };

    useEffect(() => {
        if (selectedOrganizationId){
            dispatch(getOrganizationById({id: selectedOrganizationId}))
        }
    }, [dispatch, selectedOrganizationId])

    const handleDeleteOrganization = (record: OrganizationTableDataType) => {
        const organization = organizations.find((o) => o.id === record.key) ?? null;
            if (organization) {
                setSelectedOrganizationId(organization.id);
                setModalState((prev) => ({
                ...prev,
                deleteCompany: true,
                companyData: organization
                }));
            }
    };

    const confirmDeleteOrganization = async () => {
        if (!modalState.companyData) return;

        try {
            const resultAction = await dispatch(
                deleteOrganization({ id: modalState.companyData.id })
            );

            if (deleteOrganization.fulfilled.match(resultAction)) {
                toast.success(t('organizations.messages.success.deleteUser'));
                handleModal("deleteCompany", false);

                await dispatch(getAllOrganizations({ page: 1, limit: 10, sortOrder: "asc" }));
            } else {
                toast.error(t('organizations.messages.error.deleteUser'));
            }
        } catch (err) {
            toast.error((err as string) || t('organizations.messages.error.deleteUser'));
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.trim().length > 0) {
            dispatch(searchOrganizations({ query: value, page: 1, limit: 10, sortOrder: 'asc' }));
        } else {
            dispatch(getAllOrganizations({ page: 1, limit: 10, sortOrder: 'asc' }));
        }
    };

    const referencesProductGroups = useMemo(() => {
        return productGroupReferences.reduce((acc, item) => {
            acc[item.alias] = item.title[lang] ?? ""; // title is MultiLanguage, pick current lang
            return acc;
        }, {} as Record<string, string>);
    }, [productGroupReferences, lang]);

    console.log("group", productGroupReferences)

    const isFieldDisabled = (name: any) => {
        const value = form.getFieldValue(name);
        return isXTraceValidated && value !== undefined && value !== null && value !== "";
    };

    return (
        <MainLayout>
            <Heading title={t('organizations.title')} subtitle={t('organizations.subtitle')} totalAmount={`${dataTotal}`}>
                <div className="btns-group">
                    <CustomButton className='outline' onClick={() => navigate(`/audit-logs`)}>{t('navigation.audit')}</CustomButton>
                    <CustomButton onClick={() => handleModal('addCompany', true)}>{t('organizations.btnAdd')}</CustomButton>
                </div>
            </Heading>
            <div className="box">
                <div className="box-container">
                    <div className="box-container-items">
                        <div className="box-container-items-item">
                            <FilterBar>
                                <FilterBarItem>
                                    <Form.Item name="searchExpert" className="input">
                                        <Input
                                            size="large"
                                            placeholder={t('search.byOrganization')}
                                            suffix={<IoSearch />}
                                            allowClear
                                            onChange={handleSearchChange}
                                        />
                                    </Form.Item>
                                </FilterBarItem>
                            </FilterBar>
                        </div>
                    </div>
                    <div className="box-container-items">
                        <ComponentTable<OrganizationTableDataType>
                            columns={OrganizationsTableColumns(t, handleDeleteOrganization)}
                            data={OrganizationsData}
                            onRowClick={(record) => handleRowClick('Company', 'retrieve', record)}
                            pagination={{
                                current: dataPage || 1,
                                pageSize: dataLimit || 10,
                                total: dataTotal || 0,
                                onChange: (newPage, newLimit) => {
                                dispatch(getAllOrganizations({ page: newPage, limit: newLimit, sortOrder: "asc" }));
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
            <ModalWindow maskClosable={false}  className="modal-large" titleAction={t('organizations.modalWindow.adding')} title={t('organizations.modalWindow.organization')} openModal={modalState.addCompany} closeModal={() => handleModal('addCompany', false)}>
                <FormComponent
                    form={form}
                    onFinish={handleCreateCompany}
                >
                    <XTraceFormSection
                        form={form}
                        setIsValidated={setIsXTraceValidated}
                        isFieldDisabled={isFieldDisabled}
                        referencesProductGroups={referencesProductGroups}
                    />
                    {isXTraceValidated && (
                        <>
                            <Form.Item name="isTest" hidden>
                                <Input />
                            </Form.Item>
                            <div className="form-inputs form-inputs-row">
                                <Form.Item
                                    name={["accessCodes", "xTrace", "expireDate"]} // для сабмита
                                    label={t('organizations.addUserForm.label.expireDate')}
                                    className="input"
                                >
                                    <Input
                                        size="large"
                                        className="input"
                                        disabled
                                        readOnly
                                        placeholder={t('organizations.addUserForm.placeholder.expireDate')}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="businessPlaceId"
                                    label={t('organizations.addUserForm.label.businessPlaceId')}
                                    className="input"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("organizations.addUserForm.placeholder.businessPlaceId"),
                                        },
                                    ]}
                                >
                                    <Input
                                        size="large"
                                        inputMode="numeric"
                                        placeholder={t('organizations.addUserForm.placeholder.businessPlaceId')}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            form.setFieldsValue({ businessPlaceId: value });
                                        }}
                                    />
                                </Form.Item>
                            </div>
                            <div className="form-inputs form-inputs-row">
                                <Form.Item className="input" name="displayName" label={t('organizations.addUserForm.label.displayName')}
                                           rules={[
                                               {
                                                   required: true,
                                                   message: t("organizations.addUserForm.validation.required.displayName"),
                                               },
                                           ]}>
                                    <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.displayName')} disabled={!isXTraceValidated} />
                                </Form.Item>
                                <Form.Item className="input" name="director" label={t('organizations.addUserForm.label.director')}>
                                    <Input
                                        className="input"
                                        size="large"
                                        placeholder={t('organizations.addUserForm.placeholder.director')}
                                    />
                                </Form.Item>
                            </div>
                            <div className="form-inputs form-inputs-row form-inputs-product-groups">
                                <Form.Item  name="productGroups" hidden />
                                <Form.Item
                                    className="input"
                                    label={t("organizations.addUserForm.label.productGroup")}
                                    shouldUpdate={(prev, cur) =>
                                        prev.productGroups !== cur.productGroups
                                    }
                                >
                                    {() => {
                                        const productGroups = form.getFieldValue("productGroups");

                                        if (!Array.isArray(productGroups) || productGroups.length === 0) {
                                            return (
                                                <Input size="large" className="input input-hidden" disabled hidden />
                                            );
                                        }
                                        return (
                                            <Input
                                                size="large"
                                                className="input"
                                                disabled
                                                value={undefined} // 🔥 важно
                                                prefix={
                                                    <div className="product-groups-preview">
                                                        {productGroups.map((alias: string) => {
                                                            const ref = productGroupReferences.find(
                                                                (r) => r.alias === alias
                                                            );

                                                            const title =
                                                                ref?.title?.[lang] ??
                                                                ref?.title?.ru ??
                                                                "";

                                                            return (
                                                                <Tag
                                                                    key={alias}
                                                                    color="blue"
                                                                    style={{
                                                                        margin: 0,
                                                                        fontSize: 12,
                                                                        padding: "4px 6px",
                                                                    }}
                                                                >
                                                                    {title}
                                                                </Tag>
                                                            );
                                                        })}
                                                    </div>
                                                }
                                            />
                                        );
                                    }}
                                </Form.Item>
                            </div>
                            <div className="form-divider-title">
                                <h4 className="title">{t('organizations.subtitles.name')}</h4>
                            </div>
                            <div className="form-inputs form-inputs-row">
                                <Form.Item className="input" name={["name", "ru"]} label={`${t('organizations.addUserForm.label.companyName')} RU`}
                                    // rules={[
                                    //     {
                                    //         required: true,
                                    //         message: t("organizations.addUserForm.validation.required.displayName"),
                                    //     },
                                    // ]}
                                >
                                    <Input
                                        className="input"
                                        size="large"
                                        placeholder={t('organizations.addUserForm.placeholder.companyName')}
                                        disabled={isFieldDisabled(["name", "ru"])}
                                    />
                                </Form.Item>
                                <Form.Item className="input" name={["name", "en"]} label={`${t('organizations.addUserForm.label.companyName')} EN`}
                                           // rules={[
                                           //     {
                                           //         required: true,
                                           //         message: t("organizations.addUserForm.validation.required.displayName"),
                                           //     },
                                           // ]}
                                >
                                    <Input
                                        className="input"
                                        size="large"
                                        placeholder={t('organizations.addUserForm.placeholder.companyName')}
                                        disabled={isFieldDisabled(["name", "en"])}
                                    />
                                </Form.Item>
                            </div>
                            <div className="form-inputs form-inputs-row small">
                                <Form.Item className="input" name={["name", "uz"]} label={`${t('organizations.addUserForm.label.companyName')} UZ`}
                                    // rules={[
                                    //     {
                                    //         required: true,
                                    //         message: t("organizations.addUserForm.validation.required.displayName"),
                                    //     },
                                    // ]}
                                >
                                    <Input
                                        className="input"
                                        size="large"
                                        placeholder={t('organizations.addUserForm.placeholder.companyName')}
                                        disabled={isFieldDisabled(["name", "uz"])}
                                    />
                                </Form.Item>
                            </div>
                            <div className="form-divider-title">
                                <h4 className="title">{t('organizations.subtitles.legalName')}</h4>
                            </div>
                            <div className="form-inputs form-inputs-row">
                                <Form.Item className="input" name={["legalName", "ru"]} label={`${t('organizations.addUserForm.label.legalName')} RU`}
                                           // rules={[
                                           //     {
                                           //         required: true,
                                           //         message: t("organizations.addUserForm.validation.required.legalName"),
                                           //     },
                                           // ]}
                                >
                                    <Input
                                        className="input"
                                        size="large"
                                        placeholder={t('organizations.addUserForm.placeholder.legalName')}
                                        disabled={isFieldDisabled(["legalName", "ru"])}
                                    />
                                </Form.Item>
                                <Form.Item className="input" name={["legalName", "en"]} label={`${t('organizations.addUserForm.label.legalName')} EN`}
                                           // rules={[
                                           //     {
                                           //         required: true,
                                           //         message: t("organizations.addUserForm.validation.required.legalName"),
                                           //     },
                                           // ]}
                                    >
                                    <Input
                                        className="input"
                                        size="large"
                                        placeholder={t('organizations.addUserForm.placeholder.legalName')}
                                        disabled={isFieldDisabled(["legalName", "en"])}
                                    />
                                </Form.Item>
                            </div>
                            <div className="form-inputs form-inputs-row small">
                                <Form.Item className="input" name={["legalName", "uz"]} label={`${t('organizations.addUserForm.label.legalName')} UZ`}
                                           // rules={[
                                           //     {
                                           //         required: true,
                                           //         message: t("organizations.addUserForm.validation.required.legalName"),
                                           //     },
                                           // ]}
                                >
                                    <Input
                                        className="input"
                                        size="large"
                                        placeholder={t('organizations.addUserForm.placeholder.legalName')}
                                        disabled={isFieldDisabled(["legalName", "uz"])}
                                    />
                                </Form.Item>

                            </div>
                            <div className="form-divider-title">
                                <h4 className="title">{t('organizations.subtitles.address')}</h4>
                            </div>

                            {/* AddressDto */}
                            <div className="form-inputs form-inputs-row">
                                <Form.Item className="input" name={['address', 'region']} label={t('organizations.addUserForm.label.region')}>
                                    <Input
                                        className="input"
                                        size="large"
                                        placeholder={t('organizations.addUserForm.placeholder.region')}
                                        disabled={!isXTraceValidated}
                                    />
                                </Form.Item>
                                <Form.Item className="input" name={['address', 'district']} label={t('organizations.addUserForm.label.district')}
                                           rules={[
                                               {
                                                   required: false,
                                                   message: t("organizations.addUserForm.validation.required.district"),
                                               },
                                           ]}>
                                    <Input
                                        className="input"
                                        size="large"
                                        placeholder={t('organizations.addUserForm.placeholder.district')}
                                        disabled={!isXTraceValidated}
                                    />
                                </Form.Item>
                            </div>
                            <div className="form-inputs form-inputs-row">
                                <Form.Item
                                    className="input"
                                    name={["address", "address"]}
                                    label={t("organizations.addUserForm.label.address")}
                                    >
                                    <Input
                                        className="input"
                                        size="large"
                                        placeholder={t("organizations.addUserForm.placeholder.address")}
                                        disabled={!isXTraceValidated}
                                    />
                                    </Form.Item>

                            </div>

                            <div className="form-divider-title">
                                <h4 className="title">{t('organizations.subtitles.bankDetails')}</h4>
                            </div>

                            <div className="form-inputs form-inputs-row">
                                <Form.Item
                                    className="input"
                                    name={["bankDetails", "bankName"]}
                                    label={t("organizations.addUserForm.label.bankName")}
                                    rules={[
                                        {
                                            required: false,
                                            message: t("organizations.addUserForm.validation.required.bankName"),
                                        },
                                    ]}
                                >
                                    <Input
                                        className="input"
                                        size="large"
                                        placeholder={t("organizations.addUserForm.placeholder.bankName")}
                                        disabled={!isXTraceValidated}
                                    />
                                </Form.Item>

                                <Form.Item
                                    className="input"
                                    name={["bankDetails", "ccea"]}
                                    label={t("organizations.addUserForm.label.ccea")}
                                    rules={[
                                        {
                                            required: false,
                                            message: t("organizations.addUserForm.validation.required.ccea"),
                                        },
                                        {
                                            pattern: /^[0-9]{20}$/,
                                            message: t("organizations.addUserForm.validation.pattern.ccea"),
                                        },
                                    ]}
                                >
                                    <Input
                                        className="input"
                                        size="large"
                                        placeholder={t("organizations.addUserForm.placeholder.ccea")}
                                        disabled={!isXTraceValidated}
                                    />
                                </Form.Item>
                                </div>

                            <div className="form-inputs form-inputs-row">
                                <Form.Item
                                    className="input"
                                    name={["bankDetails", "account"]}
                                    label={t("organizations.addUserForm.label.account")}
                                    rules={[
                                        {
                                            required: false,
                                            message: t("organizations.addUserForm.validation.required.account"),
                                        },
                                        {
                                            pattern: /^[0-9]{20}$/,
                                            message: t("organizations.addUserForm.validation.pattern.account"),
                                        },
                                    ]}
                                >
                                    <Input
                                        className="input"
                                        size="large"
                                        placeholder={t("organizations.addUserForm.placeholder.account")}
                                        disabled={!isXTraceValidated}
                                    />
                                </Form.Item>

                                <Form.Item
                                    className="input"
                                    name={["bankDetails", "mfo"]}
                                    label={t("organizations.addUserForm.label.mfo")}
                                    rules={[
                                        {
                                            required: false,
                                            message: t("organizations.addUserForm.validation.required.mfo"),
                                        },
                                        {
                                            pattern: /^[0-9]{5}$/,
                                            message: t("organizations.addUserForm.validation.pattern.mfo"),
                                        },
                                    ]}
                                >
                                    <Input
                                        className="input"
                                        size="large"
                                        placeholder={t("organizations.addUserForm.placeholder.mfo")}
                                        disabled={!isXTraceValidated}
                                    />
                                </Form.Item>
                            </div>


                             <div className="form-divider-title">
                                <h4 className="title">{t('organizations.subtitles.contactDetails')} </h4>
                            </div>

                            {/* ContactsDto */}
                            <div className="form-inputs form-inputs-row">
                                <Form.Item
                                    className="input"
                                    name={["contacts", "phone"]}
                                    label={t("organizations.addUserForm.label.phone")}
                                >
                                    <Input
                                        className="input"
                                        size="large"
                                        placeholder={t("organizations.addUserForm.placeholder.phone")}
                                        disabled={!isXTraceValidated}
                                    />
                                </Form.Item>

                                <Form.Item
                                    className="input"
                                    name={["contacts", "email"]}
                                    label={t("organizations.addUserForm.label.email")}
                                >
                                    <Input
                                        className="input"
                                        size="large"
                                        placeholder={t("organizations.addUserForm.placeholder.email")}
                                        disabled={!isXTraceValidated}
                                    />
                                </Form.Item>
                                </div>


                            <div className="form-inputs form-inputs-row">
                                <Form.Item
                                    className="input"
                                    name={["contacts", "url"]}
                                    label={t("organizations.addUserForm.label.url")}
                                    rules={[
                                        {
                                            required: false,
                                            message: t("organizations.addUserForm.validation.required.url"),
                                        },
                                        {
                                            type: "url",
                                            message: t("organizations.addUserForm.validation.pattern.url"),
                                        },
                                    ]}
                                >
                                    <Input
                                        className="input"
                                        size="large"
                                        placeholder={t("organizations.addUserForm.placeholder.url")}
                                        disabled={!isXTraceValidated}
                                    />
                                </Form.Item>

                                <Form.Item
                                    className="input"
                                    name={["contacts", "person"]}
                                    label={t("organizations.addUserForm.label.person")}
                                >
                                    <Input
                                        className="input"
                                        size="large"
                                        placeholder={t("organizations.addUserForm.placeholder.person")}
                                        disabled={!isXTraceValidated}
                                    />
                                </Form.Item>
                                </div>


                            {/* AccessCodesDto */}
                            {/*<div className="form-inputs form-inputs-row">*/}
                            {/*    <Form.Item*/}
                            {/*        className="input"*/}
                            {/*        name={["accessCodes", "gcpCode"]}*/}
                            {/*        label={t("organizations.addUserForm.label.gcpCode")}*/}
                            {/*        rules={[*/}
                            {/*            {*/}
                            {/*                required: true,*/}
                            {/*                message: t("organizations.addUserForm.validation.required.gcpCode"),*/}
                            {/*            },*/}
                            {/*            {*/}
                            {/*                min: 3,*/}
                            {/*                message: t("organizations.addUserForm.validation.pattern.gcpCode"),*/}
                            {/*            },*/}
                            {/*        ]}*/}
                            {/*    >*/}
                            {/*        <Input*/}
                            {/*            className="input"*/}
                            {/*            size="large"*/}
                            {/*            placeholder={t("organizations.addUserForm.placeholder.gcpCode")}*/}
                            {/*            disabled={!isXTraceValidated}*/}
                            {/*        />*/}
                            {/*    </Form.Item>*/}
                            {/*</div>*/}
                            <CustomButton type="submit">{t('btn.create')}</CustomButton>
                        </>
                    )}
                </FormComponent>
            </ModalWindow>
            <ModalWindow
                titleAction={t('organizations.modalWindow.deletion')}
                title={t('organizations.modalWindow.organization')}
                openModal={modalState.deleteCompany}
                closeModal={() => handleModal("deleteCompany", false)}
                classDangerName='danger-title'
                >
                <div className="delete-modal">
                    <div className="delete-modal-title">
                        <p className='title'>
                            {t('organizations.deleteUserQuestion')}: {" "}
                        </p>
                        <p className="subtitle">{modalState.companyData?.legalName?.[lang]} ? </p>
                    </div>
                    <div className="delete-modal-btns">
                        <CustomButton className="danger" onClick={confirmDeleteOrganization}>
                            {t('btn.delete')}
                        </CustomButton>
                        <CustomButton onClick={() => handleModal("deleteUser", false)} className="outline">
                            {t('btn.cancel')}
                        </CustomButton>
                    </div>
                </div>
            </ModalWindow>

        </MainLayout>
  )
}

export default Organizations


