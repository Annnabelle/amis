import { type TableProps, Tag } from 'antd';
import type { TFunction } from 'i18next';
import type {OrderProductDataType} from "./types.ts";

const statusColors: Record<string, string> = {
  CREATED: "green",
  PENDING: "gold",
  READY: "green",
  REJECTED: "red",
  CLOSED: "gray",
  OUTSOURCED: "purple",
};


export const OrderProductTableColumns = (t: TFunction): TableProps<OrderProductDataType>["columns"] => [
  { 
    title: '№',
    dataIndex: "key",
    key: "key",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t("markingCodes.tableTitles.code"),
    dataIndex: "code",
    key: "code",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t("markingCodes.tableTitles.status"),
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
      status && (
        <Tag color={statusColors[status]}>
          {t(`markingCodes.orderProduct.markingCodesStatus.${status?.toLowerCase()}`)}
        </Tag>
      )
    ),
  },
];
