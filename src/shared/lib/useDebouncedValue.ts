import { useEffect, useState } from "react";

/** Пауза, после которой набранное считается законченным. */
const DEFAULT_DELAY_MS = 350;

/**
 * Значение с задержкой: поле ввода остаётся отзывчивым, а запрос уходит один
 * раз за набранное слово.
 */
export const useDebouncedValue = <T>(
  value: T,
  delayMs: number = DEFAULT_DELAY_MS,
): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);

    return () => window.clearTimeout(timer);
  }, [delayMs, value]);

  return debounced;
};
