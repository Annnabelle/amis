import { Table } from 'antd';
import type { TablePaginationConfig } from 'antd';
import { useTableWidth } from './useTableWidth';
import './styles.sass';
import {useAdaptiveColumns} from "./useAdaptiveColumns.tsx";
import type {AdaptiveColumn} from "./types.ts";

interface ComponentTableProps<T> {
    onRowClick?: (record: T) => void;
    columns?: AdaptiveColumn<T>[];
    data?: T[];
    loading?: boolean;
    pagination?: TablePaginationConfig;
}

const ComponentTable = <T extends object>({
      onRowClick,
      columns = [],
      data,
      loading,
      pagination,
  }: ComponentTableProps<T>) => {
    const { ref, width } = useTableWidth();

    const adaptiveColumns = useAdaptiveColumns<T>(
        columns,
        width || 1000
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
                onRow={(record) => ({
                    onClick: () => onRowClick?.(record),
                })}
                rowClassName="clickable-row"
            />
        </div>
    );
};

export default ComponentTable;




