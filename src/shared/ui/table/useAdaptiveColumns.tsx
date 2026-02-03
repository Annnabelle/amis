import type {AdaptiveColumn} from "./types.ts";

export function useAdaptiveColumns<T extends object>(
    columns: AdaptiveColumn<T>[],
    tableWidth: number
): AdaptiveColumn<T>[] {
    const totalFlex = columns.reduce(
        (sum, col) => sum + (col.flex ?? 1),
        0
    );

    return columns.map((col) => {
        if ('children' in col) {
            return col;
        }

        const flex = col.flex ?? 1;
        const calculatedWidth = Math.floor(
            (tableWidth * flex) / totalFlex
        );

        return {
            ...col,
            width: Math.max(col.minWidth ?? 120, calculatedWidth),
            ellipsis: true,
        };
    });
}



