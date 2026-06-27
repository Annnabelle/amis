import { Tag, type TableProps } from 'antd';
import type { TFunction } from 'i18next';
import type { BatchTableDataType } from '../markingCodes/types';
import {statusColors} from "shared/ui/statuses.tsx";
import { PermissionLink } from "entities/access/ui";
import { endpointAccessMap } from 'shared/config/endpointAccessMap';

export const MarkingCodeTableColumns = (t: TFunction, orgId: string | undefined) : TableProps<BatchTableDataType>["columns"] => [
  {
    title: t("markingCodes.tableTitles.batchNumber"),
    dataIndex: "batchNumber",
    key: "batchNumber",
    render: (_, record) => (
      <PermissionLink
        endpoint={endpointAccessMap.ordersRead}
        className="table-text link"
        // to=""
        to={`/organization/${orgId}/orderId/${record?.id}/batchId/${record?.batchId}`}
      >
        {record.batchNumber}
      </PermissionLink>
    ),
  },
  {
    title: t("markingCodes.tableTitles.products"),
    dataIndex: "productName",
    key: "productName",
    render: (_, record) => (
      <PermissionLink
        endpoint={endpointAccessMap.productsRead}
        className="table-text link"
        to={`/organization/${orgId}/products/${record?.productId}`}
      >
        {record.productName}
      </PermissionLink>
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
    align: "center",
    key: "quantity",
    render: (text) => <p className="table-text" style={{ textAlign: "center", width: "100%" }}>{text}</p>,
  },
  {
    title: t("markingCodes.tableTitles.status"),
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
        status ? (
            <Tag color={statusColors[status]}
                 style={{
                   maxWidth: 150,
                   overflow: "hidden",
                   whiteSpace: "nowrap",
                   textOverflow: "ellipsis",
                 }}
            >
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




