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
 * не отдельный товар. Разбивка по упаковке идёт строками в одной ячейке,
 * чтобы колонок не стало по одной на уровень.
 *
 * Итог стоит вторым, сразу за названием: он и есть ответ на вопрос «сколько
 * кодов какого товара», а разбивка — подробность. Последней колонкой он
 * оказывался у правого края, далеко от названия, к которому относится.
 */
export const OwnedCodesSummaryColumns = (
  t: TFunction
): AdaptiveColumn<OwnedCodesSummaryRow>[] => [
  {
    title: t("ownedCodes.summary.product"),
    dataIndex: "product",
    key: "product",
    // Название — самое длинное из того, что читают: ему и место.
    flex: 6,
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t("ownedCodes.summary.total"),
    dataIndex: "total",
    key: "total",
    // Числа читают столбиком, поэтому по правому краю — но сама колонка
    // узкая, так что от названия они не отрываются.
    align: "right",
    // Узко по делу: в ячейке число, а в заголовке одно короткое слово.
    flex: 1,
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t("ownedCodes.summary.packages"),
    dataIndex: "packages",
    key: "packages",
    // Содержимое ячейки предсказуемой ширины — подпись уровня, GTIN и число,
    // — поэтому забирать остаток незачем.
    flex: 4,
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
];
