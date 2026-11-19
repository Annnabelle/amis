import { Empty, Pagination, Spin } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetInvoiceCodesQuery } from "entities/invoices/api";
import { getApiErrorMessage } from "shared/api";

type InvoiceProductCodesProps = {
  invoiceId: string;
  productId: string;
};

/**
 * Коды маркировки одной позиции счёта. Отдельный компонент, потому что у каждой
 * позиции своя страница кодов, а хук запроса нельзя звать внутри map.
 */
export const InvoiceProductCodes = ({
  invoiceId,
  productId,
}: InvoiceProductCodesProps) => {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const { data, isFetching, error } = useGetInvoiceCodesQuery({
    id: invoiceId,
    productId,
    page: pagination.page,
    limit: pagination.limit,
  });
  const codes = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="invoice-item-codes-panel">
      <div className="invoice-item-codes-head">
        <span>{t("invoices.codes.title")}</span>
        <span className="invoice-item-codes-total">{total}</span>
      </div>
      <Spin spinning={isFetching}>
        {error ? (
          <Empty description={getApiErrorMessage(error, t("common.error"))} />
        ) : codes.length ? (
          <div className="invoice-item-codes-list">
            {codes.map((code) => (
              <div className="invoice-item-codes-row" key={code.id}>
                <span className="invoice-item-code-value" title={code.code}>
                  {code.code}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <Empty description={t("invoices.codes.empty")} />
        )}

        {total > 0 && (
          <Pagination
            className="invoice-item-codes-pagination"
            size="small"
            current={pagination.page}
            pageSize={pagination.limit}
            total={total}
            showSizeChanger={{ showSearch: false }}
            pageSizeOptions={["10", "20", "30", "40", "50"]}
            locale={{ items_per_page: "" }}
            onChange={(newPage, newLimit) =>
              setPagination((prev) => ({
                page: newPage,
                limit: newLimit || prev.limit,
              }))
            }
          />
        )}
      </Spin>
    </div>
  );
};

export default InvoiceProductCodes;
