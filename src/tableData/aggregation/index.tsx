import {type TableProps, Tag} from 'antd';
import type { TFunction } from 'i18next';
import type {AggregationDataType} from "./types.ts";
import {Link} from "react-router-dom";
import {statusColors} from "../../components/statuses.tsx";

export const AggregationColumns = (t: TFunction, orgId: string | undefined) : TableProps<AggregationDataType>["columns"] => [
    {
        title: '№',
        dataIndex: "number",
        key: "number",
        render: (text) => <p className="table-text" >{text}</p>
    },
    {
        title: t("aggregations.aggregationsTableTitle.aggregationReportNumber"),
        dataIndex: "aggregationNumber",
        key: "aggregationNumber",
        render: (_, record) => (
            <p
                // to={`/aggregations/${record?.id}`}
                className="table-text">
                {record.aggregationNumber}
            </p>
        )
    },
    {
        title: t("aggregations.aggregationsTableTitle.parentBatch"),
        dataIndex: "batchNumberParent",
        key: "batchNumberParent",
        render: (_, record) => (
            <Link
                to={`/organization/${orgId}/orderId/${record?.orderIdParent}/batchId/${record?.batchIdParent}`}
                className="table-text">
                {record.batchNumberParent}
            </Link>
        )
    },
    {
        title: t("aggregations.aggregationsTableTitle.childBatch"),
        dataIndex: "batchNumberChild",
        key: "batchNumberChild",
        render: (_, record) => (
            <Link
                to={`/organization/${orgId}/orderId/${record?.childOrderId}/batchId/${record?.batchOrderId}`}
                className="table-text">
                {record.batchNumberChild}
            </Link>
        )
    },
    {
        title: t("aggregations.aggregationsTableTitle.productName"),
        dataIndex: "productName",
        key: "productName",
        render: (text) => <p
            style={{
                maxWidth: 100,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
            }}
            className="table-text">
            {text}
        </p>
    },
    {
        title: t("aggregations.aggregationsTableTitle.numberOfPackages"),
        dataIndex: "aggregationQuantity",
        key: "aggregationQuantity",
        render: (text) => <p className="table-text">{text}</p>
    },
    {
        title: t("aggregations.aggregationsTableTitle.quantityPerPackage"),
        dataIndex: "quantityPerPackage",
        key: "quantityPerPackage",
        render: (text) => <p className="table-text">{text}</p>
    },
    {
        title: t("aggregations.aggregationsTableTitle.orderDate"),
        dataIndex: "submittedAt",
        key: "submittedAt",
        render: (text) => <p className="table-text">{text}</p>
    },
    {
        title: t("aggregations.aggregationsTableTitle.status"),
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
                    {t(`aggregations.aggregationReportStatus.${status}`)}
                </Tag>
            ) : null
        ),
    },
];
