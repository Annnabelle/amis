import type { TFunction } from "i18next";
import type { AdaptiveColumn } from "shared/ui/table/types";
import type { OwnedCodesSummaryProduct } from "entities/ownedCodes/types";

export type OwnedCodesSummaryRow = {
  key: string;
  product: string;
  packages: OwnedCodesSummaryProduct["packages"];
  total: number;
};

/**
 * Сводка свёрнута по товару: у одного товара до четырёх GTIN, и коробка —
 * не отдельный товар. Разбивка по упаковке идёт второй строкой в той же ячейке,
 * чтобы колонок не стало по одной на уровень.
 */
export const OwnedCodesSummaryColumns = (
  t: TFunction
): AdaptiveColumn<OwnedCodesSummaryRow>[] => [
  {
    title: t("ownedCodes.summary.product"),
    dataIndex: "product",
    key: "product",
    flex: 2,
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t("ownedCodes.summary.packages"),
    dataIndex: "packages",
    key: "packages",
    flex: 3,
    render: (_, record) => (
      <div className="owned-codes-packages">
        {record.packages.map((item) => (
          <span key={item.gtin} className="owned-codes-package">
            <span className="owned-codes-package-type">
              {t(`markingCodes.packageType.${item.packageType}`)}
            </span>
            <span className="owned-codes-package-gtin">{item.gtin}</span>
            <span className="owned-codes-package-count">{item.count}</span>
          </span>
        ))}
      </div>
    ),
  },
  {
    title: t("ownedCodes.summary.total"),
    dataIndex: "total",
    key: "total",
    align: "right",
    render: (text) => <p className="table-text">{text}</p>,
  },
];
