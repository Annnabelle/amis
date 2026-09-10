import { DatePicker, Form, Input, InputNumber, Radio, Select, Spin, Tooltip } from 'antd';
import { CloseOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import CustomButton from 'shared/ui/button';
import FormComponent from 'shared/ui/formComponent';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'app/store';
import { toast } from 'react-toastify';
import { createSalesOrder } from 'entities/salesOrders/model';
import {
  mapSalesOrderFormToCreateDto,
  SalesOrderContractError,
  type SalesOrderFormValues,
} from 'entities/salesOrders/mappers';
import { getProductPackages, searchProducts } from 'entities/products/model';
import type { ProductPackage } from 'entities/products/types';
import { getCompanyByTin, getOrganizationById } from 'entities/organization/model';
import { fetchDistrictsByRegion, fetchRegions } from 'entities/references/model';
import { getBackendErrorMessage } from 'shared/lib/getBackendErrorMessage.ts';
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { endpointAccessMap } from 'shared/config/endpointAccessMap';
import { RequiredDataAlert } from 'entities/access/ui';
import { isLanguage, SalesOrderPaymentMethod, SalesOrderPriorities } from 'shared/types/dtos';
import { SalesOrderDeliveryType } from 'entities/waybills/dtos';
import type { CompanyResponse } from 'entities/organization/types';
import type { Reference } from 'entities/references/types';
import YandexAddressMap, { calculateYandexRouteDistanceKm, type YandexResolvedAddress } from './YandexAddressMap';

const TIN_LENGTH = 9;

const SalesOrdersCreate = () => {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { products, isLoading: productsLoading, error: productsError } =
    useAppSelector((state) => state.products);
  const {
    references,
    districtsByRegionId,
    loading: referencesLoading,
    error: referencesError,
  } = useAppSelector((state) => state.references);
  const [form] = Form.useForm<SalesOrderFormValues>();
  const [isSearchingCompany, setIsSearchingCompany] = useState(false);
  const [isCompanyFound, setIsCompanyFound] = useState(false);
  const [companyLookupError, setCompanyLookupError] = useState<string | null>(null);
  const [senderCompany, setSenderCompany] = useState<CompanyResponse | null>(null);
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
    ? `/organization/${orgId}/sales-orders`
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
  const regions = references.regions ?? [];
  const senderDistricts = senderRegionId ? districtsByRegionId[senderRegionId] ?? [] : [];
  const customerDistricts = customerRegionId ? districtsByRegionId[customerRegionId] ?? [] : [];

  const digitsOnlyParser = (maxDigits?: number) => (value?: string) => {
    const digits = value?.replace(/\D/g, '') ?? '';
    return maxDigits ? digits.slice(0, maxDigits) : digits;
  };

  const decimalParser = (maxIntegerDigits?: number, maxFractionDigits = 2) => (value?: string) => {
    const normalized = (value ?? '').replace(',', '.').replace(/[^\d.]/g, '');
    const [integerPart = '', ...fractionParts] = normalized.split('.');
    const integer = maxIntegerDigits ? integerPart.slice(0, maxIntegerDigits) : integerPart;
    const fraction = fractionParts.join('').slice(0, maxFractionDigits);

    return fractionParts.length > 0 ? `${integer}.${fraction}` : integer;
  };

  const totalAmount = useMemo(() => {
    const safeItems = Array.isArray(items) ? items : [];

    const toBigInt = (value: unknown) => {
      const digits = String(value ?? '').replace(/\D/g, '');
      if (!digits) return 0n;
      try {
        return BigInt(digits);
      } catch {
        return 0n;
      }
    };

    return safeItems.reduce((sum, item) => {
      const quantity = toBigInt(item?.quantity);
      const unitPrice = toBigInt(item?.unitPrice);
      return sum + quantity * unitPrice;
    }, 0n);
  }, [items]);

  const formattedTotalAmount = useMemo(() => new Intl.NumberFormat().format(totalAmount), [totalAmount]);
  const deliveryTotalCost = useMemo(() => {
    const cost = Number(deliveryCostPerDistanceUnit);
    const distance = Number(deliveryTotalDistance);

    if (!Number.isFinite(cost) || !Number.isFinite(distance)) return 0;
    return cost * distance;
  }, [deliveryCostPerDistanceUnit, deliveryTotalDistance]);
  const formattedDeliveryTotalCost = useMemo(
    () => new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(deliveryTotalCost),
    [deliveryTotalCost]
  );

  const allowOnlyDigitsKeyDown = (maxDigits?: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
      'Enter',
    ];
    if (allowedKeys.includes(e.key)) return;

    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    if (!maxDigits) return;

    const currentValue = e.currentTarget.value ?? '';
    const selectionStart = e.currentTarget.selectionStart ?? currentValue.length;
    const selectionEnd = e.currentTarget.selectionEnd ?? currentValue.length;
    const hasSelection = selectionEnd > selectionStart;

    if (!hasSelection && currentValue.length >= maxDigits) {
      e.preventDefault();
    }
  };

  const allowOnlyDigitsPaste = (maxDigits?: number) => (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    if (!/^\d*$/.test(text)) {
      e.preventDefault();
      return;
    }

    if (!maxDigits) return;

    const currentValue = e.currentTarget.value ?? '';
    const selectionStart = e.currentTarget.selectionStart ?? currentValue.length;
    const selectionEnd = e.currentTarget.selectionEnd ?? currentValue.length;
    const selectionLength = Math.max(0, selectionEnd - selectionStart);
    const nextLength = currentValue.length - selectionLength + text.length;

    if (nextLength > maxDigits) {
      e.preventDefault();
    }
  };

  const normalizeTin = (value: string) => value.replace(/\D/g, '').slice(0, TIN_LENGTH);

  const getReferenceValue = (reference: Reference) => reference.id ?? reference.alias;

  const getReferenceLabel = (reference: Reference) =>
    reference.title[currentLanguage] || reference.title.ru || reference.alias;

  const getReferenceByValue = (items: Reference[], value?: string) =>
    items.find((item) => getReferenceValue(item) === value);

  const normalizeReferenceText = (value?: string) =>
    value
      ?.toLowerCase()
      .replace(/ё/g, "е")
      .replace(/[.,'`"_/-]/g, " ")
      .replace(
        /(^|\s)(республика|область|обл|район|р-н|город|г|shahar|shahri|city|viloyati|tumani|вилояти|тумани)(?=\s|$)/g,
        " "
      )
      .replace(/\s+/g, " ")
      .trim();

  const getReferenceTextVariants = (value?: string) => {
    const normalized = normalizeReferenceText(value);
    if (!normalized) return [];

    const stemmed = normalized.replace(/\b([а-я]+?)(ский|ской|цкий|кий|ый|ий)\b/g, "$1");

    return [normalized, stemmed].filter((item, index, items) => item && items.indexOf(item) === index);
  };

  const getReferenceTitleValues = (title: Reference["title"] | string | undefined) => {
    if (!title) return [];
    if (typeof title === "string") return [title];

    return Object.values(title).filter((value): value is string => typeof value === "string");
  };

  const getReferenceRawSearchValues = (reference: Reference) =>
    [
      reference.id,
      reference.alias,
      ...getReferenceTitleValues(reference.title),
    ].filter((value): value is string => Boolean(value));

  const getReferenceSearchValues = (reference: Reference) =>
    getReferenceRawSearchValues(reference)
      .flatMap(getReferenceTextVariants)
      .filter((value, index, values): value is string => Boolean(value) && values.indexOf(value) === index);

  const getReferenceDebugInfo = (reference: Reference) => ({
    value: getReferenceValue(reference),
    alias: reference.alias,
    title: reference.title,
    searchValues: getReferenceSearchValues(reference),
  });

  const resolveReferenceByCandidates = (items: Reference[], candidates: string[]) => {
    const normalizedCandidates = candidates
      .flatMap(getReferenceTextVariants)
      .filter((value, index, values): value is string => Boolean(value) && values.indexOf(value) === index);

    if (normalizedCandidates.length === 0) return undefined;

    const exactMatch = normalizedCandidates
      .map((candidate) =>
        items.find((item) => getReferenceSearchValues(item).includes(candidate))
      )
      .find(Boolean);

    if (exactMatch) return exactMatch;

    const rawCandidates = candidates.map((candidate) => candidate.trim()).filter(Boolean);

    const rawExactMatch = rawCandidates
      .map((candidate) =>
        items.find((item) =>
          getReferenceRawSearchValues(item)
            .map((value) => value.trim())
            .includes(candidate)
        )
      )
      .find(Boolean);

    if (rawExactMatch) return rawExactMatch;

    return normalizedCandidates
      .map((candidate) =>
        items.find((item) =>
          getReferenceSearchValues(item).some((value) =>
            value.length > 3 && candidate.includes(value)
            || candidate.length > 3 && value.includes(candidate)
          )
        )
      )
      .find(Boolean);
  };

  const buildGeocodeAddress = (
    address?: string,
    regionId?: string,
    districtId?: string,
    districts: Reference[] = []
  ) => {
    const region = getReferenceByValue(regions, regionId);
    const district = getReferenceByValue(districts, districtId);
    const parts = [
      "Узбекистан",
      region ? getReferenceLabel(region) : undefined,
      district ? getReferenceLabel(district) : undefined,
      address?.trim(),
    ].filter(Boolean);

    return parts.join(", ");
  };

  const buildAreaGeocodeAddress = (
    regionId?: string,
    districtId?: string,
    districts: Reference[] = []
  ) => buildGeocodeAddress(undefined, regionId, districtId, districts);

  const senderGeocodeAddress = buildGeocodeAddress(
    senderAddress,
    senderRegionId,
    senderDistrictId,
    senderDistricts
  );
  const customerGeocodeAddress = buildGeocodeAddress(
    customerAddress,
    customerRegionId,
    customerDistrictId,
    customerDistricts
  );

  const resolveReferenceValue = (items: Reference[], value?: string) => {
    const normalized = value?.trim().toLowerCase();
    if (!normalized) return undefined;

    const found = items.find((item) => {
      const candidates = [
        item.id,
        item.alias,
        item.title.ru,
        item.title.en,
        item.title.uz,
      ];

      return candidates.some((candidate) => candidate?.trim().toLowerCase() === normalized);
    });

    return found ? getReferenceValue(found) : undefined;
  };

  const getCompanyAddressDetails = async (company: CompanyResponse) => {
    const address = company.address.address?.trim();
    const regionId = resolveReferenceValue(regions, company.address.region);

    if (!address && !regionId) return undefined;

    const districts = regionId
      ? districtsByRegionId[regionId] ?? (await dispatch(fetchDistrictsByRegion(regionId)).unwrap()).data
      : [];
    const districtId = resolveReferenceValue(districts, company.address.district);

    return {
      address,
      regionId,
      districtId,
    };
  };

  const loadDistrictsForRegion = async (
    regionId: string,
    owner?: "sender" | "customer"
  ) => {
    if (districtsByRegionId[regionId]) {
      return districtsByRegionId[regionId];
    }

    if (owner) {
      setDistrictsLoadingByOwner((prev) => ({ ...prev, [owner]: true }));
    }

    try {
      const payload = await dispatch(fetchDistrictsByRegion(regionId)).unwrap();
      return payload.data;
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
    console.groupCollapsed(`[SalesOrdersCreate] resolve map address references: ${owner}`);
    console.info("selected address from map", selectedAddress);
    console.info("available regions", regions.map(getReferenceDebugInfo));

    const region = resolveReferenceByCandidates(regions, selectedAddress.regionCandidates);
    console.info("region search", {
      rawCandidates: selectedAddress.regionCandidates,
      normalizedCandidates: selectedAddress.regionCandidates.map(normalizeReferenceText),
      matched: region ? getReferenceDebugInfo(region) : undefined,
    });

    if (!region) {
      console.warn("result", "region was not found in references");
      console.groupEnd();
      return;
    }

    const regionId = getReferenceValue(region);
    console.info("region result", { regionId });

    try {
      const currentDistricts = await loadDistrictsForRegion(regionId);
      const district = resolveReferenceByCandidates(currentDistricts, selectedAddress.districtCandidates);
      const districtId = district ? getReferenceValue(district) : undefined;

      console.info("available districts", currentDistricts.map(getReferenceDebugInfo));
      console.info("district search", {
        rawCandidates: selectedAddress.districtCandidates,
        normalizedCandidates: selectedAddress.districtCandidates.map(normalizeReferenceText),
        matched: district ? getReferenceDebugInfo(district) : undefined,
      });

      form.setFieldValue([owner, "addressDetails", "regionId"], regionId);
      form.setFieldValue([owner, "addressDetails", "districtId"], districtId);
      if (selectedAddress.address) {
        form.setFieldValue([owner, "addressDetails", "address"], selectedAddress.address);
      }

      console.info("form fields set", {
        owner,
        regionId,
        districtId,
        address: selectedAddress.address,
      });

      if (!districtId) {
        console.warn("result", "district was not found in references");
      } else {
        console.info("result", "region and district were resolved");
      }
    } catch (error) {
      console.error("failed to resolve district references", error);
    } finally {
      console.groupEnd();
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
      const company = await dispatch(getCompanyByTin(normalized)).unwrap();

      if (requestId !== companyLookupRequestRef.current) return;

      if (!company) {
        setIsSearchingCompany(false);
        toast.error(t('salesOrders.validation.customerCompanyNotFound'));
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
        const message = getBackendErrorMessage(error, t('common.error'));
        setCompanyLookupError(message);
        toast.error(message);
      }
    }
  };

  useEffect(() => {
    if (!orgId) return;
    dispatch(fetchRegions());
    dispatch(
      searchProducts({
        query: '',
        page: 1,
        limit: 10,
        sortOrder: 'asc',
      })
    );
  }, [dispatch, orgId]);

  useEffect(() => {
    if (!orgId) return;

    dispatch(getOrganizationById({ id: orgId }))
      .unwrap()
      .then((company) => {
        setSenderCompany(company);
        form.setFieldsValue({
          sender: {
            tin: company.tin,
            name: company.name[currentLanguage] || company.displayName || company.legalName,
            addressDetails: {
              address: company.address.address?.trim(),
            },
          },
        });
      })
      .catch(() => undefined);
  }, [currentLanguage, dispatch, form, orgId]);

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
  }, [currentLanguage, form, regions.length, senderCompany]);

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
        console.info("[SalesOrdersCreate] set delivery total distance", result);
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
    dispatch(
      searchProducts({
        query: value,
        page: 1,
        limit: 10,
        sortOrder: 'asc',
      })
    );
  };

  const loadProductPackages = async (productId: string) => {
    const existing = packagesByProductId[productId];
    if (existing?.loading || existing?.loaded) {
      return;
    }

    setPackagesByProductId((prev) => ({
      ...prev,
      [productId]: { loading: true, loaded: false, options: prev[productId]?.options ?? [] },
    }));

    const result = await dispatch(getProductPackages({ id: productId }));

    if (getProductPackages.fulfilled.match(result)) {
      setPackagesByProductId((prev) => ({
        ...prev,
        [productId]: { loading: false, loaded: true, options: result.payload },
      }));
    } else {
      setPackagesByProductId((prev) => ({
        ...prev,
        [productId]: { loading: false, loaded: false, options: [] },
      }));
      toast.error(result.payload ?? t('common.error'));
    }
  };

  const handleItemProductChange = (fieldName: number, productId?: string) => {
    form.setFieldValue(['items', fieldName, 'packageCode'], undefined);
    if (productId) {
      void loadProductPackages(productId);
    }
  };

  const getPackageLabel = (pkg: ProductPackage) =>
    pkg.name?.[currentLanguage] || pkg.name?.ru || pkg.name?.en || pkg.code;

  const isValidLocation = (value?: { latitude?: number; longitude?: number }) =>
    Boolean(value) &&
    Number.isFinite(Number(value?.latitude)) &&
    Number.isFinite(Number(value?.longitude));

  const locationRule = {
    validator: (_: unknown, value: { latitude?: number; longitude?: number } | undefined) =>
      isValidLocation(value)
        ? Promise.resolve()
        : Promise.reject(
            new Error(
              t('salesOrders.createValidation.locationRequired', {
                defaultValue: 'Отметьте точку на карте',
              })
            )
          ),
  };

  const locationValueProps = (value?: { latitude?: number; longitude?: number }) => ({
    value: isValidLocation(value) ? `${value?.latitude}, ${value?.longitude}` : '',
  });

  const handleCreateSalesOrder = async (values: SalesOrderFormValues) => {
    if (!orgId) {
      toast.error(t('salesOrders.validation.companyRequired'));
      return;
    }

    if (!isCompanyFound) {
      toast.error(t('salesOrders.validation.customerCompanyNotFound'));
      return;
    }

    let payload;
    try {
      payload = mapSalesOrderFormToCreateDto(values);
    } catch (error: unknown) {
      if (error instanceof SalesOrderContractError) {
        toast.error(t('salesOrders.createValidation.contractDetailsIncomplete'));
        return;
      }
      throw error;
    }

    try {
      await dispatch(createSalesOrder(payload)).unwrap();
      toast.success(t('salesOrders.messages.success.create'));
      form.resetFields();
      navigate(listPath);
    } catch (error: unknown) {
      toast.error(
        getBackendErrorMessage(error, t('common.error'))
      );
    }
  };

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
              onFinish={handleCreateSalesOrder}
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
              <div className="form-inputs form-inputs-organization">
                <Form.Item
                  className="input"
                  name={["sender", "addressDetails", "regionId"]}
                  label={t('salesOrders.createFields.region', { defaultValue: 'Region' })}
                  rules={[{ required: true, message: t('salesOrders.createValidation.regionRequired', { defaultValue: 'Select region' }) }]}
                >
                  <Select
                    className="input"
                    size="large"
                    loading={referencesLoading}
                    options={regions.map((region) => ({
                      value: getReferenceValue(region),
                      label: getReferenceLabel(region),
                    }))}
                    onChange={(regionId) => handleAddressRegionChange("sender", regionId)}
                    placeholder={t('salesOrders.createPlaceholders.region', { defaultValue: 'Region' })}
                  />
                </Form.Item>
                <Form.Item
                  className="input"
                  name={["sender", "addressDetails", "districtId"]}
                  label={t('salesOrders.createFields.district', { defaultValue: 'District' })}
                  rules={[{ required: true, message: t('salesOrders.createValidation.districtRequired', { defaultValue: 'Select district' }) }]}
                >
                  <Select
                    className="input"
                    size="large"
                    disabled={!senderRegionId}
                    loading={districtsLoadingByOwner.sender}
                    onChange={(districtId) => handleAddressDistrictChange("sender", districtId)}
                    options={senderDistricts.map((district) => ({
                      value: getReferenceValue(district),
                      label: getReferenceLabel(district),
                    }))}
                    placeholder={t('salesOrders.createPlaceholders.district', { defaultValue: 'District' })}
                  />
                </Form.Item>
              </div>
              <div className="form-inputs">
                <Form.Item
                  className="input"
                  name={["sender", "addressDetails", "address"]}
                  label={t('salesOrders.createFields.address', { defaultValue: 'Address' })}
                  rules={[{ required: true, message: t('salesOrders.createValidation.addressRequired', { defaultValue: 'Enter address' }) }]}
                >
                  <Input
                    className="input"
                    size="large"
                    placeholder={t('salesOrders.createPlaceholders.address', { defaultValue: 'Address' })}
                  />
                </Form.Item>
              </div>
              <div className="form-inputs">
                <Form.Item
                  className="input"
                  name={["sender", "addressDetails", "location"]}
                  label={t('salesOrders.fields.senderLocation')}
                  getValueProps={locationValueProps}
                  rules={[locationRule]}
                >
                  <Input
                    className="input"
                    size="large"
                    disabled
                    placeholder={t('salesOrders.createPlaceholders.location', {
                      defaultValue: 'Отметьте точку на карте',
                    })}
                  />
                </Form.Item>
              </div>
              <YandexAddressMap
                address={senderAddress}
                forcedGeocodeAddress={forcedMapGeocodeAddress.sender}
                geocodeAddress={senderGeocodeAddress}
                geocodeRequestKey={mapGeocodeRequestKey.sender}
                location={senderLocation}
                onAddressChange={(address) => {
                  form.setFieldValue(["sender", "addressDetails", "address"], address);
                }}
                onAddressSelect={(address) => {
                  void applyMapAddressSelection("sender", address);
                }}
                onForcedGeocodeComplete={() => {
                  setForcedMapGeocodeAddress((prev) => ({ ...prev, sender: undefined }));
                }}
                onLocationChange={(location) => {
                  form.setFieldValue(["sender", "addressDetails", "location"], location);
                  void form.validateFields([["sender", "addressDetails", "location"]]).catch(() => undefined);
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
              <div className="form-inputs form-inputs-organization">
                <Form.Item
                  className="input"
                  name={["customer", "addressDetails", "regionId"]}
                  label={t('salesOrders.createFields.region', { defaultValue: 'Region' })}
                  rules={[{ required: true, message: t('salesOrders.createValidation.regionRequired', { defaultValue: 'Select region' }) }]}
                >
                  <Select
                    className="input"
                    size="large"
                    loading={referencesLoading}
                    options={regions.map((region) => ({
                      value: getReferenceValue(region),
                      label: getReferenceLabel(region),
                    }))}
                    onChange={(regionId) => handleAddressRegionChange("customer", regionId)}
                    placeholder={t('salesOrders.createPlaceholders.region', { defaultValue: 'Region' })}
                  />
                </Form.Item>
                <Form.Item
                  className="input"
                  name={["customer", "addressDetails", "districtId"]}
                  label={t('salesOrders.createFields.district', { defaultValue: 'District' })}
                  rules={[{ required: true, message: t('salesOrders.createValidation.districtRequired', { defaultValue: 'Select district' }) }]}
                >
                  <Select
                    className="input"
                    size="large"
                    disabled={!customerRegionId}
                    loading={districtsLoadingByOwner.customer}
                    onChange={(districtId) => handleAddressDistrictChange("customer", districtId)}
                    options={customerDistricts.map((district) => ({
                      value: getReferenceValue(district),
                      label: getReferenceLabel(district),
                    }))}
                    placeholder={t('salesOrders.createPlaceholders.district', { defaultValue: 'District' })}
                  />
                </Form.Item>
              </div>
              <div className="form-inputs form-inputs-organization">
                <Form.Item
                  className="input"
                  name={["customer", "addressDetails", "address"]}
                  label={t('salesOrders.createFields.companyAddress', { defaultValue: 'Адрес компании' })}
                  rules={[
                    {
                      required: true,
                      message: t('salesOrders.createValidation.companyAddressRequired', {
                        defaultValue: 'Адрес компании обязателен',
                      }),
                    },
                  ]}
                >
                  <Input
                    className="input"
                    size="large"
                    placeholder={t('salesOrders.createPlaceholders.companyAddress', {
                      defaultValue: 'Адрес компании',
                    })}
                  />
                </Form.Item>
              </div>
              <div className="form-inputs form-inputs-organization">
                <Form.Item
                  className="input"
                  name={["customer", "addressDetails", "location"]}
                  label={t('salesOrders.fields.customerLocation')}
                  getValueProps={locationValueProps}
                  rules={[locationRule]}
                >
                  <Input
                    className="input"
                    size="large"
                    disabled
                    placeholder={t('salesOrders.createPlaceholders.location', {
                      defaultValue: 'Отметьте точку на карте',
                    })}
                  />
                </Form.Item>
              </div>
              <YandexAddressMap
                address={customerAddress}
                forcedGeocodeAddress={forcedMapGeocodeAddress.customer}
                geocodeAddress={customerGeocodeAddress}
                geocodeRequestKey={mapGeocodeRequestKey.customer}
                location={customerLocation}
                onAddressChange={(address) => {
                  form.setFieldValue(["customer", "addressDetails", "address"], address);
                }}
                onAddressSelect={(address) => {
                  void applyMapAddressSelection("customer", address);
                }}
                onForcedGeocodeComplete={() => {
                  setForcedMapGeocodeAddress((prev) => ({ ...prev, customer: undefined }));
                }}
                onLocationChange={(location) => {
                  form.setFieldValue(["customer", "addressDetails", "location"], location);
                  void form.validateFields([["customer", "addressDetails", "location"]]).catch(() => undefined);
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
                      <div key={field.key} className="form-inputs create-order-items-item sales-order-items-item">
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

                        {index === fields.length - 1 ? (
                          <CustomButton
                            className="create-order-btn"
                            icon={<PlusOutlined />}
                            iconOnly
                            onClick={() => add()}
                            aria-label={t("btn.add", { defaultValue: "Добавить" })}
                          />
                        ) : (
                          <CustomButton
                            variant="danger"
                            className="create-order-btn"
                            icon={<CloseOutlined />}
                            iconOnly
                            onClick={() => remove(field.name)}
                            aria-label={t("btn.delete", { defaultValue: "Удалить" })}
                          />
                        )}
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
