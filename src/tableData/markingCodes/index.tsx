import { type TableProps, Tag } from 'antd';
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

export type HandleAppointFn = (
    e: React.MouseEvent,
    record: MarkingCodesTableDataType
) => void;


export const MarkingCodesTableColumns = (t: TFunction,  handleAppoint: (
    e: React.MouseEvent,
    record: MarkingCodesTableDataType
) => void): TableProps<MarkingCodesTableDataType>["columns"] => [
  { 
    title: '№',
    dataIndex: "number",
    key: "number",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t("markingCodes.tableTitles.batchNumber"),
    dataIndex: "batchNumber",
    key: "batchNumber",
    render: (_, record) => (
      <Link
        className="table-text link"
        to={`/orderId/${record?.orderId}/batchId/${record?.batchId}`}
      >
        {record.batchNumber}
      </Link>
    ),
  },
  {
    title: t("markingCodes.tableTitles.orderNumber"),
    dataIndex: "orderNumber",
    key: "orderNumber",
    render: (_, record) => (
      <Link
        className="table-text link"
        to={`/orders/${record?.orderId}`}
      >
        {record.orderNumber}
      </Link>
    ),
  },
   {
    title: t("markingCodes.tableTitles.productName"),
    dataIndex: "productName",
    key: "productName",
    render: (_, record) => (
      <Link
        className="table-text link"
        to={`/products/${record?.productId}`}
      >
        {record.productName}
      </Link>
    ),
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
    title: t("markingCodes.tableTitles.codesHaveBeenExported"),
    dataIndex: "codesHaveBeenExported",
    key: "codesHaveBeenExported",
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
    render: (text: string) => (
        <p className="table-text">
          {t(`markingCodes.packageType.${text?.toLowerCase()}`)}
        </p>
    ),
  },
  // {
  //   title: t("markingCodes.tableTitles.paymentType"),
  //   dataIndex: "isPaid",
  //   key: "isPaid",
  //   render: (value: boolean) => (
  //     <p className="table-text">
  //       {value ? t("markingCodes.tableTitles.paid") : t("markingCodes.tableTitles.unPaid")}
  //     </p>
  //   ),
  // },
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
    key: 'action',
    render: (_, record) => (
        <CustomButton
            type="button"
            className="outline"
            onClick={(e) => handleAppoint(e, record)}
        >
          {t('btn.apply')}
        </CustomButton>
    ),
  }
];
