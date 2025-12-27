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
    ellipsis: true,
    key: "number",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t("markingCodes.tableTitles.batchNumber"),
    dataIndex: "batchNumber",
    ellipsis: true,
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
    ellipsis: true,
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
    title: t("markingCodes.tableTitles.products"),
    dataIndex: "productName",
     width: 250,
    key: "productName",
    render: (_, record) => (
      <Link
        className="table-text link"
        to={`/products/${record?.productId}`}
        style={{
          maxWidth: 100,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {record.productName}
      </Link>
    ),
  },
  {
    title: t("markingCodes.tableTitles.totalQuantity"),
    dataIndex: "totalQuantity",
    ellipsis: true,
    key: "totalQuantity",
    render: (text) => <p className="table-text">{text}</p>,
  },
  // {
  //   title: t("markingCodes.tableTitles.orderedMCQuantity"),
  //   dataIndex: "orderedQuantity",
  //   ellipsis: true,
  //   key: "orderedQuantity",
  //   render: (text) => <p className="table-text">{text}</p>
  // },
  // {
  //   title: t("markingCodes.tableTitles.codesHaveBeenExported"),
  //   dataIndex: "codesHaveBeenExported",
  //   ellipsis: true,
  //   key: "codesHaveBeenExported",
  //   render: (text) => <p className="table-text">{text}</p>,
  // },
  {
    title: t("markingCodes.tableTitles.orderDate"),
    dataIndex: "orderedAt",
    ellipsis: true,
    key: "orderedAt",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t("markingCodes.tableTitles.packageType"),
    dataIndex: "packageType",
    ellipsis: true,
    key: "packageType",
    render: (text: string) => (
        <p
            style={{
              maxWidth: 100,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
            className="table-text">
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
    ellipsis: true,
    key: "status",
    render: (status: string) => (
      status && (
        <Tag color={statusColors[status]}>
          {t(`markingCodes.batches.batchesOrderStatus.${status?.toLowerCase()}`)}
        </Tag>
      )
    ),
  },
  {
    title: t("markingCodes.tableTitles.externalStatus"),
    dataIndex: "externalStatus",
    ellipsis: true,
    key: "externalStatus",
    render: (status: string) => (
        status && (
            <Tag color={statusColors[status]}>
              {t(`markingCodes.markingCodesOrderStatus.${status?.toLowerCase()}`)}
            </Tag>
        )
    ),
  },
  {
    title: '', // или t('table.actions') если нужно заголовок
    key: 'action',
    render: (_, record) => {
      // Показываем кнопку "Нанести" только если статус === 'codes_received'
      if (record.status !== 'codes_received') {
        return null; // или можно вернуть <span>—</span> или другой плейсхолдер
      }

      return (
          <CustomButton
              type="button"
              className="outline"
              onClick={(e) => handleAppoint(e, record)}
          >
            {t('btn.apply')}
          </CustomButton>
      );
    },
  },
];
