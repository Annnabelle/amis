import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetWaybillsQuery } from "entities/waybills/api";
import { WaybillsTableColumns } from "entities/waybills/ui/tableData/waybills";
import type { WaybillsTableDataType } from "entities/waybills/ui/tableData/waybills/types";
import { useCan } from "entities/access/lib";
import { endpointAccessMap } from "shared/config/endpointAccessMap";
import MainLayout from "shared/ui/layout";
import Heading from "shared/ui/mainHeading";
import ComponentTable from "shared/ui/table";

import { formatDate } from 'shared/lib/formatDate';
const formatNumber = (value?: number) => (value != null ? value.toLocaleString() : "-");

const WaybillsList = () => {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const { t } = useTranslation();
  const canReadWaybill = useCan(endpointAccessMap.waybillsRead);

  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const { data: waybillsPage, isFetching: isLoading } = useGetWaybillsQuery(
    {
      page: pagination.page,
      limit: pagination.limit,
      sortOrder: "desc",
      sortBy: "createdAt",
    },
    { skip: !orgId }
  );
  const waybills = useMemo(() => waybillsPage?.items ?? [], [waybillsPage]);
  const dataPage = pagination.page;
  const dataLimit = pagination.limit;
  const dataTotal = waybillsPage?.total ?? 0;

  const waybillsData = useMemo<WaybillsTableDataType[]>(() => {
    return waybills.map((waybill) => ({
      key: waybill.id,
      waybillNumber: waybill.waybillNumber || waybill.id,
      date: formatDate(waybill.date),
      senderName: waybill.parties.sender.legalName || "-",
      consigneeName: waybill.parties.consignee.name || "-",
      deliveryCost: formatNumber(waybill.totals.deliveryCost),
      externalStatus: waybill.external?.status || "-",
      status: waybill.status,
      createdAt: formatDate(waybill.createdAt),
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
                onChange: (newPage, newLimit) =>
                  setPagination((prev) => ({
                    page: newPage,
                    limit: newLimit || prev.limit,
                  })),
              }}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default WaybillsList;
