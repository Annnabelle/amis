import type { ColumnType, ColumnGroupType } from 'antd/es/table';

export type AdaptiveColumn<T> =
    | (ColumnType<T> & {
    flex?: number;
    minWidth?: number;
})
    | (ColumnGroupType<T> & {
    flex?: number;
    minWidth?: number;
});



