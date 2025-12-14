import { type TableProps, Dropdown, Menu, Button, Tag } from 'antd';
import { HiDotsHorizontal } from 'react-icons/hi';
import CustomButton from '../../components/button';
import type { TFunction } from 'i18next';
import type { MarkingCodesTableDataType } from './types';
import { Link } from 'react-router-dom';

const statusColors: Record<string, string> = {
  CREATED: "green",
  PENDING: "gold",
  READY: "green",
  REJECTED: "red",
  CLOSED: "gray",
  OUTSOURCED: "purple",
};

export const MarkingCodesTableColumns = (t: TFunction, handleRowClick: (type: "MarkingCodes", action: "retrieve" | "edit" | "delete", record: MarkingCodesTableDataType) => void,) : TableProps<MarkingCodesTableDataType>["columns"] => [
  { 
    title: '№',
    dataIndex: "number",
    key: "number",
    render: (text) => <Link to="/marking-codes/1" className="table-text">{text}</Link>,
  },
  {
    title: t("markingCodes.tableTitles.orderNumber"),
    dataIndex: "orderNumber",
    key: "orderNumber",
    render: (text) => <p className="table-text">{text}</p>
  },
  {
    title: t("markingCodes.tableTitles.productName"),
    dataIndex: "productName",
    key: "productName",
    render: (text) => <p className="table-text">{text}</p>
  },
  {
    title: t("markingCodes.tableTitles.totalQuantity"),
    dataIndex: "totalQuantity",
    key: "totalQuantity",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t("markingCodes.tableTitles.orderedMCQuantity"),
    dataIndex: "orderedQuantity",
    key: "orderedQuantity",
    render: (text) => <p className="table-text">{text}</p>
  },
  {
    title: t("markingCodes.tableTitles.remainingMCQuantity"),
    dataIndex: "remainderQuantity",
    key: "remainderQuantity",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t("markingCodes.tableTitles.orderDate"),
    dataIndex: "orderedAt",
    key: "orderedAt",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t("markingCodes.tableTitles.packageType"),
    dataIndex: "packageType",
    key: "packageType",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t("markingCodes.tableTitles.paymentType"),
    dataIndex: "isPaid",
    key: "isPaid",
    render: (value: boolean) => (
      <p className="table-text">
        {value ? t("markingCodes.tableTitles.paid") : t("markingCodes.tableTitles.unPaid")}
      </p>
    ),
  },
  {
    title: t("markingCodes.tableTitles.status"),
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
      status && (
        <Tag color={statusColors[status]}>
          {t(`markingCodes.markingCodesOrderStatus.${status?.toLowerCase()}`)}
        </Tag>
      )
    ),
  },
  {
    title: '',
    key: "action",
    render: (_, record) => (
      <CustomButton
        type="button"
        className="outline"
        onClick={(e) =>  {e.stopPropagation(); handleRowClick("MarkingCodes", "edit", record);}}
      >
        Добавить партию
      </CustomButton>
    ),
  },
];
