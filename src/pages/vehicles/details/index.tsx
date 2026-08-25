import { Spin } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "app/store";
import { getVehicleById } from "entities/vehicles/model";
import CustomButton from "shared/ui/button";
import {
  DetailCard,
  DetailGrid,
  DetailItems,
} from "shared/ui/details";
import FormComponent from "shared/ui/formComponent";
import MainLayout from "shared/ui/layout";
import Heading from "shared/ui/mainHeading";
import { useNavigationBack } from "shared/lib";
import "./styles.sass";

const formatValue = (value: string | number | undefined | null) =>
  value === undefined || value === null || value === "" ? "-" : String(value);

const VehicleDetails = () => {
  const { orgId, id } = useParams<{ orgId: string; id: string }>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigateBack = useNavigationBack();
  const vehicle = useAppSelector((state) => state.vehicles.vehicleById);
  const loading = useAppSelector((state) => state.vehicles.loadingById);

  useEffect(() => {
    if (id) {
      dispatch(getVehicleById(id));
    }
  }, [dispatch, id]);

  if (loading || !vehicle || vehicle.id !== id) {
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
      <Heading
        title={vehicle.name}
        subtitle={t("vehicles.title")}
      >
        <CustomButton onClick={() => navigateBack(`/organization/${orgId}/vehicles`)}>
          {t("btn.back")}
        </CustomButton>
      </Heading>

      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <FormComponent>
              <DetailGrid className="vehicle-details-grid">
                <DetailCard title={t("vehicles.details.main")}>
                  <DetailItems
                    items={[
                      { label: t("vehicles.fields.name"), value: vehicle.name },
                      { label: t("vehicles.fields.plateNumber"), value: vehicle.plateNumber },
                      { label: t("vehicles.fields.type"), value: t(`vehicles.types.${vehicle.type}`) },
                      { label: t("vehicles.fields.status"), value: t(`vehicles.statuses.${vehicle.status}`) },
                    ]}
                  />
                </DetailCard>

                <DetailCard title={t("vehicles.details.characteristics")}>
                  <DetailItems
                    items={[
                      { label: t("vehicles.fields.brand"), value: vehicle.characteristics.brand },
                      { label: t("vehicles.fields.model"), value: vehicle.characteristics.model },
                      { label: t("vehicles.fields.year"), value: formatValue(vehicle.characteristics.year) },
                      { label: t("vehicles.fields.loadCapacityKg"), value: formatValue(vehicle.characteristics.loadCapacityKg) },
                      { label: t("vehicles.fields.volumeCapacityM3"), value: formatValue(vehicle.characteristics.volumeCapacityM3) },
                    ]}
                  />
                </DetailCard>

                <DetailCard title={t("vehicles.details.identification")}>
                  <DetailItems
                    items={[
                      { label: t("vehicles.fields.vin"), value: formatValue(vehicle.identification.vin) },
                      {
                        label: t("vehicles.fields.registrationCertificateNumber"),
                        value: formatValue(vehicle.identification.registrationCertificateNumber),
                      },
                    ]}
                  />
                </DetailCard>

                <DetailCard title={t("vehicles.details.system")}>
                  <DetailItems
                    items={[
                      {
                        label: t("vehicles.fields.createdAt"),
                        value: vehicle.createdAt ? dayjs(vehicle.createdAt).format("DD.MM.YYYY") : "-",
                      },
                      {
                        label: t("vehicles.fields.updatedAt"),
                        value: vehicle.updatedAt ? dayjs(vehicle.updatedAt).format("DD.MM.YYYY") : "-",
                      },
                    ]}
                  />
                </DetailCard>
              </DetailGrid>
            </FormComponent>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default VehicleDetails;
