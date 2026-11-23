import { Tag } from "antd";
import type { TFunction } from "i18next";

import StatusBadge from "shared/ui/statusBadge";
import { getIntegrationStatusBadgeVariant } from "shared/ui/statusBadge/variants";

/** Статус интеграции единым значком. */
export const renderIntegrationStatus = (status: string, t: TFunction) => (
  <StatusBadge variant={getIntegrationStatusBadgeVariant(status)}>
    {t(`statuses.${status}`, { defaultValue: status })}
  </StatusBadge>
);

/** Тестовая компания помечается тегом, боевая — прочерком. */
export const renderTestFlag = (isTest: boolean | undefined, t: TFunction) =>
  isTest ? (
    <Tag className="test-flag tag-flat" color="blue-inverse">
      {t("organizations.testFlag")}
    </Tag>
  ) : (
    "-"
  );

/** Товарные группы подписями из справочника. */
export const renderProductGroups = (
  productGroups: string[],
  titleByAlias: Map<string, string>,
) => (
  <div className="organization-product-group-pills">
    {productGroups.length > 0 ? (
      productGroups.map((productGroup) => (
        <span key={productGroup} className="organization-product-group-pill">
          {titleByAlias.get(productGroup) ??
            titleByAlias.get(productGroup.trim().toLowerCase()) ??
            productGroup}
        </span>
      ))
    ) : (
      <span className="value">-</span>
    )}
  </div>
);
