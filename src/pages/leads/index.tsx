import { Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "app/store";
import { useCan } from "entities/access/lib";
import { getLeads } from "entities/leads/model";
import { LeadStatuses, type LeadListQuery } from "entities/leads/types";
import { LeadsTableColumns } from "entities/leads/ui/tableData/leads";
import type { LeadTableDataType } from "entities/leads/ui/tableData/leads/types";
import { endpointAccessMap } from "shared/config/endpointAccessMap";
import FilterBar from "shared/ui/filterBar/filterBar";
import FilterBarItem from "shared/ui/filterBar/filterBarItems";
import MainLayout from "shared/ui/layout";
import Heading from "shared/ui/mainHeading";
import ComponentTable from "shared/ui/table";
import "./styles.sass";

const formatValue = (value?: string | null) => value || "-";

const Leads = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const canRead = useCan(endpointAccessMap.leadsRead);
  const leads = useAppSelector((state) => state.leads.leads);
  const dataPage = useAppSelector((state) => state.leads.page);
  const dataLimit = useAppSelector((state) => state.leads.limit);
  const dataTotal = useAppSelector((state) => state.leads.total);
  const isLoading = useAppSelector((state) => state.leads.isLoading);
  const [query, setQuery] = useState<LeadListQuery>({
    page: 1,
    limit: 10,
    sortOrder: "desc",
    sortBy: "createdAt",
  });

  useEffect(() => {
    dispatch(getLeads(query));
  }, [dispatch, query]);

  const tableData = useMemo<LeadTableDataType[]>(
    () =>
      leads.map((lead) => ({
        key: lead.id,
        name: lead.name,
        phone: lead.phone,
        company: formatValue(lead.company),
        status: lead.status,
        createdAt: dayjs(lead.createdAt).format("DD.MM.YYYY HH:mm"),
      })),
    [leads]
  );

  const statusOptions = useMemo(
    () =>
      LeadStatuses.map((status) => ({
        value: status,
        label: t(`leads.statuses.${status}`),
      })),
    [t]
  );

  return (
    <MainLayout>
      <Heading
        title={t("leads.title")}
        subtitle={t("leads.subtitle")}
        totalAmount={`${dataTotal}`}
      />

      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <FilterBar className="leads-filters">
              <FilterBarItem>
                <Select
                  className="leads-status-filter"
                  popupClassName="leads-status-filter-popup"
                  size="large"
                  allowClear
                  popupMatchSelectWidth={false}
                  placeholder={t("leads.fields.status")}
                  options={statusOptions}
                  onChange={(status) =>
                    setQuery((prev) => ({
                      ...prev,
                      page: 1,
                      status: status || undefined,
                    }))
                  }
                />
              </FilterBarItem>
            </FilterBar>
          </div>

          <div className="box-container-items">
            <ComponentTable<LeadTableDataType>
              loading={isLoading}
              columns={LeadsTableColumns(t)}
              data={tableData}
              onRowClick={canRead ? (record) => navigate(`/leads/${record.key}`) : undefined}
              pagination={{
                current: dataPage,
                pageSize: dataLimit,
                total: dataTotal,
                showSizeChanger: { showSearch: false },
                pageSizeOptions: ["10", "20", "30", "40", "50"],
                locale: { items_per_page: "" },
                onChange: (page, limit) => {
                  setQuery((prev) => ({
                    ...prev,
                    page,
                    limit: limit || prev.limit,
                  }));
                },
              }}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Leads;
