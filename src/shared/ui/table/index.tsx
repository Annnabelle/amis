import { Table } from 'antd';
import type { TablePaginationConfig } from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface';
import { useTableWidth } from './useTableWidth';
import './styles.sass';
import {useAdaptiveColumns} from "./useAdaptiveColumns.tsx";
import type {AdaptiveColumn} from "./types.ts";

interface ComponentTableProps<T> {
    onRowClick?: (record: T) => void;
    columns?: AdaptiveColumn<T>[];
    data?: T[];
    loading?: boolean;
    pagination?: TablePaginationConfig | false;
    rowSelection?: TableRowSelection<T>;
    rowClassName?: string | ((record: T, index: number) => string);
}

const ComponentTable = <T extends object>({
      onRowClick,
      columns = [],
      data,
      loading,
      pagination,
      rowSelection,
      rowClassName,
  }: ComponentTableProps<T>) => {
    const { ref, width } = useTableWidth();

    const selectionOffset = rowSelection ? 60 : 0;
    const adaptiveColumns = useAdaptiveColumns<T>(
        columns,
        Math.max(0, (width || 1000) - selectionOffset)
    );

    return (
        <div ref={ref}>
            <Table<T>
                className="amis-table"
                tableLayout="fixed"
                scroll={{ x: '100%' }}
                columns={adaptiveColumns}
                dataSource={data}
                loading={loading}
                pagination={pagination}
                rowSelection={rowSelection}
                onRow={(record) => ({
                    onClick: () => onRowClick?.(record),
                })}
                rowClassName={(record, index) => {
                    const customClass = typeof rowClassName === 'function'
                        ? rowClassName(record, index)
                        : rowClassName || '';
                    const clickableClass = onRowClick ? 'clickable-row' : '';
                    return [customClass, clickableClass].filter(Boolean).join(' ');
                }}
            />
        </div>
    );
};

export default ComponentTable;




