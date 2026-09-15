import { Form, Input, InputNumber, Radio, Select, type RadioChangeEvent } from "antd";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "app/store";
import { useCan } from "entities/access/lib";
import { getCompanyByTin, getOrganizationById } from "entities/organization/model";
import { createVehicle, updateVehicle, verifyVehicleOwnership } from "entities/vehicles/model";
import { VehicleOwnershipType, VehicleType, type CreateVehicleDto, type VehicleOwnerDto } from "entities/vehicles/dtos";
import type { Vehicle } from "entities/vehicles/types";
import { endpointAccessMap } from "shared/config/endpointAccessMap";
import CustomButton from "shared/ui/button";
import FormComponent from "shared/ui/formComponent";
import ModalWindow from "shared/ui/modalWindow";

export type VehicleFormValues = {
  name: string;
  type: VehicleType;
  plateNumber: string;
  stateRegistrationModel?: string;
  brand: string;
  model: string;
  year?: number;
  loadCapacityKg?: number;
  volumeCapacityM3?: number;
  vin?: string;
  registrationCertificateNumber?: string;
  ownershipType: VehicleOwnershipType;
  ownerTinOrPinfl?: string;
  ownerName?: string;
};

type OwnershipStatus = "idle" | "checking" | "found" | "not-registered" | "error";
type OwnerLookupStatus = "idle" | "checking" | "found" | "not-found";

const TIN_OR_PINFL_PATTERN = /^(\d{9}|\d{14})$/;

const normalizePlateNumber = (value: string) => {
  const raw = value.toUpperCase().replace(/[^0-9A-Z]/g, "");
  const region = raw.slice(0, 2).replace(/\D/g, "");
  const rest = raw.slice(2, 9);

  if (!region) {
    return "";
  }

  if (/^[A-Z]/.test(rest)) {
    // 00 A 000 AA или 00 A 000000
    const letter = rest.slice(0, 1);
    const afterLetter = rest.slice(1);
    const digits = (afterLetter.match(/^\d+/)?.[0] ?? "").slice(0, 6);
    const tail = afterLetter.slice(digits.length).replace(/[^A-Z]/g, "").slice(0, 2);
    return [region, letter, digits, tail].filter(Boolean).join(" ");
  }

  // 00 000 AAA или 00 0000 AA
  const digits = (rest.match(/^\d+/)?.[0] ?? "").slice(0, 4);
  const tailMaxLength = digits.length >= 4 ? 2 : 3;
  const tail = rest.slice(digits.length).replace(/[^A-Z]/g, "").slice(0, tailMaxLength);
  return [region, digits, tail].filter(Boolean).join(" ");
};

const normalizePayloadPlateNumber = (value: string) => value.toUpperCase().replace(/[^0-9A-Z]/g, "");

const isValidPlateNumber = (value: string) => {
  const raw = normalizePayloadPlateNumber(value);
  const region = parseInt(raw.slice(0, 2), 10);

  if (Number.isNaN(region) || region < 0 || region > 95) {
    return false;
  }

  const privatePattern = /^\d{2}[A-Z]\d{3}[A-Z]{2}$/; // 00 A 000 AA
  const businessPattern = /^\d{2}\d{3}[A-Z]{3}$/; // 00 000 AAA
  const businessAltPattern = /^\d{2}\d{4}[A-Z]{2}$/; // 00 0000 AA
  const foreignPattern = /^\d{2}[A-Z]\d{6}$/; // 00 A 000000

  return (
    privatePattern.test(raw) ||
    businessPattern.test(raw) ||
    businessAltPattern.test(raw) ||
    foreignPattern.test(raw)
  );
};

const normalizeRegistrationCertificateNumber = (value: string) => {
  const raw = value.toUpperCase().replace(/[^0-9A-Z]/g, "");
  const series = raw.slice(0, 2).replace(/[^A-Z]/g, "");
  const number = raw.slice(2).replace(/\D/g, "").slice(0, 7);

  return [series, number].filter(Boolean).join(" ").slice(0, 10);
};

const normalizePayloadRegistrationCertificateNumber = (value: string) =>
  value.toUpperCase().replace(/[^0-9A-Z]/g, "");

const isValidRegistrationCertificateNumber = (value: string) =>
  /^[A-Z]{2}\d{7}$/.test(normalizePayloadRegistrationCertificateNumber(value));

const getVehiclePayload = (
  values: VehicleFormValues,
  owner: VehicleOwnerDto | null
): Omit<CreateVehicleDto, "companyId"> => ({
  type: values.type,
  displayName: values.name.trim(),
  plateNumber: values.plateNumber.trim(),
  stateRegistrationModel: values.stateRegistrationModel?.trim() || undefined,
  identification: {
    vin: values.vin?.trim() || undefined,
    registrationCertificateNumber: values.registrationCertificateNumber
      ? normalizePayloadRegistrationCertificateNumber(values.registrationCertificateNumber)
      : undefined,
  },
  characteristics: {
    brand: values.brand.trim(),
    model: values.model.trim(),
    year: values.year,
    loadCapacityKg: values.loadCapacityKg,
    volumeCapacityM3: values.volumeCapacityM3,
  },
  ownershipType: values.ownershipType,
  owner: values.ownershipType === VehicleOwnershipType.External ? owner ?? undefined : undefined,
});

type VehicleFormModalProps = {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  companyId?: string;
  vehicle?: Vehicle | null;
  initialPlateNumber?: string;
  onSaved: (vehicle: Vehicle) => void;
};

export const VehicleFormModal = ({
  open,
  onClose,
  mode,
  companyId,
  vehicle,
  initialPlateNumber,
  onSaved,
}: VehicleFormModalProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm<VehicleFormValues>();
  const canVerifyOwnership = useCan(endpointAccessMap.vehiclesVerifyOwnership);
  const [companyTin, setCompanyTin] = useState<string | null>(null);
  const [ownershipStatus, setOwnershipStatus] = useState<OwnershipStatus>("idle");
  const ownershipRequestRef = useRef(0);
  const [ownerLookupStatus, setOwnerLookupStatus] = useState<OwnerLookupStatus>("idle");
  const [ownerData, setOwnerData] = useState<VehicleOwnerDto | null>(null);
  const ownerLookupRequestRef = useRef(0);
  const ownershipType = Form.useWatch("ownershipType", form);

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    ownershipRequestRef.current += 1;
    setOwnershipStatus("idle");
    ownerLookupRequestRef.current += 1;
    setOwnerLookupStatus("idle");
    setOwnerData(null);

    if (mode === "edit" && vehicle) {
      const isExternalOwner = vehicle.ownershipType === VehicleOwnershipType.External;
      form.setFieldsValue({
        type: vehicle.type,
        name: vehicle.name,
        plateNumber: normalizePlateNumber(vehicle.plateNumber),
        stateRegistrationModel: vehicle.stateRegistrationModel,
        brand: vehicle.characteristics.brand,
        model: vehicle.characteristics.model,
        year: vehicle.characteristics.year,
        loadCapacityKg: vehicle.characteristics.loadCapacityKg,
        volumeCapacityM3: vehicle.characteristics.volumeCapacityM3,
        vin: vehicle.identification.vin,
        registrationCertificateNumber: vehicle.identification.registrationCertificateNumber
          ? normalizeRegistrationCertificateNumber(vehicle.identification.registrationCertificateNumber)
          : undefined,
        ownershipType: isExternalOwner ? VehicleOwnershipType.External : VehicleOwnershipType.Owned,
        ownerTinOrPinfl: vehicle.owner?.tin ?? vehicle.owner?.pinfl,
        ownerName: vehicle.owner?.name,
      });
      if (isExternalOwner && vehicle.owner) {
        setOwnerData(vehicle.owner);
        setOwnerLookupStatus("found");
      }
    } else if (initialPlateNumber) {
      form.setFieldValue("plateNumber", normalizePlateNumber(initialPlateNumber));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode, vehicle]);

  useEffect(() => {
    if (!open || !companyId || !canVerifyOwnership) {
      setCompanyTin(null);
      return;
    }

    dispatch(getOrganizationById({ id: companyId }))
      .unwrap()
      .then((company) => setCompanyTin(company.tin ?? null))
      .catch(() => setCompanyTin(null));
  }, [open, companyId, canVerifyOwnership, dispatch]);

  const resetOwnershipCheck = () => {
    ownershipRequestRef.current += 1;
    setOwnershipStatus("idle");
  };

  const verifyOwnership = async (plateNumber: string, overrideTinOrPinfl?: string) => {
    const regNumber = plateNumber.trim();

    const tinOrPinflValue =
      overrideTinOrPinfl ??
      (ownershipType === VehicleOwnershipType.External
        ? ownerData?.tin ?? ownerData?.pinfl
        : companyTin);

    if (!canVerifyOwnership || !regNumber || !tinOrPinflValue || !TIN_OR_PINFL_PATTERN.test(tinOrPinflValue)) {
      resetOwnershipCheck();
      return;
    }

    const requestId = ownershipRequestRef.current + 1;
    ownershipRequestRef.current = requestId;
    setOwnershipStatus("checking");

    const result = await dispatch(
      verifyVehicleOwnership({ tinOrPinfl: tinOrPinflValue, regNumber })
    );

    if (ownershipRequestRef.current !== requestId) return;

    if (verifyVehicleOwnership.fulfilled.match(result)) {
      if (result.payload.status === "found") {
        form.setFieldValue("stateRegistrationModel", result.payload.ownership.model);
        setOwnershipStatus("found");
      } else {
        form.setFieldValue("stateRegistrationModel", undefined);
        setOwnershipStatus("not-registered");
        toast.error(result.payload.message);
      }
      return;
    }

    form.setFieldValue("stateRegistrationModel", undefined);
    setOwnershipStatus("error");
    if (result.payload) {
      toast.error(result.payload);
    }
  };

  const handlePlateNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const normalized = normalizePlateNumber(event.target.value);
    form.setFieldValue("plateNumber", normalized);

    if (isValidPlateNumber(normalized)) {
      void verifyOwnership(normalized);
    } else if (ownershipStatus !== "idle") {
      form.setFieldValue("stateRegistrationModel", undefined);
      resetOwnershipCheck();
    }
  };

  const handleRegistrationCertificateNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue(
      "registrationCertificateNumber",
      normalizeRegistrationCertificateNumber(event.target.value)
    );
  };

  const resetOwnerLookup = () => {
    ownerLookupRequestRef.current += 1;
    setOwnerLookupStatus("idle");
    setOwnerData(null);
    form.setFieldValue("ownerName", undefined);
  };

  const lookupOwner = async (value: string) => {
    if (!TIN_OR_PINFL_PATTERN.test(value)) {
      resetOwnerLookup();
      return;
    }

    const requestId = ownerLookupRequestRef.current + 1;
    ownerLookupRequestRef.current = requestId;
    setOwnerLookupStatus("checking");
    form.setFieldValue("ownerName", undefined);

    try {
      const company = await dispatch(getCompanyByTin(value)).unwrap();

      if (ownerLookupRequestRef.current !== requestId) return;

      if (!company) {
        setOwnerData(null);
        setOwnerLookupStatus("not-found");
        toast.error(t("vehicles.ownerLookup.notFound"));
        return;
      }

      const owner: VehicleOwnerDto = {
        tin: value.length === 9 ? value : undefined,
        pinfl: value.length === 14 ? value : undefined,
        name: company.displayName || company.legalName || value,
      };

      setOwnerData(owner);
      setOwnerLookupStatus("found");
      form.setFieldValue("ownerName", owner.name);

      const currentPlateNumber = form.getFieldValue("plateNumber");
      if (currentPlateNumber && isValidPlateNumber(currentPlateNumber)) {
        void verifyOwnership(currentPlateNumber, value);
      }
    } catch {
      if (ownerLookupRequestRef.current !== requestId) return;
      setOwnerData(null);
      setOwnerLookupStatus("not-found");
      toast.error(t("vehicles.ownerLookup.notFound"));
    }
  };

  const handleOwnershipTypeChange = (event: RadioChangeEvent) => {
    const nextType = event.target.value as VehicleOwnershipType;
    form.setFieldValue("ownerTinOrPinfl", undefined);
    resetOwnerLookup();
    form.setFieldValue("stateRegistrationModel", undefined);
    resetOwnershipCheck();

    const currentPlateNumber = form.getFieldValue("plateNumber");
    if (nextType === VehicleOwnershipType.Owned && currentPlateNumber && isValidPlateNumber(currentPlateNumber) && companyTin) {
      void verifyOwnership(currentPlateNumber, companyTin);
    }
  };

  const handleOwnerTinOrPinflChange = (event: ChangeEvent<HTMLInputElement>) => {
    const normalized = event.target.value.replace(/\D/g, "").slice(0, 14);
    form.setFieldValue("ownerTinOrPinfl", normalized);

    if (TIN_OR_PINFL_PATTERN.test(normalized)) {
      void lookupOwner(normalized);
    } else if (ownerLookupStatus !== "idle") {
      resetOwnerLookup();
    }
  };

  const handleSubmit = async (values: VehicleFormValues) => {
    if (values.ownershipType === VehicleOwnershipType.External && !ownerData) {
      toast.error(t("vehicles.validation.ownerRequired"));
      return;
    }

    if (mode === "create") {
      if (!companyId) return;

      const result = await dispatch(
        createVehicle({ companyId, ...getVehiclePayload(values, ownerData) } as CreateVehicleDto)
      );

      if (createVehicle.fulfilled.match(result)) {
        toast.success(t("vehicles.messages.success.create"));
        onSaved(result.payload);
        onClose();
        return;
      }

      toast.error(result.payload ?? t("vehicles.messages.error.create"));
      return;
    }

    if (!vehicle) return;

    const result = await dispatch(
      updateVehicle({ id: vehicle.id, data: getVehiclePayload(values, ownerData) })
    );

    if (updateVehicle.fulfilled.match(result)) {
      toast.success(t("vehicles.messages.success.update"));
      onSaved(result.payload);
      onClose();
      return;
    }

    toast.error(result.payload ?? t("vehicles.messages.error.update"));
  };

  return (
    <ModalWindow
      className="modal-large"
      titleAction={mode === "create" ? t("users.modalWindow.adding") : t("btn.edit")}
      title={t("vehicles.modal.vehicle")}
      openModal={open}
      closeModal={onClose}
    >
      <FormComponent form={form} onFinish={handleSubmit}>
        <div className="form-inputs form-inputs-row">
          <Form.Item
            className="input"
            name="ownershipType"
            label={t("vehicles.fields.ownershipType")}
            initialValue={VehicleOwnershipType.Owned}
          >
            <Radio.Group size="large" onChange={handleOwnershipTypeChange}>
              <Radio value={VehicleOwnershipType.Owned}>{t("vehicles.ownershipTypes.owned")}</Radio>
              <Radio value={VehicleOwnershipType.External}>{t("vehicles.ownershipTypes.external")}</Radio>
            </Radio.Group>
          </Form.Item>
        </div>

        {ownershipType === VehicleOwnershipType.External && (
          <div className="form-inputs form-inputs-row">
            <Form.Item
              className="input"
              name="ownerTinOrPinfl"
              label={t("vehicles.fields.ownerTinOrPinfl")}
              rules={[
                { required: true, message: t("vehicles.validation.ownerTinOrPinflRequired") },
                {
                  validator: (_, value: string | undefined) =>
                    !value || TIN_OR_PINFL_PATTERN.test(value)
                      ? Promise.resolve()
                      : Promise.reject(new Error(t("vehicles.validation.ownerTinOrPinflInvalid"))),
                },
              ]}
              validateStatus={
                ownerLookupStatus === "checking"
                  ? "validating"
                  : ownerLookupStatus === "found"
                    ? "success"
                    : ownerLookupStatus === "not-found"
                      ? "error"
                      : undefined
              }
              hasFeedback={ownerLookupStatus === "checking" || ownerLookupStatus === "found"}
            >
              <Input
                className="input"
                size="large"
                maxLength={14}
                placeholder={t("vehicles.placeholders.ownerTinOrPinfl")}
                onChange={handleOwnerTinOrPinflChange}
              />
            </Form.Item>

            <Form.Item
              className="input"
              name="ownerName"
              label={t("vehicles.fields.ownerName")}
            >
              <Input
                className="input"
                size="large"
                disabled
                placeholder={
                  ownerLookupStatus === "checking"
                    ? t("vehicles.ownerLookup.checking")
                    : ownerLookupStatus === "not-found"
                      ? t("vehicles.ownerLookup.notFound")
                      : t("vehicles.placeholders.ownerName")
                }
              />
            </Form.Item>
          </div>
        )}

        <div className="form-inputs form-inputs-row">
          <Form.Item
            className="input"
            name="plateNumber"
            label={t("vehicles.fields.plateNumber")}
            rules={[
              { required: true, message: t("vehicles.validation.plateNumberRequired") },
              {
                validator: (_, value: string | undefined) =>
                  !value || isValidPlateNumber(value)
                    ? Promise.resolve()
                    : Promise.reject(new Error(t("vehicles.validation.plateNumberInvalid"))),
              },
            ]}
          >
            <Input
              className="input"
              size="large"
              maxLength={11}
              placeholder={t("vehicles.placeholders.plateNumber")}
              onChange={handlePlateNumberChange}
            />
          </Form.Item>

          {canVerifyOwnership && (
            <Form.Item
              className="input"
              name="stateRegistrationModel"
              label={t("vehicles.fields.stateRegistrationModel")}
              validateStatus={
                ownershipStatus === "checking"
                  ? "validating"
                  : ownershipStatus === "found"
                    ? "success"
                    : ownershipStatus === "not-registered"
                      ? "warning"
                      : undefined
              }
              hasFeedback={ownershipStatus === "checking" || ownershipStatus === "found"}
            >
              <Input
                className="input"
                size="large"
                disabled
                placeholder={
                  ownershipStatus === "checking"
                    ? t("vehicles.ownership.checking")
                    : t("vehicles.placeholders.stateRegistrationModel")
                }
              />
            </Form.Item>
          )}
        </div>

        <div className="form-inputs form-inputs-row">
          <Form.Item
            className="input"
            name="name"
            label={t("vehicles.fields.name")}
            rules={[{ required: true, message: t("vehicles.validation.nameRequired") }]}
          >
            <Input className="input" size="large" placeholder={t("vehicles.placeholders.name")} />
          </Form.Item>

          <Form.Item
            className="input"
            name="type"
            label={t("vehicles.fields.type")}
            initialValue={VehicleType.Truck}
            rules={[{ required: true, message: t("vehicles.validation.typeRequired") }]}
          >
            <Select
              className="input"
              size="large"
              options={Object.values(VehicleType).map((type) => ({
                value: type,
                label: t(`vehicles.types.${type}`),
              }))}
            />
          </Form.Item>
        </div>

        <div className="form-inputs form-inputs-row">
          <Form.Item
            className="input"
            name="brand"
            label={t("vehicles.fields.brand")}
            rules={[{ required: true, message: t("vehicles.validation.brandRequired") }]}
          >
            <Input className="input" size="large" placeholder={t("vehicles.placeholders.brand")} />
          </Form.Item>

          <Form.Item
            className="input"
            name="model"
            label={t("vehicles.fields.model")}
            rules={[{ required: true, message: t("vehicles.validation.modelRequired") }]}
          >
            <Input className="input" size="large" placeholder={t("vehicles.placeholders.model")} />
          </Form.Item>
        </div>

        <div className="form-inputs form-inputs-row">
          <Form.Item
            className="input"
            name="registrationCertificateNumber"
            label={t("vehicles.fields.registrationCertificateNumber")}
            rules={[
              {
                validator: (_, value: string | undefined) =>
                  !value || isValidRegistrationCertificateNumber(value)
                    ? Promise.resolve()
                    : Promise.reject(new Error(t("vehicles.validation.registrationCertificateNumberInvalid"))),
              },
            ]}
          >
            <Input
              className="input"
              size="large"
              maxLength={10}
              placeholder={t("vehicles.placeholders.registrationCertificateNumber")}
              onChange={handleRegistrationCertificateNumberChange}
            />
          </Form.Item>

          <Form.Item className="input" name="vin" label={t("vehicles.fields.vin")}>
            <Input className="input" size="large" placeholder={t("vehicles.placeholders.vin")} />
          </Form.Item>
        </div>

        <div className="form-inputs form-inputs-row">
          <Form.Item className="input" name="loadCapacityKg" label={t("vehicles.fields.loadCapacityKg")}>
            <InputNumber className="input" size="large" min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item className="input" name="volumeCapacityM3" label={t("vehicles.fields.volumeCapacityM3")}>
            <InputNumber className="input" size="large" min={0} style={{ width: "100%" }} />
          </Form.Item>
        </div>

        <div className="form-inputs form-inputs-row">
          <Form.Item
            className="input"
            name="year"
            label={t("vehicles.fields.year")}
            style={{ maxWidth: "calc(50% - 10px)" }}
          >
            <InputNumber className="input" size="large" min={1900} max={2100} style={{ width: "100%" }} />
          </Form.Item>
        </div>

        <CustomButton type="submit">{mode === "create" ? t("btn.create") : t("btn.save")}</CustomButton>
      </FormComponent>
    </ModalWindow>
  );
};

export default VehicleFormModal;
