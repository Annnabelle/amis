import {Form, Input} from 'antd'
import { notify } from 'shared/lib/notify';
import { routes } from "shared/config/routes";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MainLayout from 'widgets/appShell'
import Heading from 'shared/ui/mainHeading'
import ComponentTable from 'shared/ui/table'
import CustomButton from 'shared/ui/button'
import ModalWindow from 'shared/ui/modalWindow'
import ProductCreateModal from 'features/productCreate/ui/productCreateModal'
import { FormActions } from 'shared/ui/form'
import { useGetCompanyByIdQuery } from 'entities/organization/api'
import {
    useCreateProductMutation,
    useDeleteProductMutation,
    useGetProductByIdQuery,
    useGetProductsQuery,
    useSearchProductsQuery,
} from 'entities/products/api'
import { ProductsTableColumns } from 'entities/products/ui/tableData/products'
import type { ProductTableDataType } from 'entities/products/ui/tableData/products/types'
import type { CreateProduct, Product } from 'entities/products/types'
import { useNavigate, useParams } from 'react-router-dom'
import {useGetReferencesByTypeQuery} from "entities/references/api";
import { DEFAULT_PAGINATION } from 'shared/config/pagination';
import {getApiErrorMessage} from "shared/api";
import type {LangKey} from "shared/lib/consts";
import type {MultiLanguage} from "shared/types/dtos";
import FilterBar from "shared/ui/filterBar/filterBar";
import FilterBarItem from "shared/ui/filterBar/filterBarItems";
import { useCan } from "entities/access/lib";
import { endpointAccessMap } from 'shared/config/endpointAccessMap';
import { CompanyImportStage } from 'entities/companyImport/types';
import { useDebouncedValue } from 'shared/lib/useDebouncedValue';
import { useSubmitGuard } from 'shared/lib/useSubmitGuard';
import CompanyImportStageButton from 'widgets/companyImport/stageButton';

const Products = () => {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate()
    const canReadProduct = useCan(endpointAccessMap.productsRead);
    const canCreateProduct = useCan(endpointAccessMap.productsCreate);
    const canUpdateProduct = useCan(endpointAccessMap.productsUpdate);
    const canDeleteProduct = useCan(endpointAccessMap.productsDelete);
    const canReadAudit = useCan(endpointAccessMap.auditList);
    const [pagination, setPagination] = useState({ ...DEFAULT_PAGINATION });
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedQuery = useDebouncedValue(searchQuery);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const isSearching = debouncedQuery.length > 0;
    const { data: productsPage } = useGetProductsQuery(
        { page: pagination.page, limit: pagination.limit, sortOrder: 'asc' },
        { skip: isSearching }
    );
    const { data: searchedProductsPage } = useSearchProductsQuery(
        { query: debouncedQuery, page: 1, limit: pagination.limit, sortOrder: 'asc' },
        { skip: !isSearching }
    );
    const [createProduct] = useCreateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();
    const shownProductsPage = isSearching ? searchedProductsPage : productsPage;
    const products = useMemo(
        () => shownProductsPage?.items ?? [],
        [shownProductsPage]
    );
    const dataPage = pagination.page;
    const dataLimit = pagination.limit;
    const dataTotal = shownProductsPage?.total ?? 0;
    const { data: productById } = useGetProductByIdQuery(
        { id: selectedProductId ?? '' },
        { skip: !selectedProductId || !canReadProduct }
    );
    const {
        data: countryReferences = [],
        isFetching: countryReferencesLoading,
        error: countryReferencesError,
    } = useGetReferencesByTypeQuery("countryCode");
    const {
        data: productGroupReferences = [],
        isFetching: productGroupReferencesLoading,
        error: productGroupReferencesError,
    } = useGetReferencesByTypeQuery("productGroup");
    type Lang = LangKey;
    const orgId = id
    const { isFetching: companyLoading, error: companyRequestError } =
        useGetCompanyByIdQuery({ id: id ?? '' }, { skip: !id });
    const companyError = companyRequestError
        ? getApiErrorMessage(companyRequestError, t('common.error'))
        : null;
    const referencesRequestError = countryReferencesError ?? productGroupReferencesError;
    const referencesError = referencesRequestError
        ? getApiErrorMessage(referencesRequestError, t('common.error'))
        : null;
    const referencesLoading = countryReferencesLoading || productGroupReferencesLoading;
    const referencesLoadingWithCompany = referencesLoading || companyLoading;

    const currentLang = (i18n.language as Lang) || 'en';
    const productGroupTitleByAlias = useMemo(() => {
        const map = new Map<string, string>();
        productGroupReferences.forEach((ref) => {
            const localizedTitle =
                ref.title?.[currentLang] ??
                ref.title?.ru ??
                ref.title?.en ??
                ref.alias;
            map.set(ref.alias, localizedTitle);
        });
        return map;
    }, [productGroupReferences, currentLang]);

    const companyProductGroups = useMemo(() => {
        return productGroupReferences;
    }, [productGroupReferences])

    if (!id) {
        throw new Error("Company ID is required but not found in route params");
    }

    const [form] = Form.useForm()

    useEffect(() => {
        if (productById) {
            form.setFieldsValue({
            name: productById.name,
            shortName: productById.shortName,
            description: productById.description,
            gtin: productById.gtin,
            icps: productById.classification?.icps,
            productType: productById.productGroup,
            aggregationQuantity: productById.aggregationQuantity,
            unit: productById.measurement?.unit,
            amount: productById.measurement?.amount,
            net: productById.weight?.net,
            gross: productById.weight?.gross,
            price: productById.price,
            })
        }
    }, [productById, form])

   const ProductsData = useMemo(() => {
        return products.map((product, index) => ({
            key: product.id,
            number: index + 1,
            name: product.name,
            productGroup: product.productGroup
              ? productGroupTitleByAlias.get(product.productGroup) ?? product.productGroup
              : "",
            gtin: product.gtin.unit,
            // status: product,
            action: 'Действие',
        }))
    }, [products, productGroupTitleByAlias]);

    const [modalState, setModalState] = useState<{
        addProduct: boolean;
        editProduct: boolean;
        retrieveProduct: boolean;
        deleteProduct: boolean;
        productData: Product | null; 
      }>({
        addProduct: false,
        editProduct: false,
        retrieveProduct: false,
        deleteProduct: false,
        productData: null, 
      });

    const handleModal = (modalName: string, value: boolean) => {
        setModalState((prev) => ({...prev, [modalName] : value}));
    }

    const handleRegisterProduct = async (values: CreateProduct) => {
        try {
            const newData = {
                ...values,
                companyId: id,
                expiration: Number(values.expiration), // 👈 здесь преобразование
            };

            await createProduct(newData).unwrap();

            notify.success(t("products.messages.success.createProduct"));

            form.resetFields();

            // даём пользователю увидеть тост об успехе, прежде чем закрыть модалку;
            // ожидание внутри обработчика держит кнопку заблокированной всё это время
            await new Promise((resolve) => setTimeout(resolve, 1000));
            handleModal("addProduct", false);

        } catch (error: unknown) {
            notify.error(
                getApiErrorMessage(error, t('products.messages.error.createProduct'))
            );
        }
    };

    const { isSubmitting: isCreatingProduct, onSubmit: submitRegisterProduct } =
        useSubmitGuard(handleRegisterProduct);



    const handleRowClick = (type: 'Product', action: 'retrieve' | 'edit' | 'delete', record: ProductTableDataType) => {
        if (type === 'Product'){
            const product = products.find((user) => user.id === record.key) ?? null
            setSelectedProductId(record.key);

            setModalState((prev) => ({
                ...prev,
                [`${action}${type}`]: true,
                productData: product
            }));
            if (action === "retrieve") {
                navigate(routes.product(orgId, record.key));
            }
            if(action === 'edit'){
                navigate(routes.productEdit(orgId, record.key))
            }
        }
    };


    const handleDeleteProduct = (record: ProductTableDataType) => {
        const product = products.find((u) => u.id === record.key) ?? null;
        if (product) {
            setSelectedProductId(product.id);
            setModalState((prev) => ({
            ...prev,
            deleteProduct: true,
            productData: product,
            }));
        }
    };

    const confirmDeleteProduct = async () => {
        if (!modalState.productData) return;

        try {
            // Список перезапросится сам: мутация инвалидирует тег товара.
            await deleteProduct({ id: modalState.productData.id }).unwrap();
            notify.success(t('products.messages.success.deleteProduct'));
            handleModal("deleteProduct", false);
        } catch (err) {
            notify.error(
                getApiErrorMessage(err, t('products.messages.error.deleteProduct'))
            );
        }
    };


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value.trim());
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const getTitle = (title: MultiLanguage | undefined, fallback: string = "") => {
        return (
            title?.[currentLang] ??
            title?.ru ??
            title?.en ??
            fallback
        );
    };

    return (
        <MainLayout>
            <Heading title={t('products.title')} subtitle={t('users.subtitle')} totalAmount={`${dataTotal}`}>
                <FormActions>
                    <CompanyImportStageButton companyId={orgId} stage={CompanyImportStage.Products} />
                    {canReadAudit && (
                        <CustomButton variant='outline' onClick={() => navigate(routes.auditLogs())}>{t('navigation.audit')}</CustomButton>
                    )}
                    {canCreateProduct && (
                        <CustomButton onClick={() => handleModal('addProduct', true)}>{t('products.btnAdd')}</CustomButton>
                    )}
                </FormActions>
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
                                    className="input"
                                    placeholder={t('search.byName')}
                                    suffix={<SearchOutlined />}
                                    allowClear
                                    onChange={handleSearchChange}
                                />
                            </FilterBarItem>
                        </FilterBar>
                    </div>
                </div>
                <div className="box-container-items">
                    <ComponentTable<ProductTableDataType>
                        columns={ProductsTableColumns(
                            t,
                            handleRowClick,
                            handleDeleteProduct,
                            {
                                canUpdate: canUpdateProduct,
                                canDelete: canDeleteProduct,
                            }
                        )}
                        data={ProductsData}
                        onRowClick={
                            canReadProduct
                                ? (record) => handleRowClick('Product', 'retrieve', record)
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
        <ProductCreateModal
            form={form}
            open={modalState.addProduct}
            onClose={() => handleModal('addProduct', false)}
            onSubmit={submitRegisterProduct}
            isCreating={isCreatingProduct}
            productGroups={companyProductGroups}
            countries={countryReferences}
            language={currentLang}
            getTitle={getTitle}
            isReferencesLoading={referencesLoadingWithCompany}
            referencesError={referencesError}
            companyError={companyError}
        />
        <ModalWindow
            titleAction={t('products.modalWindow.deletion')}
            title={t('products.modalWindow.product')}
            openModal={modalState.deleteProduct}
            closeModal={() => handleModal("deleteProduct", false)}
            classDangerName='danger-title'
            >
            <div className="delete-modal">
                <div className="delete-modal-title">
                    <p className='title'>
                        {t('products.deleteUserQuestion')}: {" "}
                    </p>
                    <p className="subtitle">{modalState.productData?.name} ? </p>
                </div>
                <div className="delete-modal-btns">
                    <CustomButton variant="danger" onClick={confirmDeleteProduct}>
                        {t('btn.delete')}
                    </CustomButton>
                    <CustomButton onClick={() => handleModal("deleteProduct", false)} variant="outline">
                        {t('btn.cancel')}
                    </CustomButton>
                </div>
            </div>
        </ModalWindow>

    </MainLayout>
  )
}

export default Products




