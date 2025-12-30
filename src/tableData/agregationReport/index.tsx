import { type TableProps } from "antd";
import type { TFunction } from "i18next";
import type { AggregationUnitDataType } from "./types";

export const UnitsColumns = (t: TFunction): TableProps<AggregationUnitDataType>["columns"] => [
    {
        title: "№",
        dataIndex: "number",
        key: "number",
        render: (text) => <p className="table-text">{text}</p>
    },
    {
        title: "Номер кода",
        dataIndex: "codeNumber",
        key: "codeNumber",
        render: (text) =>
            <p className="table-text">{text}</p>
    },
    {
        title: t("aggregations.agregationReportPage.unitsTable.unitSerialNumber"),
        dataIndex: "parentCode",
        key: "parentCode",
        render: (text) => <p className="table-text">{text}</p>
    },
    {
        title: "Код",
        dataIndex: "code",
        key: "code",
        render: (text) => <p className="table-text">{text}</p>
    },
    // {
    //     title: t("aggregations.agregationReportPage.unitsTable.codesCount"),
    //     dataIndex: "code",
    //     key: "code",
    //     render: (text) => <p className="table-text">{text}</p>
    // },
    // {
    //     title: t("aggregations.agregationReportPage.unitsTable.codes"),
    //     dataIndex: "codes",
    //     key: "codes",
        // render: (codes) => (
        //     <div style={{ maxWidth: 300 }}>
        //         {codes.map((item) => (
        //             <p key={item.key} className="table-text">
        //                 {item.code}
        //             </p>
        //         ))}
        //     </div>
        // )
    // },
    // {
    //     title: t("aggregations.agregationReportPage.unitsTable.state"),
    //     dataIndex: "state",
    //     key: "state",
    //     render: (state: string) => (
    //         <Tag color={state === "active" ? "green" : "red"} style={{
    //             maxWidth: 150,
    //             overflow: "hidden",
    //             whiteSpace: "nowrap",
    //             textOverflow: "ellipsis",
    //         }}>
    //             {t(`aggregations.unitState.${state}`)}
    //         </Tag>
    //     )
    // }
];
