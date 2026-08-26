import type { TableProps } from "antd";
import type { TFunction } from "i18next";
import { ActionDropdownButton, TextCell } from "shared/ui/table/cells";
import type { VehiclesTableDataType } from "./types";

export const VehiclesTableColumns = (
  t: TFunction,
  handleAction: (
    action: "details" | "edit" | "delete",
    record: VehiclesTableDataType
  ) => void,
  permissions: { canUpdate: boolean; canDelete: boolean }
): TableProps<VehiclesTableDataType>["columns"] => [
  {
    title: t("vehicles.fields.name"),
    dataIndex: "name",
    key: "name",
    render: (text) => <TextCell value={text} />,
  },
  {
    title: t("vehicles.fields.plateNumber"),
    dataIndex: "plateNumber",
    key: "plateNumber",
    render: (text) => <TextCell value={text || "-"} />,
  },
  {
    title: t("vehicles.fields.comment"),
    dataIndex: "comment",
    key: "comment",
    render: (text) => <TextCell value={text || "-"} maxWidth={360} />,
  },
  {
    title: t("vehicles.fields.createdAt"),
    dataIndex: "createdAt",
    key: "createdAt",
    width: 140,
    render: (text) => <TextCell value={text || "-"} />,
  },
  {
    title: "",
    key: "actions",
    width: 72,
    render: (_, record) => (
      <ActionDropdownButton
        actions={[
          permissions.canUpdate && {
            key: "edit",
            label: t("btn.edit"),
            variant: "outline",
            onClick: () => handleAction("edit", record),
          },
          permissions.canDelete && {
            key: "delete",
            label: t("btn.delete"),
            variant: "danger",
            onClick: () => handleAction("delete", record),
          },
        ]}
      />
    ),
  },
];
