import type { KeyboardEvent } from "react";

/**
 * Enter и пробел запускают действие элемента с role="button".
 *
 * Нативная кнопка делает это сама; обработчик нужен там, где роль висит на
 * блоке с собственной вёрсткой.
 */
export const activateOnKey =
  (activate: () => void) => (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    activate();
  };
