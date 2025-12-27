import { Tag, type TableProps } from 'antd';
import type { TFunction } from 'i18next';
import { Link } from 'react-router-dom';
import type { BatchTableDataType } from '../markingCodes/types';

const statusColors: Record<string, string> = {
  new: "green",
  created: "green",
  vendorPending: "gold",
  readyForCodes: "green",
  codesUtilized: "red",
  codesUtilizationRequested: "gray",
  codesReceived: "purple",
  rejected: "red",
  closed: "red"
};

// const statusKeyMap: Record<string, string> = {
//   CREATED: "created",
//   PENDING: "pending",
//   READY: "ready",
//   REJECTED: "rejected",
//   CLOSED: "closed",
//   OUTSOURCED: "outsourced"
// };

export const MarkingCodeTableColumns = (t: TFunction) : TableProps<BatchTableDataType>["columns"] => [
  { 
    title: '№',
    dataIndex: "key",
    key: "key",
    render: (text) => <Link to="/marking-codes/1" className="table-text">{text}</Link>,
  },
  {
    title: t("markingCodes.tableTitles.batchNumber"),
    dataIndex: "batchNumber",
    key: "batchNumber",
    render: (_, record) => (
      <Link
        className="table-text link"
        // to=""
        to={`/orderId/${record?.id}/batchId/${record?.batchId}`}
      >
        {record.batchNumber}
      </Link>
    ),
  },
  {
    title: t("markingCodes.tableTitles.products"),
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
    title: t("markingCodes.tableTitles.gtin"),
    dataIndex: "gtin",
    key: "gtin",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t("markingCodes.tableTitles.packageType"),
    dataIndex: "packageType",
    key: "packageType",
    render: (text) => <p className="table-text">
      {t(`markingCodes.packageType.${text?.toLowerCase()}`)}
    </p>
  },
  {
    title: t("markingCodes.tableTitles.numberOfMarkingCodes"),
    dataIndex: "quantity",
    key: "quantity",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t("markingCodes.tableTitles.status"),
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
        status ? (
            <Tag color={statusColors[status]}>
              {t(`markingCodes.batches.batchesOrderStatus.${status}`)}
            </Tag>
        ) : null
    )
  },
  //  {
  //   title: '',
  //   key: "action",
  //   render: (_, record) => (
  //     <CustomButton
  //       type="button"
  //       className="outline"
  //       onClick={(e) =>  {e.stopPropagation(); handleRowClick("MarkingCode", "edit", record);}}
  //     >
  //       {t("btn.sendToTuron")}
  //     </CustomButton>
  //   ),
  // },
];
