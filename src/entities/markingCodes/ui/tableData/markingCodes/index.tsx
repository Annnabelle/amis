import { Tag } from 'antd';
import CustomButton from 'shared/ui/button';
import type { TFunction } from 'i18next';
import type { MarkingCodesTableDataType } from './types';
import {statusColors} from "shared/ui/statuses.tsx";
import type {AdaptiveColumn} from "shared/ui/table/types.ts";
import { PermissionLink } from "entities/access/ui";
import { endpointAccessMap } from 'shared/config/endpointAccessMap';
import { AvailablePackageType, BatchStatus } from 'shared/types/dtos';

export const MarkingCodesTableColumns = (t: TFunction, orgId: string | undefined, canCreateUtilization: boolean, canCreateCustomsCode: boolean, customsCodeBatchIds: ReadonlySet<string>, creatingCustomsCodeBatchIds: ReadonlySet<string>, handleAppoint: (
    e: React.MouseEvent,
    record: MarkingCodesTableDataType,
) => void, handleCreateCustomsCode: (
    e: React.MouseEvent,
    record: MarkingCodesTableDataType,
) => void): AdaptiveColumn<MarkingCodesTableDataType>[] => [
  {
    title: t("markingCodes.tableTitles.batchNumber"),
    dataIndex: "batchNumber",
    ellipsis: true,
    width: 150,
    minWidth: 140,
    key: "batchNumber",
    render: (_, record) => (
      <PermissionLink
        endpoint={endpointAccessMap.ordersRead}
        className="table-text link"
        to={`/organization/${orgId}/orderId/${record?.orderId}/batchId/${record?.batchId}`}
      >
        {record.batchNumber}
      </PermissionLink>
    ),
  },
  {
    title: t("markingCodes.tableTitles.orderNumber"),
    dataIndex: "orderNumber",
    ellipsis: true,
    width: 140,
    minWidth: 130,
    key: "orderNumber",
    render: (_, record) => (
      <PermissionLink
        endpoint={endpointAccessMap.ordersRead}
        className="table-text link"
        to={`/organization/${orgId}/orders/${record?.orderId}`}
      >
        {record.orderNumber}
      </PermissionLink>
    ),
  },
  {
    title: t("markingCodes.tableTitles.products"),
    dataIndex: "productName",
    width: 280,
    minWidth: 240,
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
    ellipsis: true,
    width: 150,
    minWidth: 140,
    key: "gtin",
    render: (text?: string) => <p className="table-text">{text || "-"}</p>,
  },
  {
    title: t("markingCodes.tableTitles.totalQuantity"),
    dataIndex: "totalQuantity",
    ellipsis: true,
    align: "center",
    width: 90,
    minWidth: 80,
    key: "totalQuantity",
    render: (text) => <p className="table-text" style={{ textAlign: "center", width: "100%" }}>{text}</p>,
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
    width: 170,
    minWidth: 160,
    key: "orderedAt",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t("markingCodes.tableTitles.packageType"),
    dataIndex: "packageType",
    ellipsis: true,
    width: 150,
    minWidth: 140,
    key: "packageType",
    render: (text: string) => (
        <p
            style={{
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
    className: "no-ellipsis",
    width: 190,
    minWidth: 180,
    key: "status",
    render: (status: string) => (
      status && (
        <Tag color={statusColors[status]}
             style={{
                 maxWidth: "100%",
                 overflow: "hidden",
                 whiteSpace: "nowrap",
                 textOverflow: "ellipsis",
             }}
        >
          {t(`markingCodes.batches.batchesOrderStatus.${status?.toLowerCase()}`)}
        </Tag>
      )
    ),
  },
  {
    title: t("markingCodes.tableTitles.externalStatus"),
    dataIndex: "externalStatus",
    className: "no-ellipsis",
    width: 150,
    minWidth: 140,
    key: "externalStatus",
    render: (status: string) => (
        status && (
            <Tag color={statusColors[status]}
                 style={{
                     maxWidth: "100%",
                     overflow: "hidden",
                     whiteSpace: "nowrap",
                     textOverflow: "ellipsis",
                 }}
            >
              {t(`markingCodes.markingCodesOrderStatus.${status?.toLowerCase()}`)}
            </Tag>
        )
    ),
  },
  {
    title: '', // или t('table.actions') если нужно заголовок
    key: 'action',
    width: 150,
    minWidth: 150,
    render: (_, record) => {
      const canCreateAik =
        canCreateCustomsCode &&
        !customsCodeBatchIds.has(record.batchId) &&
        record.packageType?.toLowerCase() === AvailablePackageType.Unit &&
        record.status === BatchStatus.CodesAggregated;
      const isCreatingAik = creatingCustomsCodeBatchIds.has(record.batchId);

      if (!canCreateUtilization && !canCreateAik) {
        return null;
      }

      // Показываем кнопку "Нанести" только если статус === 'codes_received'
      if (record.status !== BatchStatus.CodesReceived && !canCreateAik) {
        return null; // или можно вернуть <span>—</span> или другой плейсхолдер
      }

      return (
          <CustomButton
              type="button"
              variant="outline"
              className="table-action-btn"
              disabled={isCreatingAik}
              onClick={(e) => {
                if (canCreateAik) {
                  handleCreateCustomsCode(e, record);
                  return;
                }

                handleAppoint(e, record);
              }}
          >
            {canCreateAik ? t('customsCodes.actions.create') : t('btn.apply')}
          </CustomButton>
      );
    },
  },
];




