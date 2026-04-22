import type {AdaptiveColumn} from "./types.ts";

function applyHeaderAlign<T extends object>(col: AdaptiveColumn<T>): AdaptiveColumn<T> {
    if ('children' in col) {
        return {
            ...col,
            children: col.children?.map((child) => applyHeaderAlign(child as AdaptiveColumn<T>)),
        };
    }

    if (!col.align) {
        return col;
    }

    const previousOnHeaderCell = col.onHeaderCell;

    return {
        ...col,
        onHeaderCell: (column) => {
            const prev = previousOnHeaderCell?.(column) ?? {};
            return {
                ...prev,
                style: {
                    ...(prev.style ?? {}),
                    textAlign: col.align,
                },
            };
        },
    };
}

export function useAdaptiveColumns<T extends object>(
    columns: AdaptiveColumn<T>[],
    tableWidth: number
): AdaptiveColumn<T>[] {
    const plainColumns = columns.filter(
        (col) => !('children' in col)
    );
    const plainColumnsCount = plainColumns.length || 1;
    const totalFlex = plainColumns.reduce((sum, col) => sum + (col.flex ?? 1), 0) || plainColumnsCount;
    const fallbackWidth = Math.floor(tableWidth / plainColumnsCount);

    return columns.map((col) => {
        if ('children' in col) {
            return applyHeaderAlign(col);
        }

        const proportionalWidth = Math.floor(tableWidth * ((col.flex ?? 1) / totalFlex));
        const calculatedWidth = Math.max(col.minWidth ?? 0, proportionalWidth || fallbackWidth);

        return applyHeaderAlign({
            ...col,
            width: col.width ?? calculatedWidth,
            ellipsis: true,
        });
    });
}



