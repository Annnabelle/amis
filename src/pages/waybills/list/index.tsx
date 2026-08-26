import { useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "app/store";
import { getWaybills } from "entities/waybills/model";
import { WaybillsTableColumns } from "entities/waybills/ui/tableData/waybills";
import type { WaybillsTableDataType } from "entities/waybills/ui/tableData/waybills/types";
import { useCan } from "entities/access/lib";
import { endpointAccessMap } from "shared/config/endpointAccessMap";
import MainLayout from "shared/ui/layout";
import Heading from "shared/ui/mainHeading";
import ComponentTable from "shared/ui/table";

const formatNumber = (value?: number) => (value != null ? value.toLocaleString() : "-");

const WaybillsList = () => {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const canReadWaybill = useCan(endpointAccessMap.waybillsRead);

  const waybills = useAppSelector((state) => state.waybills.waybills);
  const dataLimit = useAppSelector((state) => state.waybills.limit);
  const dataPage = useAppSelector((state) => state.waybills.page);
  const dataTotal = useAppSelector((state) => state.waybills.total);
  const isLoading = useAppSelector((state) => state.waybills.isLoading);

  useEffect(() => {
    dispatch(
      getWaybills({
        page: dataPage || 1,
        limit: dataLimit || 10,
        sortOrder: "desc",
        sortBy: "createdAt",
      })
    );
  }, [dispatch, dataPage, dataLimit, orgId]);

  const waybillsData = useMemo<WaybillsTableDataType[]>(() => {
    return waybills.map((waybill) => ({
      key: waybill.id,
      waybillNumber: waybill.waybillNumber || waybill.id,
      date: dayjs(waybill.date).format("DD.MM.YYYY"),
      senderName: waybill.parties.sender.legalName || "-",
      consigneeName: waybill.parties.consignee.name || "-",
      deliveryCost: formatNumber(waybill.totals.deliveryCost),
      externalStatus: waybill.external?.status || "-",
      status: waybill.status,
      createdAt: dayjs(waybill.createdAt).format("DD.MM.YYYY"),
    }));
  }, [waybills]);

  return (
    <MainLayout>
      <Heading title={t("waybills.title")} subtitle={t("common.total")} totalAmount={`${dataTotal}`} />
      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <ComponentTable<WaybillsTableDataType>
              columns={WaybillsTableColumns(t, orgId)}
              data={waybillsData}
              loading={isLoading}
              scroll={false}
              onRowClick={
                canReadWaybill
                  ? (record) =>
                      navigate(
                        orgId
                          ? `/organization/${orgId}/waybills/${record.key}`
                          : "/organization"
                      )
                  : undefined
              }
              pagination={{
                current: dataPage || 1,
                pageSize: dataLimit || 10,
                total: dataTotal || 0,
                showSizeChanger: { showSearch: false },
                pageSizeOptions: ["10", "20", "30", "40", "50"],
                locale: { items_per_page: "" },
                onChange: (newPage, newLimit) => {
                  dispatch(
                    getWaybills({
                      page: newPage,
                      limit: newLimit || dataLimit || 10,
                      sortOrder: "desc",
                      sortBy: "createdAt",
                    })
                  );
                },
              }}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default WaybillsList;
