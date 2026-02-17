import type { TFunction } from 'i18next';
import type { UnitCodeType } from './types';
import type {AdaptiveColumn} from "shared/ui/table/types.ts";

export const UnitsColumns = (
    t: TFunction
): AdaptiveColumn<UnitCodeType>[] => [
    {
        title: t("aggregations.agregationReportPage.unitsTable.unitSerialNumber"),
        dataIndex: "parentCode",
        key: "parentCode",
        flex: 1,
        render: (text) => <p className="table-text">{text}</p>,
    },
    {
        title:  t("aggregations.agregationReportPage.codeNumber"),
        dataIndex: "codeNumber",
        key: "codeNumber",
        flex: 1,
        render: (text) => <p className="table-text">{text}</p>,
    },
    {
        title: t("aggregations.agregationReportPage.code"),
        dataIndex: "code",
        key: "code",
        flex: 3,
        render: (text) => <p className="table-text">{text}</p>,
    },
];




