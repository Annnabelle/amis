import { Tag } from 'antd';
import CustomButton from 'shared/ui/button';
import type { TFunction } from 'i18next';
import type { MarkingCodesTableDataType } from './types';
import { Link } from 'react-router-dom';
import {statusColors} from "shared/ui/statuses.tsx";
import type {AdaptiveColumn} from "shared/ui/table/types.ts";

export const MarkingCodesTableColumns = (t: TFunction, orgId: string | undefined,  handleAppoint: (
    e: React.MouseEvent,
    record: MarkingCodesTableDataType,
) => void): AdaptiveColumn<MarkingCodesTableDataType>[] => [
  { 
    title: '№',
    dataIndex: "number",
      flex: 1,
    ellipsis: true,
    key: "number",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t("markingCodes.tableTitles.batchNumber"),
    dataIndex: "batchNumber",
    ellipsis: true,
      flex: 1,
    key: "batchNumber",
    render: (_, record) => (
      <Link
        className="table-text link"
        to={`/organization/${orgId}/orderId/${record?.orderId}/batchId/${record?.batchId}`}
      >
        {record.batchNumber}
      </Link>
    ),
  },
  {
    title: t("markingCodes.tableTitles.orderNumber"),
    dataIndex: "orderNumber",
    ellipsis: true,
      flex: 1,
    key: "orderNumber",
    render: (_, record) => (
      <Link
        className="table-text link"
        to={`/organization/${orgId}/orders/${record?.orderId}`}
      >
        {record.orderNumber}
      </Link>
    ),
  },
   {
    title: t("markingCodes.tableTitles.products"),
    dataIndex: "productName",
       flex: 2,
    key: "productName",
    render: (_, record) => (
      <Link
        className="table-text link"
        to={`/organization/${orgId}/products/${record?.productId}`}
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
      flex: 1,
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
      flex: 1,
    key: "orderedAt",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t("markingCodes.tableTitles.packageType"),
    dataIndex: "packageType",
    ellipsis: true,
      flex: 1,
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
      className: "no-ellipsis",
      flex: 2,
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
      flex: 1,
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
      flex: 1,
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




