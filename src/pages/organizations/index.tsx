import {Form, Input, Spin, Steps, Tag} from 'antd'
import { IoSearch } from 'react-icons/io5'
import { useAppDispatch, useAppSelector } from 'app/store'
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import MainLayout from 'shared/ui/layout'
import Heading from 'shared/ui/mainHeading'
import ComponentTable from 'shared/ui/table'
import { createOrganization, deleteOrganization, getAllOrganizations, getCompanyByTin, getOrganizationById, searchOrganizations } from 'entities/organization/model'
import { OrganizationsTableColumns } from 'entities/organization/ui/tableData/organizations'
import type { OrganizationTableDataType } from 'entities/organization/ui/tableData/organizations/types'
import type {CompanyResponse} from 'entities/organization/types'
import { toast } from 'react-toastify'
import CustomButton from 'shared/ui/button'
import ModalWindow from 'shared/ui/modalWindow'
import FormComponent from 'shared/ui/formComponent'
import { useNavigate } from 'react-router-dom'
import {getBackendErrorMessage} from "shared/lib/getBackendErrorMessage.ts";
import FilterBar from "shared/ui/filterBar/filterBar.tsx";
import FilterBarItem from "shared/ui/filterBar/filterBarItems.tsx";
import { useIsMobile } from 'shared/lib';
import { useCan } from 'entities/access/lib';
import { endpointAccessMap } from 'shared/config/endpointAccessMap';
import {
    clearXTraceIntegrationValidation,
    createCompanyFakturaUzIntegration,
    createCompanyXTraceIntegration,
    validateCompanyXTraceIntegrationToken
} from 'entities/xTrace/model';
import { fetchReferencesByType } from 'entities/references/model';
import dayjs from 'dayjs';

const TIN_LENGTH = 9;
type CreateCompanyStep = "company" | "xTrace" | "fakturaUz";
const createCompanyStepIndex: Record<CreateCompanyStep, number> = {
    company: 0,
    xTrace: 1,
    fakturaUz: 2,
};

const Organizations = () => {
    const navigate = useNavigate()
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch()
    const canReadCompany = useCan(endpointAccessMap.companiesRead);
    const canListCompanies = useCan(endpointAccessMap.companiesList);
    const canCreateCompany = useCan(endpointAccessMap.companiesCreate);
    const canDeleteCompany = useCan(endpointAccessMap.companiesDelete);
    const canReadAudit = useCan(endpointAccessMap.auditList);
    const organizations = useAppSelector((state) => state.organizations.organizations)
    const searchedOrganizations = useAppSelector((state) => state.organizations.searchedOrganizations)
    const dataLimit = useAppSelector((state) => state.organizations.limit)
    const dataPage = useAppSelector((state) => state.organizations.page)
    const dataTotal = useAppSelector((state) => state.organizations.total)
    const [form] = Form.useForm();
    const [xTraceForm] = Form.useForm();
    const [fakturaUzForm] = Form.useForm();
    const [searchedCompanyByTin, setSearchedCompanyByTin] = useState<CompanyResponse | null>(null);
    const [activatedCompany, setActivatedCompany] = useState<CompanyResponse | null>(null);
    const [createCompanyStep, setCreateCompanyStep] = useState<CreateCompanyStep>("company");
    const [isSearchingCompanyByTin, setIsSearchingCompanyByTin] = useState(false);
    const [isActivatingCompany, setIsActivatingCompany] = useState(false);
    const companyLookupRequestRef = useRef(0);
    const xTraceValidationRequestRef = useRef(0);
    const xTraceValidationTimeoutRef = useRef<number | null>(null);
    const xTraceValidation = useAppSelector((state) => state.xTrace.integrationValidation);
    const xTraceValidationLoading = useAppSelector((state) => state.xTrace.integrationValidationLoading);
    const xTraceCreateLoading = useAppSelector((state) => state.xTrace.integrationCreateLoading);
    const fakturaUzCreateLoading = useAppSelector((state) => state.xTrace.fakturaUzCreateLoading);
    const fakturaUzIntegration = useAppSelector((state) => state.xTrace.fakturaUzIntegration);
    const productGroupReferences = useAppSelector((state) => state.references.references.productGroup) ?? [];
    const isMobile = useIsMobile();
    const [searchQuery, setSearchQuery] = useState('');
    const currentLanguage = i18n.language.split('-')[0] as "ru" | "en" | "uz";

    useEffect(() => {
        if (isMobile && !canListCompanies) return;

        dispatch(getAllOrganizations({
            page: 1,
            limit: 10,
            sortOrder: 'asc',
        })) 
    }, [canListCompanies, dispatch, isMobile])

    useEffect(() => {
        dispatch(fetchReferencesByType("productGroup"));
    }, [dispatch]);

    const tableOrganizations = useMemo(() => {
        return searchQuery.trim().length > 0 ? searchedOrganizations : organizations;
    }, [organizations, searchQuery, searchedOrganizations]);

    const formatEmployeeName = (employee?: CompanyResponse["responsibleEmployees"]["director"]) => {
        if (!employee?.name) return "";

        return [employee.name.last, employee.name.first, employee.name.middle]
            .filter(Boolean)
            .join(" ");
    };

    const formatContacts = (contacts: CompanyResponse["contacts"]) => {
        return [contacts.phone, contacts.email]
            .filter(Boolean)
            .join(" / ");
    };

    const productGroupTitleByAlias = useMemo(() => {
        const map = new Map<string, string>();

        productGroupReferences.forEach((reference) => {
            const localizedTitle =
                reference.title?.[currentLanguage] ??
                reference.title?.ru ??
                reference.title?.en ??
                reference.alias;

            map.set(
                reference.alias,
                localizedTitle
            );
            map.set(reference.alias.trim().toLowerCase(), localizedTitle);
        });

        return map;
    }, [currentLanguage, productGroupReferences]);

    const OrganizationsData = useMemo<OrganizationTableDataType[]>(() => {
        return tableOrganizations.map((organization, index) => ({
            key: organization.id,
            number: index + 1,
            displayName: organization.displayName,
            tin: organization.tin,
            director: formatEmployeeName(organization.responsibleEmployees.director),
            legalName: organization.legalName,
            contacts: formatContacts(organization.contacts),
            vatCode: organization.vatCode ?? "",
            status: organization.status,
            isTest: organization.isTest,
            action: 'Действие',
        }));
    }, [tableOrganizations]);

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

    useEffect(() => {
        if (modalState.addCompany) {
            dispatch(fetchReferencesByType("productGroup"));
        }
    }, [dispatch, modalState.addCompany]);

    const handleModal = (modalName: string, value: boolean) => {
        setModalState((prev) => ({ ...prev, [modalName]: value }));

        if (modalName === "addCompany" && !value) {
            form.resetFields();
            xTraceForm.resetFields();
            fakturaUzForm.resetFields();
            setSearchedCompanyByTin(null);
            setActivatedCompany(null);
            setCreateCompanyStep("company");
            dispatch(clearXTraceIntegrationValidation());
            if (xTraceValidationTimeoutRef.current) {
                window.clearTimeout(xTraceValidationTimeoutRef.current);
                xTraceValidationTimeoutRef.current = null;
            }
        }
    };

    const normalizeTin = (value: string) => value.replace(/\D/g, "").slice(0, TIN_LENGTH);

    const handleFindCompanyByTin = async (tin: string, requestId: number) => {
        const normalizedTin = normalizeTin(tin);
        setSearchedCompanyByTin(null);

        try {
            setIsSearchingCompanyByTin(true);
            const company = await dispatch(getCompanyByTin(normalizedTin)).unwrap();
            if (requestId !== companyLookupRequestRef.current) return;
            setSearchedCompanyByTin(company);
        } catch (error: any) {
            if (requestId === companyLookupRequestRef.current) {
                toast.error(
                    getBackendErrorMessage(error, t("common.dataNotFound"))
                );
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

        await handleFindCompanyByTin(normalizedTin, requestId);
    };

    const handleActivateCompany = async () => {
        if (!searchedCompanyByTin) return;

        try {
            setIsActivatingCompany(true);
            const company = await dispatch(createOrganization({ companyId: searchedCompanyByTin.id })).unwrap();
            toast.success(t("organizations.messages.success.activateCompany"));
            setActivatedCompany(company);
            setCreateCompanyStep("xTrace");
            xTraceForm.setFieldsValue({ tin: company.tin });
            await dispatch(getAllOrganizations({ page: 1, limit: 10, sortOrder: "asc" }));
        } catch (error: any) {
            toast.error(
                getBackendErrorMessage(error, t("organizations.messages.error.activateCompany"))
            );
        } finally {
            setIsActivatingCompany(false);
        }
    };

    const isSuccessfulXTraceValidation =
        xTraceValidation &&
        "success" in xTraceValidation &&
        xTraceValidation.success === true &&
        "data" in xTraceValidation;
    const xTraceValidationData =
        xTraceValidation &&
        "success" in xTraceValidation &&
        xTraceValidation.success === true &&
        "data" in xTraceValidation
            ? xTraceValidation.data
            : null;

    const handleXTraceTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
        const token = event.target.value.trim();
        const requestId = ++xTraceValidationRequestRef.current;
        dispatch(clearXTraceIntegrationValidation());

        if (xTraceValidationTimeoutRef.current) {
            window.clearTimeout(xTraceValidationTimeoutRef.current);
        }

        if (!activatedCompany || !token) {
            return;
        }

        xTraceValidationTimeoutRef.current = window.setTimeout(async () => {
            try {
                await dispatch(
                    validateCompanyXTraceIntegrationToken({
                        companyId: activatedCompany.id,
                        token,
                    })
                ).unwrap();

                if (requestId !== xTraceValidationRequestRef.current) {
                    dispatch(clearXTraceIntegrationValidation());
                }
            } catch (error: any) {
                if (requestId === xTraceValidationRequestRef.current) {
                    toast.error(getBackendErrorMessage(error, t("organizations.addUserForm.validation.xTrace.invalidToken")));
                }
            }
        }, 450);
    };

    const finishCreateCompanyFlow = async () => {
        handleModal("addCompany", false);
        await dispatch(getAllOrganizations({ page: 1, limit: 10, sortOrder: "asc" }));
    };

    const handleCreateXTraceIntegration = async () => {
        if (!activatedCompany) return;

        try {
            const values = await xTraceForm.validateFields(["token", "businessPlaceId"]);
            const token = String(values.token ?? "").trim();
            const businessPlaceId = Number(values.businessPlaceId);

            if (!isSuccessfulXTraceValidation) {
                toast.error(t("organizations.addUserForm.validation.xTrace.invalidToken"));
                return;
            }

            await dispatch(
                createCompanyXTraceIntegration({
                    companyId: activatedCompany.id,
                    token,
                    businessPlaceId,
                })
            ).unwrap();

            toast.success(t("organizations.messages.success.createXTraceIntegration"));
            setCreateCompanyStep("fakturaUz");
        } catch (error: any) {
            if (error?.errorFields) return;
            toast.error(getBackendErrorMessage(error, t("organizations.messages.error.createXTraceIntegration")));
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

            await dispatch(
                createCompanyFakturaUzIntegration({
                    companyId: activatedCompany.id,
                    username: String(values.username ?? "").trim(),
                    password: String(values.password ?? ""),
                    clientId: String(values.clientId ?? "").trim(),
                    clientSecret: String(values.clientSecret ?? "").trim(),
                })
            ).unwrap();

            toast.success(t("organizations.messages.success.createFakturaUzIntegration"));
        } catch (error: any) {
            if (error?.errorFields) return;
            toast.error(getBackendErrorMessage(error, t("organizations.messages.error.createFakturaUzIntegration")));
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
        const organization = tableOrganizations.find((o) => o.id === record.key) ?? null;
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
        setSearchQuery(value);
        if (value.trim().length > 0) {
            dispatch(searchOrganizations({ query: value, page: 1, limit: 10, sortOrder: 'asc' }));
        } else {
            dispatch(getAllOrganizations({ page: 1, limit: 10, sortOrder: 'asc' }));
        }
    };

    return (
        <MainLayout>
            {!isMobile && (
            <>
            <Heading title={t('organizations.title')} subtitle={t('organizations.subtitle')} totalAmount={`${dataTotal}`}>
                <div className="btns-group">
                    {canReadAudit && (
                        <CustomButton className='outline' onClick={() => navigate(`/audit-logs`)}>{t('navigation.audit')}</CustomButton>
                    )}
                    {canCreateCompany && (
                        <CustomButton onClick={() => handleModal('addCompany', true)}>{t('organizations.btnAdd')}</CustomButton>
                    )}
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
                            columns={OrganizationsTableColumns(t, handleDeleteOrganization, canDeleteCompany)}
                            data={OrganizationsData}
                            onRowClick={
                                canReadCompany
                                    ? (record) => handleRowClick('Company', 'retrieve', record)
                                    : undefined
                            }
                            pagination={{
                                current: dataPage || 1,
                                pageSize: dataLimit || 10,
                                total: dataTotal || 0,
                                showSizeChanger: { showSearch: false },
                                pageSizeOptions: ['10', '20', '30', '40', '50'],
                                locale: { items_per_page: '' },
                                onChange: (newPage, newLimit) => {
                                    if (searchQuery.trim().length > 0) {
                                        dispatch(searchOrganizations({
                                            query: searchQuery,
                                            page: newPage,
                                            limit: newLimit || dataLimit || 10,
                                            sortOrder: "asc"
                                        }));
                                        return;
                                    }
                                    dispatch(getAllOrganizations({ page: newPage, limit: newLimit || dataLimit || 10, sortOrder: "asc" }));
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
            <ModalWindow
                maskClosable={false}
                className="modal-large"
                titleAction={t('organizations.modalWindow.adding')}
                title={createCompanyStep === "xTrace"
                    ? t('organizations.integrations.xTrace.title')
                    : createCompanyStep === "fakturaUz"
                        ? t('organizations.integrations.fakturaUz.title')
                    : t('organizations.modalWindow.organization')}
                openModal={modalState.addCompany}
                closeModal={() => handleModal('addCompany', false)}
            >
                <div className="organization-create-steps">
                    <Steps
                        size="small"
                        current={createCompanyStepIndex[createCompanyStep]}
                        items={[
                            { title: t('organizations.integrations.steps.company') },
                            { title: t('organizations.integrations.steps.xTrace') },
                            { title: t('organizations.integrations.steps.fakturaUz') },
                        ]}
                    />
                </div>
                {createCompanyStep === "company" && (
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
                {createCompanyStep === "xTrace" && activatedCompany && (
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

                            {xTraceValidationData && (
                                <>
                                    <div className="detail-grid detail-grid-main organization-create-preview">
                                        <div className="detail-card detail-card-full organization-xtrace-validation-card">
                                            <h4>{t('organizations.integrations.receivedData')}</h4>
                                            <div className="detail-items">
                                                <div className="detail-item">
                                                    <span className="label inline-label">{t('organizations.addUserForm.label.expireDate')}</span>
                                                    <span className="detail-separator">:</span>
                                                    <span className="value">{dayjs(xTraceValidationData.expireDate).format('DD.MM.YYYY HH:mm')}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="label inline-label">{t('organizations.testFlag')}</span>
                                                    <span className="detail-separator">:</span>
                                                    <span className="value">
                                                        {xTraceValidationData.isTest ? (
                                                            <Tag className="test-flag" color="blue-inverse" style={{ margin: 0 }}>
                                                                {t('organizations.testFlag')}
                                                            </Tag>
                                                        ) : '-'}
                                                    </span>
                                                </div>
                                                <div className="organization-product-group-row">
                                                    <span className="label">{t('organizations.addUserForm.label.productGroup')}</span>
                                                    <div className="organization-product-group-pills">
                                                        {xTraceValidationData.productGroups.length > 0
                                                            ? xTraceValidationData.productGroups.map((productGroup) => {
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
                                className="outline"
                                onClick={() => setCreateCompanyStep("fakturaUz")}
                                disabled={xTraceCreateLoading}
                            >
                                {t('btn.skip')}
                            </CustomButton>
                            <CustomButton
                                onClick={handleCreateXTraceIntegration}
                                disabled={!isSuccessfulXTraceValidation || xTraceValidationLoading || xTraceCreateLoading}
                            >
                                {xTraceCreateLoading
                                    ? t('common.loading', { defaultValue: 'Loading' })
                                    : t('btn.save')}
                            </CustomButton>
                        </div>
                    </div>
                )}
                {createCompanyStep === "fakturaUz" && activatedCompany && (
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
                                            <span className={`status-badge ${fakturaUzIntegration.status}`}>
                                                {t(`statuses.${fakturaUzIntegration.status}`, { defaultValue: fakturaUzIntegration.status })}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="label inline-label">{t('organizations.testFlag')}</span>
                                            <span className="detail-separator">:</span>
                                            <span className="value">
                                                {fakturaUzIntegration.isTest ? (
                                                    <Tag className="test-flag" color="blue-inverse" style={{ margin: 0 }}>
                                                        {t('organizations.testFlag')}
                                                    </Tag>
                                                ) : '-'}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="label inline-label">{t('organizations.addUserForm.label.createdAt')}</span>
                                            <span className="detail-separator">:</span>
                                            <span className="value">{dayjs(fakturaUzIntegration.createdAt).format('DD.MM.YYYY HH:mm')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="btns-group organization-integration-actions">
                            {fakturaUzIntegration ? (
                                <CustomButton onClick={() => void finishCreateCompanyFlow()}>
                                    {t('btn.finish')}
                                </CustomButton>
                            ) : (
                                <>
                                    <CustomButton
                                        className="outline"
                                        onClick={() => void finishCreateCompanyFlow()}
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
                        <p className="subtitle">{modalState.companyData?.legalName} ? </p>
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

            </>
            )}
        </MainLayout>
  )
}

export default Organizations


