import { Form, Input, Select, type FormInstance } from "antd";
import { useTranslation } from "react-i18next";

import type { Reference } from "entities/references/types";
import type { SalesOrderFormValues } from "entities/salesOrders/mappers";
import YandexAddressMap from "shared/ui/yandexAddressMap";
import type { YandexResolvedAddress } from "shared/lib/yandexMaps";
import { getReferenceValue } from "features/salesOrderCreate/lib/referenceMatch";

export type AddressOwner = "sender" | "customer";

type Location = { latitude?: number; longitude?: number };

const isValidLocation = (value?: Location) =>
  Boolean(value) &&
  Number.isFinite(Number(value?.latitude)) &&
  Number.isFinite(Number(value?.longitude));

type AddressFieldsProps = {
  owner: AddressOwner;
  form: FormInstance<SalesOrderFormValues>;
  regions: Reference[];
  districts: Reference[];
  regionsLoading: boolean;
  districtsLoading: boolean;
  regionId?: string;
  address?: string;
  location?: Location;
  geocodeAddress: string;
  geocodeRequestKey: number;
  forcedGeocodeAddress?: string;
  /** Ключ подписи поля адреса: у отправителя и у клиента он свой. */
  addressLabelKey: string;
  addressPlaceholderKey: string;
  addressRequiredKey: string;
  locationLabelKey: string;
  /** Класс строки с адресом и точкой: колонки отличаются шириной. */
  wideRowClassName?: string;
  referenceLabel: (reference: Reference) => string;
  onRegionChange: (regionId: string) => void;
  onDistrictChange: (districtId?: string) => void;
  onAddressSelect: (address: YandexResolvedAddress) => void;
  onForcedGeocodeComplete: () => void;
};

/**
 * Адрес отправителя и адрес клиента: справочники, строка адреса и карта.
 *
 * Обе колонки формы состоят из одних и тех же полей, различаются подписями и
 * шириной строки.
 */
const AddressFields = ({
  owner,
  form,
  regions,
  districts,
  regionsLoading,
  districtsLoading,
  regionId,
  address,
  location,
  geocodeAddress,
  geocodeRequestKey,
  forcedGeocodeAddress,
  addressLabelKey,
  addressPlaceholderKey,
  addressRequiredKey,
  locationLabelKey,
  wideRowClassName = "form-inputs form-inputs-organization",
  referenceLabel,
  onRegionChange,
  onDistrictChange,
  onAddressSelect,
  onForcedGeocodeComplete,
}: AddressFieldsProps) => {
  const { t } = useTranslation();

  const locationRule = {
    validator: (_: unknown, value: Location | undefined) =>
      isValidLocation(value)
        ? Promise.resolve()
        : Promise.reject(
            new Error(
              t("salesOrders.createValidation.locationRequired", {
                defaultValue: "Отметьте точку на карте",
              }),
            ),
          ),
  };

  const locationValueProps = (value?: Location) => ({
    value: isValidLocation(value) ? `${value?.latitude}, ${value?.longitude}` : "",
  });

  return (
    <>
      <div className="form-inputs form-inputs-organization">
        <Form.Item
          className="input"
          name={[owner, "addressDetails", "regionId"]}
          label={t("salesOrders.createFields.region", { defaultValue: "Region" })}
          rules={[
            {
              required: true,
              message: t("salesOrders.createValidation.regionRequired", {
                defaultValue: "Select region",
              }),
            },
          ]}
        >
          <Select
            className="input"
            size="large"
            loading={regionsLoading}
            options={regions.map((region) => ({
              value: getReferenceValue(region),
              label: referenceLabel(region),
            }))}
            onChange={onRegionChange}
            placeholder={t("salesOrders.createPlaceholders.region", { defaultValue: "Region" })}
          />
        </Form.Item>
        <Form.Item
          className="input"
          name={[owner, "addressDetails", "districtId"]}
          label={t("salesOrders.createFields.district", { defaultValue: "District" })}
          rules={[
            {
              required: true,
              message: t("salesOrders.createValidation.districtRequired", {
                defaultValue: "Select district",
              }),
            },
          ]}
        >
          <Select
            className="input"
            size="large"
            disabled={!regionId}
            loading={districtsLoading}
            onChange={onDistrictChange}
            options={districts.map((district) => ({
              value: getReferenceValue(district),
              label: referenceLabel(district),
            }))}
            placeholder={t("salesOrders.createPlaceholders.district", {
              defaultValue: "District",
            })}
          />
        </Form.Item>
      </div>
      <div className={wideRowClassName}>
        <Form.Item
          className="input"
          name={[owner, "addressDetails", "address"]}
          label={t(addressLabelKey)}
          rules={[{ required: true, message: t(addressRequiredKey) }]}
        >
          <Input className="input" size="large" placeholder={t(addressPlaceholderKey)} />
        </Form.Item>
      </div>
      <div className={wideRowClassName}>
        <Form.Item
          className="input"
          name={[owner, "addressDetails", "location"]}
          label={t(locationLabelKey)}
          getValueProps={locationValueProps}
          rules={[locationRule]}
        >
          <Input
            className="input"
            size="large"
            disabled
            placeholder={t("salesOrders.createPlaceholders.location", {
              defaultValue: "Отметьте точку на карте",
            })}
          />
        </Form.Item>
      </div>
      <YandexAddressMap
        address={address}
        forcedGeocodeAddress={forcedGeocodeAddress}
        geocodeAddress={geocodeAddress}
        geocodeRequestKey={geocodeRequestKey}
        location={location}
        onAddressChange={(nextAddress) => {
          form.setFieldValue([owner, "addressDetails", "address"], nextAddress);
        }}
        onAddressSelect={onAddressSelect}
        onForcedGeocodeComplete={onForcedGeocodeComplete}
        onLocationChange={(nextLocation) => {
          form.setFieldValue([owner, "addressDetails", "location"], nextLocation);
          void form
            .validateFields([[owner, "addressDetails", "location"]])
            .catch(() => undefined);
        }}
      />
    </>
  );
};

export default AddressFields;
