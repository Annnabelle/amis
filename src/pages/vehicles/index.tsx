import { Form, Input, InputNumber, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "app/store";
import { useCan } from "entities/access/lib";
import {
  createVehicle,
  deleteVehicle,
  getVehicles,
  updateVehicle,
} from "entities/vehicles/model";
import {
  VehicleType,
  type CreateVehicleDto,
} from "entities/vehicles/dtos";
import type { Vehicle } from "entities/vehicles/types";
import { VehiclesTableColumns } from "entities/vehicles/ui/tableData/vehicles";
import type { VehiclesTableDataType } from "entities/vehicles/ui/tableData/vehicles/types";
import { endpointAccessMap } from "shared/config/endpointAccessMap";
import CustomButton from "shared/ui/button";
import FormComponent from "shared/ui/formComponent";
import MainLayout from "shared/ui/layout";
import Heading from "shared/ui/mainHeading";
import ModalWindow from "shared/ui/modalWindow";
import ComponentTable from "shared/ui/table";

type VehicleFormValues = {
  name: string;
  type: VehicleType;
  plateNumber: string;
  brand: string;
  model: string;
  year?: number;
  loadCapacityKg?: number;
  volumeCapacityM3?: number;
  vin?: string;
  registrationCertificateNumber?: string;
};

const normalizePlateNumber = (value: string) => {
  const raw = value.toUpperCase().replace(/[^0-9A-Z]/g, "");
  const region = raw.slice(0, 2).replace(/\D/g, "");
  const rest = raw.slice(2);

  if (!region) {
    return "";
  }

  if (/^[A-Z]/.test(rest)) {
    const letter = rest.slice(0, 1);
    const digits = rest.slice(1, 4).replace(/\D/g, "");
    const tail = rest.slice(4, 7).replace(/[^A-Z]/g, "");
    return [region, letter, digits, tail].filter(Boolean).join(" ").slice(0, 11);
  }

  const lettersIndex = rest.search(/[A-Z]/);
  if (lettersIndex >= 0) {
    const digits = rest.slice(0, 3).replace(/\D/g, "");
    const tail = rest.slice(3).replace(/[^A-Z]/g, "").slice(0, 3);
    return [region, digits, tail].filter(Boolean).join(" ").slice(0, 11);
  }

  const digits = rest.replace(/\D/g, "").slice(0, 6);
  if (digits.length <= 3) {
    return [region, digits].filter(Boolean).join(" ").slice(0, 6);
  }

  return [region, digits.slice(0, 3), digits.slice(3)].filter(Boolean).join(" ").slice(0, 11);
};

const normalizePayloadPlateNumber = (value: string) => value.toUpperCase().replace(/[^0-9A-Z]/g, "");

const isValidPlateNumber = (value: string) => {
  const raw = normalizePayloadPlateNumber(value);
  const region = parseInt(raw.slice(0, 2), 10);

  if (Number.isNaN(region) || region < 0 || region > 95) {
    return false;
  }

  const privatePattern = /^\d{2}[A-Z]\d{3}[A-Z]{2}$/;
  const businessPattern = /^\d{2}\d{3}[A-Z]{3}$/;
  const foreignPattern = /^\d{2}\d{6}$/;

  return privatePattern.test(raw) || businessPattern.test(raw) || foreignPattern.test(raw);
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
  plateNumber: normalizePayloadPlateNumber(values.plateNumber),
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

const Vehicles = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm<VehicleFormValues>();
  const vehicles = useAppSelector((state) => state.vehicles.vehicles);
  const dataTotal = useAppSelector((state) => state.vehicles.total);
  const dataPage = useAppSelector((state) => state.vehicles.page);
  const dataLimit = useAppSelector((state) => state.vehicles.limit);
  const isLoading = useAppSelector((state) => state.vehicles.isLoading);
  const canRead = useCan(endpointAccessMap.vehiclesRead);
  const canCreate = useCan(endpointAccessMap.vehiclesCreate);
  const canUpdate = useCan(endpointAccessMap.vehiclesUpdate);
  const canDelete = useCan(endpointAccessMap.vehiclesDelete);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [modalState, setModalState] = useState({
    create: false,
    edit: false,
    delete: false,
  });

  useEffect(() => {
    if (!orgId) return;
    dispatch(getVehicles({ page: 1, limit: 10, sortOrder: "asc" }));
  }, [dispatch, orgId]);

  const tableData = useMemo<VehiclesTableDataType[]>(
    () =>
      vehicles.map((vehicle) => ({
        key: vehicle.id,
        name: vehicle.name,
        plateNumber: vehicle.plateNumber,
        comment: [vehicle.characteristics.brand, vehicle.characteristics.model].filter(Boolean).join(" "),
        createdAt: vehicle.createdAt ? dayjs(vehicle.createdAt).format("DD.MM.YYYY") : "-",
      })),
    [vehicles]
  );

  const openModal = (name: keyof typeof modalState, value: boolean) => {
    if (!value && (name === "create" || name === "edit")) {
      form.resetFields();
    }

    setModalState((prev) => ({ ...prev, [name]: value }));
  };

  const refreshList = (page = dataPage, limit = dataLimit) => {
    dispatch(getVehicles({ page, limit, sortOrder: "asc" }));
  };

  const handlePlateNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue("plateNumber", normalizePlateNumber(event.target.value));
  };

  const handleRegistrationCertificateNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue(
      "registrationCertificateNumber",
      normalizeRegistrationCertificateNumber(event.target.value)
    );
  };

  const handleTableAction = async (
    action: "details" | "edit" | "delete",
    record: VehiclesTableDataType
  ) => {
    const vehicle = vehicles.find((item) => item.id === record.key) ?? null;
    setSelectedVehicle(vehicle);

    if (action === "details") {
      navigate(`/organization/${orgId}/vehicles/${record.key}`);
      return;
    }

    if (action === "edit" && vehicle) {
      form.setFieldsValue({
        type: vehicle.type,
        name: vehicle.name,
        plateNumber: normalizePlateNumber(vehicle.plateNumber),
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
      openModal("edit", true);
      return;
    }

    openModal("delete", true);
  };

  const handleCreate = async (values: VehicleFormValues) => {
    if (!orgId) return;

    const result = await dispatch(createVehicle({
      companyId: orgId,
      ...getVehiclePayload(values),
    } as CreateVehicleDto));

    if (createVehicle.fulfilled.match(result)) {
      toast.success(t("vehicles.messages.success.create"));
      openModal("create", false);
      refreshList(1, dataLimit);
      return;
    }

    toast.error(result.payload ?? t("vehicles.messages.error.create"));
  };

  const handleUpdate = async (values: VehicleFormValues) => {
    if (!selectedVehicle) return;
    const result = await dispatch(
      updateVehicle({
        id: selectedVehicle.id,
        data: getVehiclePayload(values),
      })
    );

    if (updateVehicle.fulfilled.match(result)) {
      toast.success(t("vehicles.messages.success.update"));
      openModal("edit", false);
      refreshList();
      return;
    }

    toast.error(result.payload ?? t("vehicles.messages.error.update"));
  };

  const handleDelete = async () => {
    if (!selectedVehicle) return;
    const result = await dispatch(deleteVehicle(selectedVehicle.id));

    if (deleteVehicle.fulfilled.match(result)) {
      toast.success(t("vehicles.messages.success.delete"));
      openModal("delete", false);
      refreshList();
      return;
    }

    toast.error(result.payload ?? t("vehicles.messages.error.delete"));
  };

  const renderVehicleForm = (
    onFinish: (values: VehicleFormValues) => void,
    submitLabel = t("btn.create")
  ) => (
    <FormComponent form={form} onFinish={onFinish}>
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
        <Form.Item className="input" name="year" label={t("vehicles.fields.year")}>
          <InputNumber className="input" size="large" min={1900} max={2100} style={{ width: "100%" }} />
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

      <CustomButton type="submit">{submitLabel}</CustomButton>
    </FormComponent>
  );

  return (
    <MainLayout>
      <Heading title={t("vehicles.title")} subtitle={t("common.total")} totalAmount={`${dataTotal}`}>
        {canCreate && (
          <CustomButton onClick={() => openModal("create", true)}>
            {t("vehicles.actions.create")}
          </CustomButton>
        )}
      </Heading>

      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <ComponentTable<VehiclesTableDataType>
              loading={isLoading}
              columns={VehiclesTableColumns(t, handleTableAction, { canUpdate, canDelete })}
              data={tableData}
              onRowClick={canRead ? (record) => handleTableAction("details", record) : undefined}
              pagination={{
                current: dataPage,
                pageSize: dataLimit,
                total: dataTotal,
                showSizeChanger: { showSearch: false },
                pageSizeOptions: ["10", "20", "30", "40", "50"],
                locale: { items_per_page: "" },
                onChange: (page, limit) => refreshList(page, limit),
              }}
            />
          </div>
        </div>
      </div>

      <ModalWindow
        className="modal-large"
        titleAction={t("users.modalWindow.adding")}
        title={t("vehicles.modal.vehicle")}
        openModal={modalState.create}
        closeModal={() => openModal("create", false)}
      >
        {renderVehicleForm(handleCreate)}
      </ModalWindow>

      <ModalWindow
        className="modal-large"
        titleAction={t("btn.edit")}
        title={t("vehicles.modal.vehicle")}
        openModal={modalState.edit}
        closeModal={() => openModal("edit", false)}
      >
        {renderVehicleForm(handleUpdate, t("btn.save"))}
      </ModalWindow>

      <ModalWindow
        titleAction={t("btn.delete")}
        title={t("vehicles.modal.vehicle")}
        openModal={modalState.delete}
        closeModal={() => openModal("delete", false)}
        classDangerName="danger-title"
      >
        <div className="delete-modal">
          <div className="delete-modal-title">
            <p className="title">{t("vehicles.deleteQuestion")}</p>
            <p className="subtitle">{selectedVehicle?.name ?? ""}</p>
          </div>
          <div className="delete-modal-btns">
            <CustomButton variant="danger" onClick={handleDelete}>
              {t("btn.delete")}
            </CustomButton>
            <CustomButton variant="outline" onClick={() => openModal("delete", false)}>
              {t("btn.cancel")}
            </CustomButton>
          </div>
        </div>
      </ModalWindow>
    </MainLayout>
  );
};

export default Vehicles;
