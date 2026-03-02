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
    const plainColumnsCount = columns.filter(
        (col) => !('children' in col)
    ).length || 1;

    const calculatedWidth = Math.floor(tableWidth / plainColumnsCount);

    return columns.map((col) => {
        if ('children' in col) {
            return applyHeaderAlign(col);
        }

        return applyHeaderAlign({
            ...col,
            width: col.width ?? calculatedWidth,
            ellipsis: true,
        });
    });
}



