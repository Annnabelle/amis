import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "app/store";
import { useCan } from "entities/access/lib";
import { deleteVehicle, getVehicles } from "entities/vehicles/model";
import type { Vehicle } from "entities/vehicles/types";
import { VehiclesTableColumns } from "entities/vehicles/ui/tableData/vehicles";
import type { VehiclesTableDataType } from "entities/vehicles/ui/tableData/vehicles/types";
import { VehicleFormModal } from "entities/vehicles/ui/vehicleFormModal";
import { endpointAccessMap } from "shared/config/endpointAccessMap";
import CustomButton from "shared/ui/button";
import MainLayout from "shared/ui/layout";
import Heading from "shared/ui/mainHeading";
import ModalWindow from "shared/ui/modalWindow";
import ComponentTable from "shared/ui/table";

const Vehicles = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
    setModalState((prev) => ({ ...prev, [name]: value }));
  };

  const refreshList = (page = dataPage, limit = dataLimit) => {
    dispatch(getVehicles({ page, limit, sortOrder: "asc" }));
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
      openModal("edit", true);
      return;
    }

    openModal("delete", true);
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

      <VehicleFormModal
        mode="create"
        open={modalState.create}
        onClose={() => openModal("create", false)}
        companyId={orgId}
        onSaved={() => refreshList(1, dataLimit)}
      />

      <VehicleFormModal
        mode="edit"
        open={modalState.edit}
        onClose={() => openModal("edit", false)}
        companyId={orgId}
        vehicle={selectedVehicle}
        onSaved={() => refreshList()}
      />

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
