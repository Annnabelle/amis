/**
 * Отладочный вывод для диагностики по ходу разработки: в собранном
 * приложении вызовы — пустышки, консоль у пользователя остаётся чистой.
 */
const noop = () => {};

const bind = (
  method: "info" | "warn" | "groupCollapsed" | "groupEnd",
): ((...args: unknown[]) => void) =>
  import.meta.env.DEV ? console[method].bind(console) : noop;

export const debugLog = {
  info: bind("info"),
  warn: bind("warn"),
  group: bind("groupCollapsed"),
  groupEnd: bind("groupEnd"),
};
