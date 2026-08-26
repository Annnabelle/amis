import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { DownloadOutlined } from "@ant-design/icons";
import { Empty, Segmented, Tag } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "app/store";
import { getWaybillById } from "entities/waybills/model";
import { getWaybillStatusKey } from "entities/waybills/lib/status";
import type {
  WaybillContractedPartySnapshotResponseDto,
  WaybillVehicleSnapshotResponseDto,
} from "entities/waybills/dtos";
import { getSalesOrderById } from "entities/salesOrders/model";
import { getDeliveryRouteById } from "entities/deliveryRoutes/model";
import { getDeliveryTaskById } from "entities/deliveryTasks/model";
import { useCan } from "entities/access/lib";
import { endpointAccessMap } from "shared/config/endpointAccessMap";
import axiosInstance from "shared/lib/axiosInstance";
import { BASE_URL, getFileNameFromDisposition } from "shared/lib";
import MainLayout from "shared/ui/layout";
import Heading from "shared/ui/mainHeading";
import CustomButton from "shared/ui/button";
import { statusColors } from "shared/ui/statuses";
import {
  DetailCard,
  DetailGrid,
  DetailItem,
  DetailItems,
  DetailStat,
  DetailStatsGrid,
  RouteMetaChip,
} from "shared/ui/details";
import "./styles.sass";

const formatDate = (value?: string) => (value ? dayjs(value).format("DD.MM.YYYY") : "-");
const formatDateTime = (value?: string) => (value ? dayjs(value).format("DD.MM.YYYY HH:mm") : "-");
const formatNumber = (value?: number) => (value != null ? value.toLocaleString() : "-");
const formatVehicle = (vehicle?: Partial<WaybillVehicleSnapshotResponseDto>) => {
  const parts = [vehicle?.registrationNumber, vehicle?.model].filter(Boolean);

  return parts.length ? parts.join(" / ") : "-";
};

type WaybillDetailsSection = "overview" | "parties" | "cargo" | "system";

const WaybillsDetails = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id, orgId } = useParams<{ id: string; orgId?: string }>();
  const { t } = useTranslation();
  const canReadSalesOrder = useCan(endpointAccessMap.salesOrdersRead);
  const canReadDeliveryRoute = useCan(endpointAccessMap.deliveryRoutesRead);
  const canReadDeliveryTask = useCan(endpointAccessMap.deliveryTasksRead);
  const [waybillFileLoading, setWaybillFileLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<WaybillDetailsSection>("overview");

  const waybill = useAppSelector((state) => state.waybills.waybillById);
  const isLoading = useAppSelector((state) => state.waybills.loadingById);
  const salesOrder = useAppSelector((state) => state.salesOrders.orderById);
  const deliveryRoute = useAppSelector((state) => state.deliveryRoutes.routeById);
  const deliveryTask = useAppSelector((state) => state.deliveryTasks.taskById);
  const listPath = orgId ? `/organization/${orgId}/waybills` : "/organization";

  useEffect(() => {
    if (!id) return;
    dispatch(getWaybillById({ id }));
  }, [dispatch, id]);

  useEffect(() => {
    if (!waybill || waybill.id !== id) return;

    if (waybill.salesOrderId && canReadSalesOrder) {
      dispatch(getSalesOrderById({ id: waybill.salesOrderId }));
    }

    if (waybill.deliveryRouteId && canReadDeliveryRoute) {
      dispatch(getDeliveryRouteById(waybill.deliveryRouteId));
    }

    if (waybill.deliveryTaskId && canReadDeliveryTask) {
      dispatch(getDeliveryTaskById(waybill.deliveryTaskId));
    }
  }, [
    canReadDeliveryRoute,
    canReadDeliveryTask,
    canReadSalesOrder,
    dispatch,
    id,
    waybill,
  ]);

  const linkedPath = (section: string, linkedId?: string) => {
    if (!linkedId) return undefined;
    return orgId ? `/organization/${orgId}/${section}/${linkedId}` : "/organization";
  };

  const handleWaybillFile = async (download: boolean) => {
    if (!id || waybillFileLoading) return;

    setWaybillFileLoading(true);

    try {
      const response = await axiosInstance.get(`${BASE_URL}/waybills/${id}/file`, {
        params: { download },
        responseType: "blob",
      });
      const blob = new Blob([response.data], {
        type: response.data.type || "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);

      if (download) {
        const filename =
          getFileNameFromDisposition(response.headers["content-disposition"]) ??
          `${waybill?.waybillNumber || id}.pdf`;
        const link = document.createElement("a");

        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        const openedWindow = window.open(url, "_blank");

        if (openedWindow) {
          openedWindow.opener = null;
          window.setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
        } else {
          window.URL.revokeObjectURL(url);
          toast.error(t("waybills.file.openError"));
        }
      }
    } catch {
      toast.error(t("waybills.file.loadError"));
    } finally {
      setWaybillFileLoading(false);
    }
  };

  if (isLoading && waybill?.id !== id) {
    return null;
  }

  if (!waybill || waybill.id !== id) {
    return (
      <MainLayout>
        <Heading title={t("waybills.detailsTitle")} subtitle={t("common.details")}>
          <CustomButton variant="outline" onClick={() => navigate(listPath)}>
            {t("common.backToList")}
          </CustomButton>
        </Heading>
        <div className="box">
          <div className="box-container">
            <div className="box-container-items">
              <Empty description={t("common.dataNotFound")} />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const waybillStatusKey = getWaybillStatusKey(waybill.status);
  const externalStatus = waybill.external?.status;
  const externalStatusLabel = externalStatus
    ? t(`waybills.externalStatuses.${externalStatus}`, { defaultValue: externalStatus })
    : "-";

  const metaItems = [
    { label: t("waybills.fields.date"), value: formatDate(waybill.date) },
    { label: t("waybills.fields.createdAt"), value: formatDateTime(waybill.createdAt) },
    { label: t("waybills.fields.updatedAt"), value: formatDateTime(waybill.updatedAt) },
  ];
  const cargoProductsCount = waybill.cargoGroups.reduce(
    (total, group) => total + group.products.length,
    0
  );

  const linkItems = [
    {
      label: t("waybills.fields.salesOrderId"),
      value: salesOrder?.id === waybill.salesOrderId ? salesOrder.salesOrderNumber : waybill.salesOrderId,
      path: canReadSalesOrder ? linkedPath("sales-orders", waybill.salesOrderId) : undefined,
    },
    {
      label: t("waybills.fields.deliveryRouteId"),
      value: deliveryRoute?.id === waybill.deliveryRouteId ? deliveryRoute.routeNumber : waybill.deliveryRouteId,
      path: canReadDeliveryRoute ? linkedPath("delivery-routes", waybill.deliveryRouteId) : undefined,
    },
    {
      label: t("waybills.fields.deliveryTaskId"),
      value: deliveryTask?.id === waybill.deliveryTaskId ? deliveryTask.taskNumber : waybill.deliveryTaskId,
      path: canReadDeliveryTask ? linkedPath("delivery-tasks", waybill.deliveryTaskId) : undefined,
    },
  ];

  const partySections = [
    {
      title: t("waybills.fields.sender"),
      items: [
        { label: t("waybills.fields.name"), value: waybill.parties.sender.legalName },
        { label: t("waybills.fields.tin"), value: waybill.parties.sender.tin },
        { label: t("waybills.fields.vatCode"), value: waybill.parties.sender.vatCode || "-" },
        { label: t("waybills.fields.address"), value: waybill.parties.sender.address.street },
        { label: t("waybills.fields.phone"), value: waybill.parties.sender.phone || "-" },
      ],
    },
    {
      title: t("waybills.fields.consignor"),
      items: [
        { label: t("waybills.fields.name"), value: waybill.parties.consignor.name },
        { label: t("waybills.fields.tinOrPinfl"), value: waybill.parties.consignor.tinOrPinfl },
        { label: t("waybills.fields.branch"), value: waybill.parties.consignor.branch?.name || "-" },
      ],
    },
    {
      title: t("waybills.fields.consignee"),
      items: [
        { label: t("waybills.fields.name"), value: waybill.parties.consignee.name },
        { label: t("waybills.fields.tinOrPinfl"), value: waybill.parties.consignee.tinOrPinfl },
        { label: t("waybills.fields.branch"), value: waybill.parties.consignee.branch?.name || "-" },
      ],
    },
    {
      title: t("waybills.fields.carrier"),
      items: [
        { label: t("waybills.fields.name"), value: waybill.parties.carrier.name },
        { label: t("waybills.fields.tinOrPinfl"), value: waybill.parties.carrier.tinOrPinfl },
        { label: t("waybills.fields.branch"), value: waybill.parties.carrier.branch?.name || "-" },
      ],
    },
  ];

  const optionalParties = [
    { title: t("waybills.fields.freightForwarder"), party: waybill.parties.freightForwarder },
    { title: t("waybills.fields.client"), party: waybill.parties.client },
    { title: t("waybills.fields.payer"), party: waybill.parties.payer },
  ].filter((item) => item.party);

  const getPartyContract = (party: NonNullable<(typeof optionalParties)[number]["party"]>) =>
    "contract" in party
      ? (party as WaybillContractedPartySnapshotResponseDto).contract
      : undefined;

  const fileMetaItems = [
    { label: t("waybills.fields.filename"), value: waybill.external?.document?.fileName || "-" },
    { label: t("waybills.fields.programVersion"), value: waybill.external?.document?.programVersion || "-" },
    { label: t("waybills.fields.formatVersion"), value: waybill.external?.document?.formatVersion || "-" },
    { label: t("waybills.fields.externalId"), value: waybill.external?.id || "-" },
    { label: t("waybills.fields.sentAt"), value: formatDateTime(waybill.external?.sentAt) },
    { label: t("waybills.fields.registeredAt"), value: formatDateTime(waybill.external?.registeredAt) },
  ];
  const transportItems = [
    { label: t("waybills.fields.transportType"), value: t(`waybills.transportTypes.${waybill.transport.type}`, { defaultValue: waybill.transport.type }) },
    { label: t("waybills.fields.driver"), value: waybill.transport.driver.fullName },
    { label: t("waybills.fields.driverPinfl"), value: waybill.transport.driver.pinfl || "-" },
    { label: t("waybills.fields.truck"), value: formatVehicle(waybill.transport.truck) },
    { label: t("waybills.fields.trailer"), value: formatVehicle(waybill.transport.trailer) },
    { label: t("waybills.fields.carriages"), value: waybill.transport.carriages?.map(formatVehicle).join(", ") || "-" },
  ];

  return (
    <MainLayout>
      <Heading title={`${t("waybills.detailsTitle")} - ${waybill.waybillNumber}`} subtitle={t("common.details")}>
        <div className="btns-group">
          <div className="invoice-file-actions">
            <button
              type="button"
              className="invoice-file-action invoice-file-action-main"
              disabled={waybillFileLoading}
              onClick={() => void handleWaybillFile(false)}
            >
              {t("waybills.sections.file")}
            </button>
            <button
              type="button"
              className="invoice-file-action invoice-file-action-icon"
              disabled={waybillFileLoading}
              onClick={() => void handleWaybillFile(true)}
              aria-label={t("waybills.file.download")}
              title={t("waybills.file.download")}
            >
              <DownloadOutlined />
            </button>
          </div>
          <CustomButton variant="outline" onClick={() => navigate(listPath)}>
            {t("common.backToList")}
          </CustomButton>
        </div>
      </Heading>
      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <div className="route-overview-card">
              <div className="route-overview-head">
                <div className="route-overview-title">
                  <h2>{waybill.waybillNumber}</h2>
                </div>
                <div className="route-overview-status">
                  <div className="invoice-status-pair-item">
                    <span className="invoice-status-pair-label">{t("waybills.fields.internalStatus")}</span>
                    <Tag color={statusColors[waybillStatusKey] ?? "blue"} style={{ margin: 0 }}>
                      {t(`waybills.statuses.${waybillStatusKey}`, { defaultValue: waybill.status })}
                    </Tag>
                  </div>
                  <div className="invoice-status-pair-item">
                    <span className="invoice-status-pair-label">{t("waybills.fields.externalStatus")}</span>
                    <Tag color={statusColors[externalStatus ?? ""] ?? "blue"} style={{ margin: 0 }} title={externalStatusLabel}>
                      {externalStatusLabel}
                    </Tag>
                  </div>
                </div>
              </div>
              <div className="route-overview-meta">
                {metaItems.map((item) => (
                  <RouteMetaChip key={item.label} label={item.label} value={item.value} />
                ))}
              </div>
              <div className="waybill-route-line">
                <div className="waybill-route-point">
                  <span className="label">{t("waybills.fields.sender")}</span>
                  <strong title={waybill.parties.sender.legalName}>{waybill.parties.sender.legalName}</strong>
                  <span title={waybill.parties.sender.tin}>{waybill.parties.sender.tin}</span>
                </div>
                <div className="waybill-route-arrow">-&gt;</div>
                <div className="waybill-route-point">
                  <span className="label">{t("waybills.fields.consignee")}</span>
                  <strong title={waybill.parties.consignee.name}>{waybill.parties.consignee.name}</strong>
                  <span title={waybill.parties.consignee.tinOrPinfl}>{waybill.parties.consignee.tinOrPinfl}</span>
                </div>
              </div>
            </div>

            <div className="waybill-section-tabs">
              <Segmented
                block
                value={activeSection}
                onChange={(value) => setActiveSection(value as WaybillDetailsSection)}
                options={[
                  { label: t("waybills.sections.overview"), value: "overview" },
                  { label: t("waybills.sections.cargo"), value: "cargo" },
                  { label: t("waybills.sections.parties"), value: "parties" },
                  { label: t("waybills.sections.system"), value: "system" },
                ]}
              />
            </div>

            {activeSection === "overview" ? (
              <>
                <DetailGrid variant="secondary">
                  <DetailCard wide title={t("waybills.sections.totals")}>
                    <DetailStatsGrid>
                      <DetailStat label={t("waybills.fields.deliveryCost")} value={formatNumber(waybill.totals.deliveryCost)} />
                      <DetailStat label={t("waybills.fields.cargoGroups")} value={formatNumber(waybill.cargoGroups.length)} />
                      <DetailStat label={t("waybills.fields.products")} value={formatNumber(cargoProductsCount)} />
                    </DetailStatsGrid>
                  </DetailCard>

                  <DetailCard title={t("waybills.sections.contract")}>
                    <DetailItems
                      items={[
                        { label: t("waybills.fields.contractNumber"), value: waybill.contract.number || "-" },
                        { label: t("waybills.fields.contractDate"), value: formatDate(waybill.contract.date) },
                      ]}
                    />
                  </DetailCard>
                </DetailGrid>

                <DetailGrid variant="main">
                  <DetailCard title={t("waybills.sections.delivery")}>
                    <DetailItems
                      items={[
                        { label: t("waybills.fields.deliveryType"), value: t(`waybills.deliveryTypes.${waybill.delivery.type}`, { defaultValue: waybill.delivery.type }) },
                        { label: t("waybills.fields.costPerDistanceUnit"), value: formatNumber(waybill.delivery.costPerDistanceUnit) },
                        { label: t("waybills.fields.totalDistance"), value: formatNumber(waybill.delivery.totalDistance) },
                        { label: t("waybills.fields.totalCost"), value: formatNumber(waybill.delivery.totalCost) },
                      ]}
                    />
                  </DetailCard>

                  <DetailCard title={t("waybills.sections.transport")}>
                    <DetailItems items={transportItems} />
                  </DetailCard>
                </DetailGrid>

                <DetailGrid variant="main">
                  <DetailCard title={t("waybills.sections.signers")}>
                    <DetailItems
                      items={[
                        { label: t("waybills.fields.approver"), value: waybill.signers.approver.fullName },
                        { label: t("waybills.fields.director"), value: waybill.signers.director.fullName },
                        { label: t("waybills.fields.accountant"), value: waybill.signers.accountant.fullName },
                        { label: t("waybills.fields.responsiblePerson"), value: waybill.responsiblePerson.fullName },
                      ]}
                    />
                  </DetailCard>

                  <DetailCard title={t("waybills.sections.links")}>
                    <DetailItems>
                      {linkItems.map((item) => (
                        <DetailItem key={item.label} label={item.label}>
                          {item.path ? (
                            <Link className="value link" to={item.path}>
                              {item.value}
                            </Link>
                          ) : (
                            <span className="value">-</span>
                          )}
                        </DetailItem>
                      ))}
                    </DetailItems>
                  </DetailCard>
                </DetailGrid>
              </>
            ) : null}

            {activeSection === "parties" ? (
              <>
                <DetailGrid variant="main">
                  {partySections.map((section) => (
                    <DetailCard key={section.title} title={section.title}>
                      <DetailItems items={section.items} />
                    </DetailCard>
                  ))}
                </DetailGrid>

                {optionalParties.length ? (
              <DetailGrid variant="main">
                {optionalParties.map(({ title, party }) => (
                  party ? (
                    <DetailCard key={title} title={title}>
                      <DetailItems
                        items={[
                          { label: t("waybills.fields.name"), value: party.name || "-" },
                          { label: t("waybills.fields.tinOrPinfl"), value: party.tinOrPinfl || "-" },
                          { label: t("waybills.fields.contractNumber"), value: getPartyContract(party)?.number || "-" },
                          { label: t("waybills.fields.contractDate"), value: formatDate(getPartyContract(party)?.date) },
                        ]}
                      />
                    </DetailCard>
                  ) : null
                ))}
              </DetailGrid>
                ) : null}
              </>
            ) : null}

            {activeSection === "cargo" ? (
              <DetailGrid variant="single">
              <DetailCard full title={t("waybills.sections.cargoGroups")}>
                {waybill.cargoGroups.length ? (
                  <div className="waybill-cargo-groups">
                    {waybill.cargoGroups.map((group, groupIndex) => (
                      <div className="waybill-cargo-card" key={`${group.loadingPoint.address}-${group.unloadingPoint.address}-${groupIndex}`}>
                        <div className="waybill-cargo-head">
                          <div>
                            <span className="label">{t("waybills.fields.cargoGroup")} {groupIndex + 1}</span>
                            <h3>
                              {group.loadingPoint.regionName} - {group.unloadingPoint.regionName}
                            </h3>
                          </div>
                          <div className="waybill-cargo-sum">
                            <span className="label">{t("waybills.fields.deliveryCost")}:</span>
                            <strong>{formatNumber(group.totals.deliverySum)}</strong>
                          </div>
                        </div>
                        <div className="waybill-location-pair">
                          <div>
                            <span className="label">{t("waybills.fields.loadingPoint")}</span>
                            <strong>{group.loadingPoint.regionName}, {group.loadingPoint.districtName}</strong>
                            <p title={group.loadingPoint.address}>{group.loadingPoint.address}</p>
                            {group.loadingTrustee ? <small>{group.loadingTrustee.fullName}</small> : null}
                          </div>
                          <div>
                            <span className="label">{t("waybills.fields.unloadingPoint")}</span>
                            <strong>{group.unloadingPoint.regionName}, {group.unloadingPoint.districtName}</strong>
                            <p title={group.unloadingPoint.address}>{group.unloadingPoint.address}</p>
                            {group.unloadingTrustee ? <small>{group.unloadingTrustee.fullName}</small> : null}
                          </div>
                        </div>
                        <div className="invoice-item-card-grid">
                          <div className="invoice-item-chip">
                            <span className="label">{t("waybills.fields.products")}</span>
                            <span className="value">{group.products.length}</span>
                          </div>
                          {group.totals.grossWeight != null ? (
                            <div className="invoice-item-chip">
                              <span className="label">{t("waybills.fields.grossWeight")}</span>
                              <span className="value">{formatNumber(group.totals.grossWeight)}</span>
                            </div>
                          ) : null}
                          {group.totals.netWeight != null ? (
                            <div className="invoice-item-chip">
                              <span className="label">{t("waybills.fields.netWeight")}</span>
                              <span className="value">{formatNumber(group.totals.netWeight)}</span>
                            </div>
                          ) : null}
                        </div>

                        <div className="waybill-products-list">
                          <div className="waybill-product-row waybill-product-row-head">
                            <span>{t("waybills.fields.product")}</span>
                            <span>{t("waybills.fields.quantity")}</span>
                            <span>{t("waybills.fields.pricePerItem")}</span>
                            <span>{t("waybills.fields.productDeliveryCost")}</span>
                          </div>
                          {group.products.map((product) => (
                            <div className="waybill-product-row" key={`${product.productId}-${product.number}`}>
                              <div className="waybill-product-main">
                                <strong title={product.title}>{product.number}. {product.title}</strong>
                                <span title={product.catalog.name}>{product.catalog.code} / {product.catalog.name}</span>
                              </div>
                              <span className="waybill-product-value">{formatNumber(product.quantity)} {product.measurementUnit?.code || ""}</span>
                              <span className="waybill-product-value">{formatNumber(product.pricePerItem)}</span>
                              <span className="waybill-product-value">{formatNumber(product.deliveryCost)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty description={t("common.dataNotFound")} />
                )}
              </DetailCard>
              </DetailGrid>
            ) : null}

            {activeSection === "system" ? (
              <DetailGrid variant="single">
                <DetailCard full title={t("waybills.sections.file")}>
                  <DetailItems items={fileMetaItems} />
                  {waybill.external?.error ? (
                    <div className="detail-text-block">
                      {waybill.external.error.code ? `${waybill.external.error.code}: ` : ""}
                      {waybill.external.error.message}
                    </div>
                  ) : null}
                </DetailCard>
              </DetailGrid>
            ) : null}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default WaybillsDetails;
