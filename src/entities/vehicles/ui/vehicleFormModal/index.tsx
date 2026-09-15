import { Form, Input, InputNumber, Select } from "antd";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "app/store";
import { useCan } from "entities/access/lib";
import { getOrganizationById } from "entities/organization/model";
import { createVehicle, updateVehicle, verifyVehicleOwnership } from "entities/vehicles/model";
import { VehicleType, type CreateVehicleDto } from "entities/vehicles/dtos";
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
};

type OwnershipStatus = "idle" | "checking" | "found" | "not-registered" | "error";

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

const getVehiclePayload = (values: VehicleFormValues): Omit<CreateVehicleDto, "companyId"> => ({
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

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    ownershipRequestRef.current += 1;
    setOwnershipStatus("idle");

    if (mode === "edit" && vehicle) {
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
      });
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

  const verifyOwnership = async (plateNumber: string) => {
    const regNumber = plateNumber.trim();

    if (!canVerifyOwnership || !regNumber) {
      resetOwnershipCheck();
      return;
    }

    if (!companyTin || !TIN_OR_PINFL_PATTERN.test(companyTin)) {
      resetOwnershipCheck();
      return;
    }

    const requestId = ownershipRequestRef.current + 1;
    ownershipRequestRef.current = requestId;
    setOwnershipStatus("checking");

    const result = await dispatch(
      verifyVehicleOwnership({ tinOrPinfl: companyTin, regNumber })
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
    form.setFieldValue("plateNumber", normalizePlateNumber(event.target.value));
    if (ownershipStatus !== "idle") {
      form.setFieldValue("stateRegistrationModel", undefined);
      resetOwnershipCheck();
    }
  };

  const handlePlateNumberBlur = () => {
    void verifyOwnership(form.getFieldValue("plateNumber") ?? "");
  };

  const handleRegistrationCertificateNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue(
      "registrationCertificateNumber",
      normalizeRegistrationCertificateNumber(event.target.value)
    );
  };

  const handleSubmit = async (values: VehicleFormValues) => {
    if (mode === "create") {
      if (!companyId) return;

      const result = await dispatch(
        createVehicle({ companyId, ...getVehiclePayload(values) } as CreateVehicleDto)
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
      updateVehicle({ id: vehicle.id, data: getVehiclePayload(values) })
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
              onBlur={handlePlateNumberBlur}
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
              help={
                ownershipStatus === "checking"
                  ? t("vehicles.ownership.checking")
                  : ownershipStatus === "found"
                    ? t("vehicles.ownership.found")
                    : undefined
              }
            >
              <Input
                className="input"
                size="large"
                disabled
                placeholder={t("vehicles.placeholders.stateRegistrationModel")}
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
