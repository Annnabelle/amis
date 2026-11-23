import { Input } from 'antd'
import { notify } from 'shared/lib/notify';
import { routes } from "shared/config/routes";
import { SearchOutlined } from "@ant-design/icons";
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MainLayout from 'widgets/appShell'
import Heading from 'shared/ui/mainHeading'
import ComponentTable from 'shared/ui/table'
import {
    useDeleteCompanyMutation,
    useGetCompaniesQuery,
    useSearchCompaniesQuery,
} from 'entities/organization/api'
import { OrganizationsTableColumns } from 'entities/organization/ui/tableData/organizations'
import type { OrganizationTableDataType } from 'entities/organization/ui/tableData/organizations/types'
import type {Company} from 'entities/organization/types'
import CustomButton from 'shared/ui/button'
import ModalWindow from 'shared/ui/modalWindow'
import CompanyCreateModal from 'features/companyCreate/ui/companyCreateModal'
import { formatCompanyContacts, formatEmployeeName } from 'entities/organization/lib/formatCompany'
import { useNavigate } from 'react-router-dom'
import FilterBar from "shared/ui/filterBar/filterBar";
import { DEFAULT_PAGINATION } from 'shared/config/pagination';
import FilterBarItem from "shared/ui/filterBar/filterBarItems";
import { useDebouncedValue } from 'shared/lib/useDebouncedValue';
import { useIsMobile } from 'shared/lib/useIsMobile';
import { useCan } from 'entities/access/lib';
import { endpointAccessMap } from 'shared/config/endpointAccessMap';
import { getApiErrorMessage } from 'shared/api';
import '../styles.sass';


const Organizations = () => {
    const navigate = useNavigate()
    const { t } = useTranslation();
    const canReadCompany = useCan(endpointAccessMap.companiesRead);
    const canListCompanies = useCan(endpointAccessMap.companiesList);
    const canCreateCompany = useCan(endpointAccessMap.companiesCreate);
    const canDeleteCompany = useCan(endpointAccessMap.companiesDelete);
    const canReadAudit = useCan(endpointAccessMap.auditList);

    const isMobile = useIsMobile();
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedQuery = useDebouncedValue(searchQuery);
    const [pagination, setPagination] = useState({ ...DEFAULT_PAGINATION });
    const isSearching = debouncedQuery.trim().length > 0;
    const { data: companiesPage } = useGetCompaniesQuery(
        { page: pagination.page, limit: pagination.limit, sortOrder: 'asc' },
        { skip: isSearching || (isMobile && !canListCompanies) }
    );
    const { data: searchedCompaniesPage } = useSearchCompaniesQuery(
        {
            query: debouncedQuery,
            page: pagination.page,
            limit: pagination.limit,
            sortOrder: 'asc',
        },
        { skip: !isSearching }
    );
    const [deleteCompany] = useDeleteCompanyMutation();
    const shownCompaniesPage = isSearching ? searchedCompaniesPage : companiesPage;
    const organizations = useMemo(
        () => companiesPage?.items ?? [],
        [companiesPage]
    );
    const searchedOrganizations = useMemo(
        () => searchedCompaniesPage?.items ?? [],
        [searchedCompaniesPage]
    );
    const dataPage = pagination.page;
    const dataLimit = pagination.limit;
    const dataTotal = shownCompaniesPage?.total ?? 0;

    const tableOrganizations = useMemo(() => {
        return isSearching ? searchedOrganizations : organizations;
    }, [isSearching, organizations, searchedOrganizations]);

    const OrganizationsData = useMemo<OrganizationTableDataType[]>(() => {
        return tableOrganizations.map((organization, index) => ({
            key: organization.id,
            number: index + 1,
            displayName: organization.displayName,
            tin: organization.tin,
            director: formatEmployeeName(organization.responsibleEmployees.director),
            legalName: organization.legalName,
            contacts: formatCompanyContacts(organization.contacts),
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
        companyData: Company | null; 
      }>({
        addCompany: false,
        editCompany: false,
        retrieveCompany: false,
        deleteCompany: false,
        companyData: null, 
      });

    const handleModal = (modalName: string, value: boolean) => {
        setModalState((prev) => ({ ...prev, [modalName]: value }));
    };

    const handleRowClick = (type: 'Company', action: 'retrieve' | 'edit' | 'delete', record: OrganizationTableDataType) => {
        if (type === "Company" && action === "retrieve") {
            navigate(routes.company(record.key)); 
        }
        if (action === "edit") {
            navigate(routes.companyEdit(record.key));
        }
    };

    const handleDeleteOrganization = (record: OrganizationTableDataType) => {
        const organization = tableOrganizations.find((o) => o.id === record.key) ?? null;
            if (organization) {
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
            // Список перезапросится сам: мутация инвалидирует тег компании.
            await deleteCompany({ id: modalState.companyData.id }).unwrap();
            notify.success(t('organizations.messages.success.deleteUser'));
            handleModal("deleteCompany", false);
        } catch (err) {
            notify.error(
                getApiErrorMessage(err, t('organizations.messages.error.deleteUser'))
            );
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    return (
        <MainLayout>
            {!isMobile && (
            <>
            <Heading title={t('organizations.title')} subtitle={t('organizations.subtitle')} totalAmount={`${dataTotal}`}>
                <div className="btns-group">
                    {canReadAudit && (
                        <CustomButton variant='outline' onClick={() => navigate(routes.auditLogs())}>{t('navigation.audit')}</CustomButton>
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
                                    {/* Без Form.Item: формы здесь нет, а он тянет её контекст. */}
                                    <Input
                                        size="large"
                                        placeholder={t('search.byOrganization')}
                                        suffix={<SearchOutlined />}
                                        allowClear
                                        onChange={handleSearchChange}
                                    />
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
                                onChange: (newPage, newLimit) =>
                                    setPagination((prev) => ({
                                        page: newPage,
                                        limit: newLimit || prev.limit,
                                    })),
                            }}
                        />
                    </div>
                </div>
            </div>
            <CompanyCreateModal
                open={modalState.addCompany}
                onClose={() => handleModal('addCompany', false)}
            />
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
                        <CustomButton variant="danger" onClick={confirmDeleteOrganization}>
                            {t('btn.delete')}
                        </CustomButton>
                        <CustomButton onClick={() => handleModal("deleteUser", false)} variant="outline">
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


