import { TagOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { PermissionLink } from "entities/access/ui";
import {
  formatValueByKey,
  getLinkField,
  getTargetAccess,
  resolveTargetPath,
  selectVisibleFields,
  withFullName,
  type AuditTarget,
} from "features/auditTarget/lib/targetFields";
import { useTargetFieldMap } from "features/auditTarget/lib/useTargetFieldMap";
import { endpointAccessMap } from "shared/config/endpointAccessMap";
import { routes } from "shared/config/routes";

type TargetFieldsProps = {
  target: AuditTarget;
  targetEntity?: string;
};

const FieldRow = ({
  icon,
  fieldKey,
  label,
  children,
}: {
  icon: ReactNode;
  fieldKey: string;
  label: string;
  children: ReactNode;
}) => (
  <div className="content-items">
    <div className="content-items-item-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Tooltip title={fieldKey}>{icon}</Tooltip>
      <h5 className="title">{label}:</h5>
    </div>
    <div className="content-items-item-description">
      <h5 className="description">{children}</h5>
    </div>
  </div>
);

/** Заказ маркировки показывается номером и партиями со ссылками на них. */
const MarkingCodeOrderFields = ({ target }: { target: AuditTarget }) => {
  const { t } = useTranslation();
  const orgId = String(target.companyId ?? target.orgId ?? "");
  const orderId = String(target.id ?? "");
  const batches = Array.isArray(target.batches) ? (target.batches as { id?: string }[]) : [];

  return (
    <div>
      {target.orderNumber ? (
        <FieldRow
          icon={<TagOutlined style={{ color: "var(--text-muted)" }} />}
          fieldKey="orderNumber"
          label={t("orders.orderNumber")}
        >
          <PermissionLink
            endpoint={endpointAccessMap.ordersRead}
            to={routes.markingCodeBatch(orgId, orderId, batches[0]?.id ?? "")}
            className="actor-link-hover"
            style={{ color: "inherit" }}
          >
            {String(target.orderNumber)}
          </PermissionLink>
        </FieldRow>
      ) : null}

      {batches.map((batch, index) => (
        <FieldRow
          key={`batch-${index}`}
          icon={<TagOutlined style={{ color: "var(--text-muted)" }} />}
          fieldKey="batches"
          label={`${t("markingCodes.tableTitles.batchNumber")} ${index + 1}`}
        >
          <PermissionLink
            endpoint={endpointAccessMap.ordersRead}
            to={routes.markingCodeBatch(orgId, orderId, batch.id ?? "")}
            className="actor-link-hover"
            style={{ color: "inherit" }}
          >
            {batch.id}
          </PermissionLink>
        </FieldRow>
      ))}
    </div>
  );
};

/** Поля записи, о которой событие аудита. */
const TargetFields = ({ target, targetEntity }: TargetFieldsProps) => {
  const fieldMap = useTargetFieldMap();

  if (targetEntity === "markingCodeOrder") {
    return <MarkingCodeOrderFields target={target} />;
  }

  const withName = withFullName(target, targetEntity);
  const linkField = getLinkField(targetEntity);
  const entityId = withName.id ? String(withName.id) : undefined;
  const targetAccess = getTargetAccess(targetEntity ?? "");

  return (
    <>
      {selectVisibleFields(withName, targetEntity).map(([key, value], index) => {
        const baseKey = key.split(".").pop() || key;
        const config = fieldMap[key] ||
          fieldMap[baseKey] || {
            label: baseKey,
            icon: <TagOutlined style={{ color: "var(--text-muted)" }} />,
          };

        let formattedValue: ReactNode = formatValueByKey(baseKey, value);

        if (baseKey === linkField && typeof value === "string" && entityId) {
          const path = resolveTargetPath(withName, targetEntity, entityId);

          if (path && targetAccess) {
            formattedValue = (
              <PermissionLink
                endpoint={targetAccess}
                to={path}
                className="actor-link-hover"
                style={{ color: "inherit" }}
              >
                {value}
              </PermissionLink>
            );
          }
        }

        return (
          <FieldRow key={index} icon={config.icon} fieldKey={key} label={config.label}>
            {formattedValue}
          </FieldRow>
        );
      })}
    </>
  );
};

export default TargetFields;
