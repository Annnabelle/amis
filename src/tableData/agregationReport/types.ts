export type UnitCodeType = {
    key: string;
    number: number;
    codeNumber: number;
    parentCode: string;
    code: string;
};

export type AggregationUnitDataType = {
    key: string;
    number: number;
    unitSerialNumber: string;
    aggregationItemsCount: number;
    aggregationUnitCapacity: number;
    codesCount: number;
    codes: UnitCodeType[];
    shouldBeUnbundled: string; // "Yes" | "No" | "-"
    state: string;
};
