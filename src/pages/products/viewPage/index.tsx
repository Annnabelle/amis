import { Spin } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from 'app/store';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import CustomButton from 'shared/ui/button';
import { DetailCard, DetailGrid, DetailItems, RouteMetaChip } from 'shared/ui/details';
import { getProductById, getProductPackages } from 'entities/products/model';
import type { ProductPackage } from 'entities/products/types';
import { useNavigationBack } from 'shared/lib';
import { fetchReferencesByType } from 'entities/references/model';
import { endpointAccessMap } from 'shared/config/endpointAccessMap';
import { RequiredDataAlert } from 'entities/access/ui';
import { useCan } from 'entities/access/lib';
import './styles.sass';

type Lang = 'ru' | 'en' | 'uz';

const formatValue = (value: string | number | undefined | null) =>
    value === undefined || value === null || value === '' ? '-' : String(value);

const ProductsView = () => {
    const params = useParams();
    const orgId = params.orgId;
    const productId = params.id;
    const dispatch = useAppDispatch();
    const { t, i18n } = useTranslation();
    const navigateBack = useNavigationBack();
    const productById = useAppSelector((state) => state.products.productById);
    const isLoading = useAppSelector((state) => state.products.isLoading);
    const countryReferences =
        useAppSelector((state) => state.references.references.countryCode) ?? [];
    const productGroupReferences =
        useAppSelector((state) => state.references.references.productGroup) ?? [];
    const referencesError = useAppSelector((state) => state.references.error);
    const canReadPackages = useCan(endpointAccessMap.productsPackages);

    const currentLang = (i18n.language.split('-')[0] as Lang) || 'en';

    const [packages, setPackages] = useState<ProductPackage[]>([]);
    const [packagesLoading, setPackagesLoading] = useState(false);
    const [packagesError, setPackagesError] = useState<string | null>(null);

    if (!productId) {
        throw new Error('Company ID is required but not found in route params');
    }

    useEffect(() => {
        dispatch(fetchReferencesByType('countryCode'));
        dispatch(fetchReferencesByType('productGroup'));
    }, [dispatch]);

    useEffect(() => {
        if (productId) {
            dispatch(getProductById({ id: productId }));
        }
    }, [dispatch, productId]);

    useEffect(() => {
        if (!productId || !canReadPackages) {
            setPackages([]);
            return;
        }

        setPackagesLoading(true);
        setPackagesError(null);

        dispatch(getProductPackages({ id: productId })).then((result) => {
            if (getProductPackages.fulfilled.match(result)) {
                setPackages(result.payload);
            } else {
                setPackagesError(result.payload ?? t('products.packages.messages.error'));
            }
            setPackagesLoading(false);
        });
    }, [dispatch, productId, canReadPackages, t]);

    const getLocalizedTitle = (title: Record<string, string> | undefined, fallback: string) =>
        title?.[currentLang] ?? title?.ru ?? title?.en ?? fallback;

    const countryLabel = productById?.manufacturerCountry
        ? getLocalizedTitle(
              countryReferences.find((ref) => ref.alias === productById.manufacturerCountry)?.title,
              productById.manufacturerCountry
          )
        : '-';

    const productTypeLabel = productById?.productGroup
        ? getLocalizedTitle(
              productGroupReferences.find((ref) => ref.alias === productById.productGroup)?.title,
              productById.productGroup
          )
        : undefined;

    const getPackageTypeLabel = (type?: string) =>
        type ? t(`markingCodes.packageType.${type}`, { defaultValue: type }) : '-';

    const getPackageName = (pkg: ProductPackage) => getLocalizedTitle(pkg.name, pkg.code);

    if (isLoading || !productById || productById.id !== productId) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-96">
                    <Spin size="large" />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <RequiredDataAlert
                endpoints={[endpointAccessMap.referencesRead]}
                errors={[referencesError]}
            />
            <Heading title={t('products.view')}>
                <CustomButton onClick={() => navigateBack(`/organization/${orgId}/products`)}>
                    {t('btn.back')}
                </CustomButton>
            </Heading>
            <div className="box">
                <div className="box-container">
                    <div className="box-container-items">
                        <div className="route-overview-card">
                            <div className="route-overview-head">
                                <div className="route-overview-title">
                                    <span className="label">{t('products.addProductForm.label.name')}</span>
                                    <h2>{productById.name}</h2>
                                </div>
                            </div>
                            <div className="route-overview-meta">
                                <RouteMetaChip
                                    label={t('products.addProductForm.label.productType')}
                                    value={
                                        productTypeLabel ? (
                                            <span className="product-type-pill">{productTypeLabel}</span>
                                        ) : (
                                            '-'
                                        )
                                    }
                                />
                                <RouteMetaChip label={t('products.addProductForm.label.brand')} value={formatValue(productById.brand)} />
                                <RouteMetaChip label={t('products.addProductForm.label.manufacturerCountry')} value={countryLabel} />
                            </div>
                        </div>

                        <DetailGrid variant="main">
                            <DetailCard title={t('products.details.main')}>
                                <DetailItems
                                    items={[
                                        { label: t('products.addProductForm.label.shortName'), value: productById.shortName },
                                        { label: t('products.addProductForm.label.expiration'), value: formatValue(productById.expiration) },
                                    ]}
                                />
                            </DetailCard>

                            <DetailCard title={t('products.details.gtin')}>
                                <DetailItems
                                    items={[
                                        { label: t('products.gtin.unit'), value: formatValue(productById.gtin.unit) },
                                        { label: t('products.gtin.group'), value: formatValue(productById.gtin.group) },
                                        { label: t('products.gtin.box_lv_1'), value: formatValue(productById.gtin.box_lv_1) },
                                        { label: t('products.gtin.box_lv_2'), value: formatValue(productById.gtin.box_lv_2) },
                                    ]}
                                />
                            </DetailCard>
                        </DetailGrid>

                        <DetailGrid variant="main">
                            <DetailCard title={t('products.classification.title')}>
                                {productById.classification ? (
                                    <DetailItems
                                        items={[
                                            { label: t('products.classification.icps'), value: productById.classification.icps },
                                            { label: t('products.classification.name'), value: productById.classification.name },
                                            {
                                                label: t('products.classification.resolvedAt'),
                                                value: dayjs(productById.classification.resolvedAt).format('DD.MM.YYYY'),
                                            },
                                        ]}
                                    />
                                ) : (
                                    <p className="detail-note">{t('products.classification.empty')}</p>
                                )}
                            </DetailCard>

                            <DetailCard title={t('products.details.measurement')}>
                                <DetailItems
                                    items={[
                                        { label: t('products.addProductForm.label.aggregationQuantity'), value: formatValue(productById.aggregationQuantity) },
                                        { label: t('products.addProductForm.label.unit'), value: formatValue(productById.measurement?.unit) },
                                        { label: t('products.addProductForm.label.amount'), value: formatValue(productById.measurement?.amount) },
                                        { label: t('products.addProductForm.label.net'), value: formatValue(productById.weight?.net) },
                                        { label: t('products.addProductForm.label.gross'), value: formatValue(productById.weight?.gross) },
                                        { label: t('products.addProductForm.label.price'), value: formatValue(productById.price) },
                                    ]}
                                />
                            </DetailCard>
                        </DetailGrid>

                        {productById.description && (
                            <DetailGrid variant="single">
                                <DetailCard full title={t('products.details.description')}>
                                    <div className="detail-text-block">{productById.description}</div>
                                </DetailCard>
                            </DetailGrid>
                        )}

                        <DetailGrid variant="single">
                            <DetailCard full title={t('products.details.packages')}>
                                {!canReadPackages ? (
                                    <p className="detail-note">{t('products.packages.empty')}</p>
                                ) : packagesLoading ? (
                                    <Spin size="small" />
                                ) : packagesError ? (
                                    <p className="detail-note">{packagesError}</p>
                                ) : packages.length === 0 ? (
                                    <p className="detail-note">{t('products.packages.empty')}</p>
                                ) : (
                                    <DetailGrid variant="main" className="product-packages-grid">
                                        {packages.map((pkg) => (
                                            <DetailCard key={pkg.code} title={getPackageName(pkg)}>
                                                <DetailItems
                                                    items={[
                                                        { label: t('products.packages.fields.code'), value: pkg.code },
                                                        { label: t('products.packages.fields.type'), value: getPackageTypeLabel(pkg.type) },
                                                    ]}
                                                />
                                            </DetailCard>
                                        ))}
                                    </DetailGrid>
                                )}
                            </DetailCard>
                        </DetailGrid>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ProductsView;
