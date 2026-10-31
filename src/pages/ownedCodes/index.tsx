import { Input } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoSearch } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "app/store";
import { getOwnedCodes, getOwnedCodesSummary } from "entities/ownedCodes/model";
import {
  OwnedCodesSummaryColumns,
  type OwnedCodesSummaryRow,
} from "entities/ownedCodes/ui/summaryTable";
import { OwnedCodesTableColumns } from "entities/ownedCodes/ui/tableData";
import type { OwnedCodesTableDataType } from "entities/ownedCodes/ui/tableData/types";
import EntityTabs from "shared/ui/entityTabs";
import FilterBar from "shared/ui/filterBar/filterBar";
import FilterBarItem from "shared/ui/filterBar/filterBarItems";
import MainLayout from "shared/ui/layout";
import Heading from "shared/ui/mainHeading";
import ComponentTable from "shared/ui/table";
import "./styles.sass";

const GTIN_14 = /^\d{14}$/;

const SUMMARY_TAB_KEY = "summary";
const CODES_TAB_KEY = "codes";

const formatDate = (value?: string) =>
  value ? dayjs(value).format("DD.MM.YYYY HH:mm") : "—";

/**
 * Коды, которыми владеет компания. Это реестр, а не записи учёта: код, пришедший
 * от контрагента, здесь есть, даже если своей записи учёта у него нет.
 *
 * Сводка идёт первой вкладкой: на вопрос «что у нас есть» отвечает она, а
 * перечень кодов нужен уже после него.
 */
const OwnedCodes = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const summary = useAppSelector((state) => state.ownedCodes.summary);
  const summaryLoading = useAppSelector((state) => state.ownedCodes.summaryLoading);
  const codes = useAppSelector((state) => state.ownedCodes.codes);
  const total = useAppSelector((state) => state.ownedCodes.total);
  const page = useAppSelector((state) => state.ownedCodes.page);
  const limit = useAppSelector((state) => state.ownedCodes.limit);
  const isLoading = useAppSelector((state) => state.ownedCodes.isLoading);
  const [gtin, setGtin] = useState("");

  /** Вендор принимает только GTIN-14, поэтому недобранный фильтр не отправляем. */
  const appliedGtin = GTIN_14.test(gtin) ? gtin : undefined;

  useEffect(() => {
    if (!orgId) return;

    void dispatch(getOwnedCodesSummary());
  }, [dispatch, orgId]);

  useEffect(() => {
    if (!orgId) return;

    void dispatch(getOwnedCodes({ page: 1, limit, gtin: appliedGtin }));
  }, [appliedGtin, dispatch, limit, orgId]);

  const summaryRows = useMemo<OwnedCodesSummaryRow[]>(
    () =>
      (summary?.products ?? []).map((product) => ({
        key: product.productId,
        product: product.name,
        packages: product.packages,
        total: product.total,
      })),
    [summary]
  );

  const codeRows = useMemo<OwnedCodesTableDataType[]>(
    () =>
      codes.map((item) => ({
        key: item.code,
        code: item.code,
        gtin: item.gtin,
        packageType: item.packageType,
        parentCode: item.parentCode ?? "—",
        status: item.status,
        lastSyncedAt: formatDate(item.lastSyncedAt),
      })),
    [codes]
  );

  const summaryTab = (
    <div className="box">
      <div className="box-container">
        <div className="box-container-items owned-codes">
          {/* Владение верно на момент заявки, поэтому возраст снимка — часть ответа. */}
          <div className="owned-codes-freshness">
            {summary?.freshness ? (
              <>
                <span>
                  {t("ownedCodes.summary.freshestAt")}: {formatDate(summary.freshness.newest)}
                </span>
                <span>
                  {t("ownedCodes.summary.oldestAt")}: {formatDate(summary.freshness.oldest)}
                </span>
              </>
            ) : (
              <span>{t("ownedCodes.summary.neverSynced")}</span>
            )}
          </div>

          <ComponentTable<OwnedCodesSummaryRow>
            loading={summaryLoading}
            columns={OwnedCodesSummaryColumns(t)}
            data={summaryRows}
            pagination={false}
          />

          {summary && summary.unknownGtins.length > 0 && (
            <p className="owned-codes-unknown">
              {t("ownedCodes.summary.unknownGtins")}:{" "}
              {summary.unknownGtins
                .map((item) => `${item.gtin} — ${item.count}`)
                .join(", ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const codesTab = (
    <div className="box">
      <div className="box-container">
        <div className="box-container-items">
          <div className="box-container-items-item">
            <FilterBar>
              <FilterBarItem>
                {/* Без Form.Item: формы здесь нет, а он тянет её контекст. */}
                <Input
                  size="large"
                  className="input"
                  value={gtin}
                  maxLength={14}
                  onChange={(event) => setGtin(event.target.value.trim())}
                  placeholder={t("ownedCodes.filters.gtin")}
                  suffix={<IoSearch />}
                />
              </FilterBarItem>
            </FilterBar>
          </div>

          <ComponentTable<OwnedCodesTableDataType>
            loading={isLoading}
            columns={OwnedCodesTableColumns(t)}
            data={codeRows}
            pagination={{
              current: page,
              pageSize: limit,
              total,
              showSizeChanger: { showSearch: false },
              pageSizeOptions: ["20", "50", "100"],
              locale: { items_per_page: "" },
              onChange: (nextPage, nextLimit) =>
                dispatch(
                  getOwnedCodes({ page: nextPage, limit: nextLimit, gtin: appliedGtin })
                ),
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <Heading
        title={t("ownedCodes.title")}
        subtitle={t("ownedCodes.subtitle")}
        totalAmount={`${summary?.total ?? total}`}
      />

      <EntityTabs
        defaultActiveKey={SUMMARY_TAB_KEY}
        items={[
          {
            key: SUMMARY_TAB_KEY,
            label: t("ownedCodes.tabs.summary"),
            children: summaryTab,
          },
          {
            key: CODES_TAB_KEY,
            label: t("ownedCodes.tabs.codes"),
            children: codesTab,
          },
        ]}
      />
    </MainLayout>
  );
};

export default OwnedCodes;
