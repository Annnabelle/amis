import { DatePicker, Form, Input, InputNumber, Radio, Select, Spin, Tooltip } from 'antd';
import { notify } from 'shared/lib/notify';
import { routes } from "shared/config/routes";
import { CloseOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { debugLog } from 'shared/lib/debugLog';
import MainLayout from 'widgets/appShell';
import Heading from 'shared/ui/mainHeading';
import CustomButton from 'shared/ui/button';
import FormComponent from 'shared/ui/formComponent';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCreateSalesOrderMutation } from 'entities/salesOrders/api';
import {
  mapSalesOrderFormToCreateDto,
  SalesOrderContractError,
  type SalesOrderFormValues,
} from 'entities/salesOrders/mappers';
import {
  useLazyGetProductPackagesQuery,
  useSearchProductsQuery,
} from 'entities/products/api';
import type { ProductPackage } from 'entities/products/types';
import {
  useLazyGetCompanyByIdQuery,
  useLazyGetCompanyByTinQuery,
} from 'entities/organization/api';
import {
  useGetDistrictsByRegionQuery,
  useGetRegionsQuery,
  useLazyGetDistrictsByRegionQuery,
} from 'entities/references/api';
import { useSubmitGuard } from 'shared/lib/useSubmitGuard';
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { endpointAccessMap } from 'shared/config/endpointAccessMap';
import { RequiredDataAlert } from 'entities/access/ui';
import { isLanguage, SalesOrderPaymentMethod, SalesOrderPriorities } from 'shared/types/dtos';
import { SalesOrderDeliveryType } from '@edem2000/amis.contracts';
import type { Company } from 'entities/organization/types';
import type { Reference } from 'entities/references/types';
import { getApiErrorMessage } from 'shared/api';
import AddressFields from 'features/salesOrderCreate/ui/addressFields';
import {
  allowOnlyDigitsKeyDown,
  allowOnlyDigitsPaste,
  decimalParser,
  digitsOnlyParser,
} from 'features/salesOrderCreate/lib/numericInput';
import {
  calculateDeliveryCost,
  calculateItemsTotal,
  formatAmount,
  formatDeliveryCost,
} from 'features/salesOrderCreate/lib/orderTotals';
import {
  buildGeocodeAddress,
  getReferenceDebugInfo,
  getReferenceLabel,
  getReferenceValue,
  normalizeReferenceText,
  resolveReferenceByCandidates,
  resolveReferenceValue,
} from 'features/salesOrderCreate/lib/referenceMatch';
import {
  calculateYandexRouteDistanceKm,
  type YandexResolvedAddress,
} from 'shared/lib/yandexMaps';

const TIN_LENGTH = 9;

const SalesOrdersCreate = () => {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const { t, i18n } = useTranslation();
  const [productQuery, setProductQuery] = useState('');
  const {
    data: productsPage,
    isFetching: productsLoading,
    error: productsRequestError,
  } = useSearchProductsQuery(
    { query: productQuery, page: 1, limit: 10, sortOrder: 'asc' },
    { skip: !orgId }
  );
  const products = useMemo(() => productsPage?.items ?? [], [productsPage]);
  const [loadPackages] = useLazyGetProductPackagesQuery();
  const productsError = productsRequestError
    ? getApiErrorMessage(productsRequestError, t('common.error'))
    : null;
  const {
    data: regions = [],
    isFetching: referencesLoading,
    error: regionsError,
  } = useGetRegionsQuery(undefined, { skip: !orgId });
  const [loadDistricts] = useLazyGetDistrictsByRegionQuery();
  const [createSalesOrder] = useCreateSalesOrderMutation();
  const [findCompanyByTin] = useLazyGetCompanyByTinQuery();
  const [loadCompanyById] = useLazyGetCompanyByIdQuery();
  const [form] = Form.useForm<SalesOrderFormValues>();
  const [isSearchingCompany, setIsSearchingCompany] = useState(false);
  const [isCompanyFound, setIsCompanyFound] = useState(false);
  const [companyLookupError, setCompanyLookupError] = useState<string | null>(null);
  const [senderCompany, setSenderCompany] = useState<Company | null>(null);
  const [districtsLoadingByOwner, setDistrictsLoadingByOwner] = useState({
    sender: false,
    customer: false,
  });
  const [mapGeocodeRequestKey, setMapGeocodeRequestKey] = useState({
    sender: 0,
    customer: 0,
  });
  const [forcedMapGeocodeAddress, setForcedMapGeocodeAddress] = useState<{
    sender?: string;
    customer?: string;
  }>({});
  const [deliveryDistanceSource, setDeliveryDistanceSource] = useState<"route" | "geo" | null>(null);
  const [packagesByProductId, setPackagesByProductId] = useState<
    Record<string, { loading: boolean; loaded: boolean; options: ProductPackage[] }>
  >({});
  const companyLookupRequestRef = useRef(0);
  const currentLanguage = isLanguage(i18n.language) ? i18n.language : 'ru';
  const listPath = orgId
    ? routes.salesOrders(orgId)
    : '/sales-orders';

  const items = Form.useWatch('items', form);
  const senderRegionId = Form.useWatch(["sender", "addressDetails", "regionId"], form);
  const customerRegionId = Form.useWatch(["customer", "addressDetails", "regionId"], form);
  const senderDistrictId = Form.useWatch(["sender", "addressDetails", "districtId"], form);
  const customerDistrictId = Form.useWatch(["customer", "addressDetails", "districtId"], form);
  const senderAddress = Form.useWatch(["sender", "addressDetails", "address"], form);
  const customerAddress = Form.useWatch(["customer", "addressDetails", "address"], form);
  const senderLocation = Form.useWatch(["sender", "addressDetails", "location"], form);
  const customerLocation = Form.useWatch(["customer", "addressDetails", "location"], form);
  const deliveryCostPerDistanceUnit = Form.useWatch(["delivery", "costPerDistanceUnit"], form);
  const deliveryTotalDistance = Form.useWatch(["delivery", "totalDistance"], form);
  const { data: senderDistricts = [] } = useGetDistrictsByRegionQuery(
    senderRegionId ?? '',
    { skip: !senderRegionId }
  );
  const { data: customerDistricts = [] } = useGetDistrictsByRegionQuery(
    customerRegionId ?? '',
    { skip: !customerRegionId }
  );
  const referencesError = regionsError
    ? getApiErrorMessage(regionsError, t('common.error'))
    : null;

  const totalAmount = useMemo(() => calculateItemsTotal(items), [items]);
  const formattedTotalAmount = useMemo(() => formatAmount(totalAmount), [totalAmount]);
  const deliveryTotalCost = useMemo(
    () => calculateDeliveryCost(deliveryCostPerDistanceUnit, deliveryTotalDistance),
    [deliveryCostPerDistanceUnit, deliveryTotalDistance]
  );
  const formattedDeliveryTotalCost = useMemo(
    () => formatDeliveryCost(deliveryTotalCost),
    [deliveryTotalCost]
  );

  const normalizeTin = (value: string) => value.replace(/\D/g, '').slice(0, TIN_LENGTH);

  const senderGeocodeAddress = buildGeocodeAddress({
    address: senderAddress,
    regionId: senderRegionId,
    districtId: senderDistrictId,
    regions,
    districts: senderDistricts,
    language: currentLanguage,
  });
  const customerGeocodeAddress = buildGeocodeAddress({
    address: customerAddress,
    regionId: customerRegionId,
    districtId: customerDistrictId,
    regions,
    districts: customerDistricts,
    language: currentLanguage,
  });

  /** Подпись справочника на языке интерфейса. */
  const referenceLabel = (reference: Reference) => getReferenceLabel(reference, currentLanguage);

  /** Область и район без улицы: такой запрос геокодер отдаёт центром территории. */
  const buildAreaGeocodeAddress = (
    regionId?: string,
    districtId?: string,
    districts: Reference[] = []
  ) =>
    buildGeocodeAddress({ regionId, districtId, regions, districts, language: currentLanguage });

  const getCompanyAddressDetails = useCallback(async (company: Company) => {
    const address = company.address.address?.trim();
    const regionId = resolveReferenceValue(regions, company.address.region);

    if (!address && !regionId) return undefined;

    // true — отдать значение из кеша, если район этого региона уже запрашивали.
    const districts = regionId
      ? await loadDistricts(regionId, true).unwrap()
      : [];
    const districtId = resolveReferenceValue(districts, company.address.district);

    return {
      address,
      regionId,
      districtId,
    };
  }, [loadDistricts, regions]);

  const loadDistrictsForRegion = async (
    regionId: string,
    owner?: "sender" | "customer"
  ) => {
    if (owner) {
      setDistrictsLoadingByOwner((prev) => ({ ...prev, [owner]: true }));
    }

    try {
      return await loadDistricts(regionId, true).unwrap();
    } finally {
      if (owner) {
        setDistrictsLoadingByOwner((prev) => ({ ...prev, [owner]: false }));
      }
    }
  };

  const requestMapGeocode = (owner: "sender" | "customer", forcedAddress?: string) => {
    setForcedMapGeocodeAddress((prev) => ({ ...prev, [owner]: forcedAddress }));
    setMapGeocodeRequestKey((prev) => ({ ...prev, [owner]: prev[owner] + 1 }));
  };

  const handleAddressRegionChange = (owner: "sender" | "customer", regionId: string) => {
    form.setFieldValue([owner, "addressDetails", "districtId"], undefined);
    form.setFieldValue([owner, "addressDetails", "location"], undefined);
    void loadDistrictsForRegion(regionId, owner);
    requestMapGeocode(owner, buildAreaGeocodeAddress(regionId));
  };

  const handleAddressDistrictChange = (owner: "sender" | "customer", districtId?: string) => {
    form.setFieldValue([owner, "addressDetails", "location"], undefined);
    const regionId = owner === "sender" ? senderRegionId : customerRegionId;
    const districts = owner === "sender" ? senderDistricts : customerDistricts;
    requestMapGeocode(owner, buildAreaGeocodeAddress(regionId, districtId, districts));
  };

  const applyMapAddressSelection = async (
    owner: "sender" | "customer",
    selectedAddress: YandexResolvedAddress
  ) => {
    debugLog.group(`[SalesOrdersCreate] resolve map address references: ${owner}`);
    debugLog.info("selected address from map", selectedAddress);
    debugLog.info("available regions", regions.map(getReferenceDebugInfo));

    const region = resolveReferenceByCandidates(regions, selectedAddress.regionCandidates);
    debugLog.info("region search", {
      rawCandidates: selectedAddress.regionCandidates,
      normalizedCandidates: selectedAddress.regionCandidates.map(normalizeReferenceText),
      matched: region ? getReferenceDebugInfo(region) : undefined,
    });

    if (!region) {
      debugLog.warn("result", "region was not found in references");
      debugLog.groupEnd();
      return;
    }

    const regionId = getReferenceValue(region);
    debugLog.info("region result", { regionId });

    try {
      const currentDistricts = await loadDistrictsForRegion(regionId);
      const district = resolveReferenceByCandidates(currentDistricts, selectedAddress.districtCandidates);
      const districtId = district ? getReferenceValue(district) : undefined;

      debugLog.info("available districts", currentDistricts.map(getReferenceDebugInfo));
      debugLog.info("district search", {
        rawCandidates: selectedAddress.districtCandidates,
        normalizedCandidates: selectedAddress.districtCandidates.map(normalizeReferenceText),
        matched: district ? getReferenceDebugInfo(district) : undefined,
      });

      form.setFieldValue([owner, "addressDetails", "regionId"], regionId);
      form.setFieldValue([owner, "addressDetails", "districtId"], districtId);
      if (selectedAddress.address) {
        form.setFieldValue([owner, "addressDetails", "address"], selectedAddress.address);
      }

      debugLog.info("form fields set", {
        owner,
        regionId,
        districtId,
        address: selectedAddress.address,
      });

      if (!districtId) {
        debugLog.warn("result", "district was not found in references");
      } else {
        debugLog.info("result", "region and district were resolved");
      }
    } catch (error) {
      console.error("failed to resolve district references", error);
    } finally {
      debugLog.groupEnd();
    }
  };

  const handleTinChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const normalized = normalizeTin(event.target.value);
    const requestId = ++companyLookupRequestRef.current;

    form.setFieldsValue({
      customer: {
        id: undefined,
        tin: normalized,
        name: undefined,
        addressDetails: undefined,
      },
    });
    setIsCompanyFound(false);
    setCompanyLookupError(null);

    if (normalized.length !== TIN_LENGTH || /^0+$/.test(normalized)) {
      setIsSearchingCompany(false);
      return;
    }

    setIsSearchingCompany(true);

    try {
      const company = await findCompanyByTin(normalized).unwrap();

      if (requestId !== companyLookupRequestRef.current) return;

      if (!company) {
        setIsSearchingCompany(false);
        notify.error(t('salesOrders.validation.customerCompanyNotFound'));
        return;
      }

      form.setFieldsValue({
        customer: {
          id: company.id,
          tin: normalized,
          name: company.name[currentLanguage] || company.displayName || company.legalName,
          addressDetails: await getCompanyAddressDetails(company),
        },
      });
      setIsCompanyFound(true);
      setIsSearchingCompany(false);
    } catch (error: unknown) {
      if (requestId === companyLookupRequestRef.current) {
        setIsSearchingCompany(false);
        const message = getApiErrorMessage(error, t('common.error'));
        setCompanyLookupError(message);
        notify.error(message);
      }
    }
  };

  useEffect(() => {
    if (!orgId) return;

    loadCompanyById({ id: orgId })
      .unwrap()
      .then((company) => {
        setSenderCompany(company);
        form.setFieldsValue({
          sender: {
            tin: company.tin,
            name: company.name[currentLanguage] || company.displayName || company.legalName,
          },
        });
      })
      .catch(() => undefined);
  }, [currentLanguage, form, loadCompanyById, orgId]);

  useEffect(() => {
    if (!senderCompany || regions.length === 0) return;

    getCompanyAddressDetails(senderCompany)
      .then((addressDetails) => {
        form.setFieldsValue({
          sender: {
            tin: senderCompany.tin,
            name: senderCompany.name[currentLanguage] || senderCompany.displayName || senderCompany.legalName,
            addressDetails,
          },
        });
      })
      .catch(() => undefined);
  }, [currentLanguage, form, getCompanyAddressDetails, regions.length, senderCompany]);

  useEffect(() => {
    const senderLatitude = Number(senderLocation?.latitude);
    const senderLongitude = Number(senderLocation?.longitude);
    const customerLatitude = Number(customerLocation?.latitude);
    const customerLongitude = Number(customerLocation?.longitude);

    if (
      !Number.isFinite(senderLatitude) ||
      !Number.isFinite(senderLongitude) ||
      !Number.isFinite(customerLatitude) ||
      !Number.isFinite(customerLongitude)
    ) {
      return;
    }

    let isActive = true;

    calculateYandexRouteDistanceKm(
      { latitude: senderLatitude, longitude: senderLongitude },
      { latitude: customerLatitude, longitude: customerLongitude }
    ).then((result) => {
      if (isActive && result !== undefined) {
        debugLog.info("[SalesOrdersCreate] set delivery total distance", result);
        form.setFieldValue(["delivery", "totalDistance"], result.distance);
        setDeliveryDistanceSource(result.source);
      }
    });

    return () => {
      isActive = false;
    };
  }, [
    customerLocation?.latitude,
    customerLocation?.longitude,
    form,
    senderLocation?.latitude,
    senderLocation?.longitude,
  ]);

  const handleProductSearch = (value: string) => {
    if (!orgId || !value.trim()) return;

    setProductQuery(value);
  };

  const loadProductPackages = async (productId: string): Promise<ProductPackage[]> => {
    const existing = packagesByProductId[productId];
    if (existing?.loaded) {
      return existing.options;
    }
    if (existing?.loading) {
      return [];
    }

    setPackagesByProductId((prev) => ({
      ...prev,
      [productId]: { loading: true, loaded: false, options: prev[productId]?.options ?? [] },
    }));

    try {
      const options = await loadPackages({ id: productId }, true).unwrap();

      setPackagesByProductId((prev) => ({
        ...prev,
        [productId]: { loading: false, loaded: true, options },
      }));

      return options;
    } catch (error) {
      setPackagesByProductId((prev) => ({
        ...prev,
        [productId]: { loading: false, loaded: false, options: [] },
      }));
      notify.error(getApiErrorMessage(error, t('common.error')));

      return [];
    }
  };

  const handleItemProductChange = (fieldName: number, productId?: string) => {
    form.setFieldValue(['items', fieldName, 'packageCode'], undefined);
    if (productId) {
      void loadProductPackages(productId).then((options) => {
        if (options.length > 0) {
          form.setFieldValue(['items', fieldName, 'packageCode'], options[0].code);
        }
      });
    }
  };

  const getPackageLabel = (pkg: ProductPackage) =>
    pkg.name?.[currentLanguage] || pkg.name?.ru || pkg.name?.en || pkg.code;

  const handleCreateSalesOrder = async (values: SalesOrderFormValues) => {
    if (!orgId) {
      notify.error(t('salesOrders.validation.companyRequired'));
      return;
    }

    if (!isCompanyFound) {
      notify.error(t('salesOrders.validation.customerCompanyNotFound'));
      return;
    }

    let payload;
    try {
      payload = mapSalesOrderFormToCreateDto(values);
    } catch (error: unknown) {
      if (error instanceof SalesOrderContractError) {
        notify.error(t('salesOrders.createValidation.contractDetailsIncomplete'));
        return;
      }
      throw error;
    }

    try {
      await createSalesOrder(payload).unwrap();
      notify.success(t('salesOrders.messages.success.create'));
      form.resetFields();
      navigate(listPath);
    } catch (error: unknown) {
      notify.error(
        getApiErrorMessage(error, t('common.error'))
      );
    }
  };

  const { isSubmitting, onSubmit } = useSubmitGuard(handleCreateSalesOrder);

  return (
    <MainLayout>
      <Heading title={t('salesOrders.title')} subtitle={t('common.create')} />
      <RequiredDataAlert
        endpoints={[
          endpointAccessMap.companiesByTin,
          endpointAccessMap.companiesRead,
          endpointAccessMap.productsList,
          endpointAccessMap.productsPackages,
          endpointAccessMap.referencesRead,
        ]}
        errors={[companyLookupError, productsError, referencesError]}
      />
      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <FormComponent
              form={form}
              onFinish={onSubmit}
              initialValues={{
                fulfillment: {
                  priority: 'normal',
                  paymentMethod: SalesOrderPaymentMethod.Transfer,
                },
                delivery: {
                  type: SalesOrderDeliveryType.SellerToBuyer,
                },
              }}
            >
              <div className="sales-order-address-columns">
                <div className="sales-order-address-column">
              <div className="form-divider-title">
                <h4 className="title">{t('salesOrders.createSections.sender', { defaultValue: 'Sender' })}</h4>
              </div>
              <div className="form-inputs form-inputs-organization">
                <Form.Item
                  className="input"
                  name={["sender", "tin"]}
                  label={t('salesOrders.createFields.companyTin', { defaultValue: 'TIN' })}
                >
                  <Input className="input" size="large" disabled />
                </Form.Item>
                <Form.Item
                  className="input"
                  name={["sender", "name"]}
                  label={t('salesOrders.createFields.companyName', { defaultValue: 'Company name' })}
                >
                  <Input className="input" size="large" disabled />
                </Form.Item>
              </div>
              <AddressFields
                owner="sender"
                form={form}
                regions={regions}
                districts={senderDistricts}
                regionsLoading={referencesLoading}
                districtsLoading={districtsLoadingByOwner.sender}
                regionId={senderRegionId}
                address={senderAddress}
                location={senderLocation}
                geocodeAddress={senderGeocodeAddress}
                geocodeRequestKey={mapGeocodeRequestKey.sender}
                forcedGeocodeAddress={forcedMapGeocodeAddress.sender}
                addressLabelKey="salesOrders.createFields.address"
                addressPlaceholderKey="salesOrders.createPlaceholders.address"
                addressRequiredKey="salesOrders.createValidation.addressRequired"
                locationLabelKey="salesOrders.fields.senderLocation"
                wideRowClassName="form-inputs"
                referenceLabel={referenceLabel}
                onRegionChange={(regionId) => handleAddressRegionChange("sender", regionId)}
                onDistrictChange={(districtId) => handleAddressDistrictChange("sender", districtId)}
                onAddressSelect={(address) => {
                  void applyMapAddressSelection("sender", address);
                }}
                onForcedGeocodeComplete={() => {
                  setForcedMapGeocodeAddress((prev) => ({ ...prev, sender: undefined }));
                }}
              />
                </div>
                <div className="sales-order-address-column">
              <div className="form-divider-title">
                <h4 className="title">{t('salesOrders.createSections.recipient', { defaultValue: 'Получатель' })}</h4>
              </div>
              <div className="form-inputs form-inputs-organization">
                <Form.Item
                  name={["customer", "id"]}
                  hidden
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  className="input"
                  name={["customer", "tin"]}
                  label={t('salesOrders.createFields.companyTin', { defaultValue: 'ИНН компании' })}
                  rules={[
                    {
                      required: true,
                      message: t('salesOrders.validation.customerTinRequired'),
                    },
                    {
                      validator: async (_, value) => {
                        const tin = String(value ?? '').trim();

                        if (!tin) {
                          return Promise.resolve();
                        }

                        if (!/^\d+$/.test(tin)) {
                          return Promise.reject(new Error(t('salesOrders.validation.customerTinDigitsOnly')));
                        }

                        if (tin.length !== TIN_LENGTH) {
                          return Promise.reject(new Error(t('salesOrders.validation.customerTinLength')));
                        }

                        if (/^0+$/.test(tin)) {
                          return Promise.reject(new Error(t('salesOrders.validation.customerTinInvalid')));
                        }

                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    className="input"
                    size="large"
                    maxLength={TIN_LENGTH}
                    inputMode="numeric"
                    autoComplete="off"
                    onChange={handleTinChange}
                    onKeyDown={allowOnlyDigitsKeyDown(TIN_LENGTH)}
                    onPaste={allowOnlyDigitsPaste(TIN_LENGTH)}
                    suffix={isSearchingCompany ? <Spin size="small" /> : undefined}
                    placeholder={t('salesOrders.createPlaceholders.companyTin', {
                      defaultValue: 'ИНН компании',
                    })}
                  />
                </Form.Item>
                <Form.Item
                  className="input"
                  name={["customer", "name"]}
                  label={t('salesOrders.createFields.companyName', { defaultValue: 'Название компании' })}
                  rules={[
                    {
                      required: true,
                      message: t('salesOrders.createValidation.companyNameRequired', {
                        defaultValue: 'Название компании обязательно',
                      }),
                    },
                  ]}
                >
                  <Input
                    className="input"
                    size="large"
                    placeholder={t('salesOrders.createPlaceholders.companyName', {
                      defaultValue: 'Название компании',
                    })}
                  />
                </Form.Item>
              </div>
              <AddressFields
                owner="customer"
                form={form}
                regions={regions}
                districts={customerDistricts}
                regionsLoading={referencesLoading}
                districtsLoading={districtsLoadingByOwner.customer}
                regionId={customerRegionId}
                address={customerAddress}
                location={customerLocation}
                geocodeAddress={customerGeocodeAddress}
                geocodeRequestKey={mapGeocodeRequestKey.customer}
                forcedGeocodeAddress={forcedMapGeocodeAddress.customer}
                addressLabelKey="salesOrders.createFields.companyAddress"
                addressPlaceholderKey="salesOrders.createPlaceholders.companyAddress"
                addressRequiredKey="salesOrders.createValidation.companyAddressRequired"
                locationLabelKey="salesOrders.fields.customerLocation"
                referenceLabel={referenceLabel}
                onRegionChange={(regionId) => handleAddressRegionChange("customer", regionId)}
                onDistrictChange={(districtId) => handleAddressDistrictChange("customer", districtId)}
                onAddressSelect={(address) => {
                  void applyMapAddressSelection("customer", address);
                }}
                onForcedGeocodeComplete={() => {
                  setForcedMapGeocodeAddress((prev) => ({ ...prev, customer: undefined }));
                }}
              />
                </div>
              </div>

              <div className="form-divider-title">
                <h4 className="title">{t('salesOrders.sections.contract')}</h4>
              </div>
              <div className="form-inputs form-inputs-organization">
                <Form.Item
                  className="input"
                  name={["contract", "number"]}
                  label={t('salesOrders.fields.contractNumber')}
                  rules={[{ required: true, message: t('salesOrders.validation.contractNumberRequired') }]}
                >
                  <Input className="input" size="large" placeholder={t('salesOrders.placeholders.contractNumber')} />
                </Form.Item>
                <Form.Item
                  className="input"
                  name={["contract", "date"]}
                  label={t('salesOrders.fields.contractDate')}
                  rules={[{ required: true, message: t('salesOrders.validation.contractDateRequired') }]}
                >
                  <DatePicker className="input" size="large" placeholder={t('salesOrders.placeholders.contractDate')} />
                </Form.Item>
              </div>

              <div className="form-divider-title">
                <h4 className="title">{t('salesOrders.sections.fulfillment')}</h4>
              </div>
              <div className="form-inputs form-inputs-organization">
                <Form.Item
                  className="input"
                  name={["fulfillment", "dueDate"]}
                  label={t('salesOrders.createFields.expectedDate', { defaultValue: 'Ожидаемая дата' })}
                  rules={[
                    {
                      required: true,
                      message: t('salesOrders.createValidation.expectedDateRequired', {
                        defaultValue: 'Ожидаемая дата обязательна',
                      }),
                    },
                  ]}
                >
                  <DatePicker
                    className="input"
                    size="large"
                    placeholder={t('salesOrders.createPlaceholders.expectedDate', {
                      defaultValue: 'Ожидаемая дата',
                    })}
                  />
                </Form.Item>
                <Form.Item
                  className="input"
                  name={["fulfillment", "priority"]}
                  label={t('salesOrders.fields.priority')}
                  rules={[{ required: true, message: t('salesOrders.validation.priorityRequired') }]}
                >
                  <Select
                    className="input"
                    size="large"
                    options={SalesOrderPriorities.map((priority) => ({
                      value: priority,
                      label: t(`salesOrders.priority.${priority}`),
                    }))}
                    placeholder={t('salesOrders.priority.normal')}
                  />
                </Form.Item>
              </div>

              <div className="form-divider-title">
                <h4 className="title">{t('salesOrders.sections.paymentMethod')}</h4>
              </div>
              <div className="form-inputs">
                <Form.Item
                  className="input"
                  name={["fulfillment", "paymentMethod"]}
                  rules={[{ required: true, message: t('salesOrders.validation.paymentMethodRequired') }]}
                >
                  <Radio.Group size="large">
                    <Radio value={SalesOrderPaymentMethod.Cash}>{t('salesOrders.paymentMethods.cash')}</Radio>
                    <Radio value={SalesOrderPaymentMethod.Transfer}>{t('salesOrders.paymentMethods.transfer')}</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>

              <div className="form-divider-title">
                <h4 className="title">{t('waybills.sections.delivery')}</h4>
              </div>
              <div className="form-inputs form-inputs-organization">
                <Form.Item
                  className="input"
                  name={["delivery", "type"]}
                  label={t('waybills.fields.deliveryType')}
                  rules={[{ required: true, message: t('waybills.fields.deliveryType') }]}
                >
                  <Select
                    className="input"
                    size="large"
                    options={Object.values(SalesOrderDeliveryType).map((type) => ({
                      value: type,
                      label: t(`waybills.deliveryTypes.${type}`),
                    }))}
                  />
                </Form.Item>
                <Form.Item
                  className="input"
                  name={["delivery", "costPerDistanceUnit"]}
                  label={t('waybills.fields.costPerKilometer', { defaultValue: 'Цена за 1 км' })}
                  rules={[{ required: true, message: t('salesOrders.validation.costPerKilometerRequired') }]}
                >
                  <InputNumber<string | number>
                    min={0}
                    precision={2}
                    type="text"
                    size="large"
                    className="input"
                    style={{ width: "100%" }}
                    addonAfter={t('waybills.fields.sum', { defaultValue: 'сум' })}
                    parser={decimalParser(10, 2)}
                    inputMode="decimal"
                  />
                </Form.Item>
                <Form.Item
                  className="input"
                  name={["delivery", "totalDistance"]}
                  label={
                    <span>
                      {t('waybills.fields.totalDistance')}
                      {deliveryDistanceSource === "geo" && (
                        <Tooltip
                          open
                          placement="top"
                          title={t('waybills.fields.geoDistanceFallbackTooltip', {
                            defaultValue: 'Маршрут недоступен, указано прямое расстояние между выбранными точками',
                          })}
                        >
                          <InfoCircleOutlined style={{ color: 'var(--status-warning-color)', marginLeft: 6 }} />
                        </Tooltip>
                      )}
                    </span>
                  }
                >
                  <InputNumber<string | number>
                    min={0}
                    precision={1}
                    type="text"
                    size="large"
                    className="input"
                    style={{ width: "100%" }}
                    addonAfter="км"
                    parser={decimalParser(10, 1)}
                    inputMode="decimal"
                  />
                </Form.Item>
              </div>

              <div className="sales-order-items-total">
                <div className="sales-order-items-total__label">
                  {t('waybills.fields.deliveryTotalCost', { defaultValue: 'Общая стоимость доставки' })}
                </div>
                <div className="sales-order-items-total__value">{formattedDeliveryTotalCost}</div>
              </div>

              <div className="form-divider-title">
                <h4 className="title">{t('salesOrders.sections.items')}</h4>
              </div>
              <Form.List name="items" initialValue={[{}]}>
                {(fields, { add, remove }) => (
                  <div className="create-order-items">
                    {fields.map((field, index) => {
                      const rowProductId = Array.isArray(items)
                        ? (items[field.name]?.productId as string | undefined)
                        : undefined;
                      const rowPackages = rowProductId
                        ? packagesByProductId[rowProductId]
                        : undefined;

                      return (
                      <div key={field.key} className="sales-order-item-card">
                        <div className="sales-order-item-card__header">
                          <span className="sales-order-item-card__title">
                            {t('salesOrders.sections.item', { defaultValue: 'Позиция' })} {index + 1}
                          </span>
                          <div className="sales-order-item-card__actions">
                            {fields.length > 1 && (
                              <CustomButton
                                variant="danger"
                                className="create-order-btn"
                                icon={<CloseOutlined />}
                                iconOnly
                                onClick={() => remove(field.name)}
                                aria-label={t("btn.delete", { defaultValue: "Удалить" })}
                              />
                            )}
                            {index === fields.length - 1 && (
                              <CustomButton
                                className="create-order-btn"
                                icon={<PlusOutlined />}
                                iconOnly
                                onClick={() => add()}
                                aria-label={t("btn.add", { defaultValue: "Добавить" })}
                              />
                            )}
                          </div>
                        </div>

                        <div className="form-inputs sales-order-item-card__row sales-order-item-card__row--primary">
                          <Form.Item
                            className="input sales-order-item sales-order-item--product"
                            name={[field.name, "productId"]}
                            label={t('salesOrders.fields.product')}
                            rules={[{ required: true, message: t('salesOrders.validation.itemProductRequired') }]}
                          >
                            <Select
                              className="input"
                              size="large"
                              placeholder={t('salesOrders.fields.product')}
                              showSearch
                              filterOption={false}
                              optionLabelProp="label"
                              dropdownMatchSelectWidth={false}
                              onSearch={handleProductSearch}
                              onChange={(value) => handleItemProductChange(field.name, value)}
                              options={products.map((product) => ({
                                value: product.id,
                                label: product.name,
                              }))}
                            />
                          </Form.Item>

                          <Form.Item
                            className="input sales-order-item sales-order-item--package"
                            name={[field.name, "packageCode"]}
                            label={t('salesOrders.fields.packageCodeShort')}
                            rules={[{ required: true, message: t('salesOrders.validation.itemPackageRequired') }]}
                          >
                            <Select
                              className="input"
                              size="large"
                              placeholder={t('salesOrders.fields.packageCodeShort')}
                              loading={rowPackages?.loading}
                              disabled={!rowProductId || rowPackages?.loading}
                              notFoundContent={
                                rowPackages?.loading
                                  ? t('common.loading', { defaultValue: '...' })
                                  : undefined
                              }
                              options={(rowPackages?.options ?? []).map((pkg) => ({
                                value: pkg.code,
                                label: getPackageLabel(pkg),
                              }))}
                            />
                          </Form.Item>

                          <Form.Item
                            className="input sales-order-item sales-order-item--quantity"
                            name={[field.name, "quantity"]}
                            label={t('salesOrders.fields.quantity')}
                            rules={[{ required: true, message: t('salesOrders.validation.itemQuantityRequired') }]}
                          >
                            <InputNumber<string | number>
                              min={1}
                              max={9999999999}
                              precision={0}
                              type="text"
                              size="large"
                              className="input"
                              style={{ width: "100%", minWidth: 120 }}
                              placeholder={t('salesOrders.placeholders.quantity')}
                              parser={digitsOnlyParser(10)}
                              inputMode="numeric"
                              onKeyDown={allowOnlyDigitsKeyDown(10)}
                              onPaste={allowOnlyDigitsPaste(10)}
                            />
                          </Form.Item>
                        </div>

                        <div className="form-inputs sales-order-item-card__row sales-order-item-card__row--secondary">
                          <Form.Item
                            className="input sales-order-item sales-order-item--unit-price"
                            name={[field.name, "unitPrice"]}
                            label={t('salesOrders.fields.unitPrice')}
                            rules={[{ required: true, message: t('salesOrders.validation.itemUnitPriceRequired') }]}
                          >
                            <InputNumber<string | number>
                              min={100}
                              max={9999999}
                              precision={0}
                              type="text"
                              size="large"
                              className="input"
                              style={{ width: "100%", minWidth: 140 }}
                              placeholder={t('salesOrders.placeholders.unitPrice')}
                              parser={digitsOnlyParser(7)}
                              inputMode="numeric"
                              onKeyDown={allowOnlyDigitsKeyDown(7)}
                              onPaste={allowOnlyDigitsPaste(7)}
                            />
                          </Form.Item>

                          <Form.Item
                            className="input sales-order-item sales-order-item--comment"
                            name={[field.name, "comment"]}
                            label={t('salesOrders.fields.comment')}
                          >
                            <Input className="input" size="large" placeholder={t('salesOrders.placeholders.itemComment')} />
                          </Form.Item>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                )}
              </Form.List>

              <div className="sales-order-items-total">
                <div className="sales-order-items-total__label">{t('salesOrders.fields.totalAmount')}</div>
                <div className="sales-order-items-total__value">{formattedTotalAmount}</div>
              </div>

              <div className="form-inputs">
                <Form.Item className="input" name="comment" label={t('salesOrders.fields.comment')}>
                  <Input.TextArea className="input" rows={3} placeholder={t('salesOrders.placeholders.comment')} style={{ resize: 'none' }} />
                </Form.Item>
              </div>

              <div className="form-btns-group">
                <CustomButton variant="outline" onClick={() => navigate(listPath)}>
                  {t('btn.cancel')}
                </CustomButton>
                <CustomButton
                  type="submit"
                  loading={isSubmitting}
                  disabled={
                    !isCompanyFound ||
                    productsLoading ||
                    Boolean(companyLookupError) ||
                    Boolean(productsError)
                  }
                >
                  {t('salesOrders.actions.create')}
                </CustomButton>
              </div>
            </FormComponent>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SalesOrdersCreate;
