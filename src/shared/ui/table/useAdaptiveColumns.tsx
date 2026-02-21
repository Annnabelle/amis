import type {AdaptiveColumn} from "./types.ts";

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
            return col;
        }

        return {
            ...col,
            width: col.width ?? calculatedWidth,
            ellipsis: true,
        };
    });
}



