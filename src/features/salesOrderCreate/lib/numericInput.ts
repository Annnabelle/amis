import type { ClipboardEvent, KeyboardEvent } from "react";

/** Клавиши управления вводом: их фильтр цифр пропускает. */
const CONTROL_KEYS = [
  "Backspace",
  "Delete",
  "Tab",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
  "Enter",
];

/** Разбор значения поля: остаются только цифры, не длиннее maxDigits. */
export const digitsOnlyParser = (maxDigits?: number) => (value?: string) => {
  const digits = value?.replace(/\D/g, "") ?? "";

  return maxDigits ? digits.slice(0, maxDigits) : digits;
};

/** Разбор дробного значения: запятая считается точкой. */
export const decimalParser =
  (maxIntegerDigits?: number, maxFractionDigits = 2) =>
  (value?: string) => {
    const normalized = (value ?? "").replace(",", ".").replace(/[^\d.]/g, "");
    const [integerPart = "", ...fractionParts] = normalized.split(".");
    const integer = maxIntegerDigits ? integerPart.slice(0, maxIntegerDigits) : integerPart;
    const fraction = fractionParts.join("").slice(0, maxFractionDigits);

    return fractionParts.length > 0 ? `${integer}.${fraction}` : integer;
  };

/** Нажатие нецифровой клавиши и перебор длины отклоняются до изменения поля. */
export const allowOnlyDigitsKeyDown =
  (maxDigits?: number) => (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (CONTROL_KEYS.includes(event.key)) return;

    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
      return;
    }

    if (!maxDigits) return;

    const currentValue = event.currentTarget.value ?? "";
    const selectionStart = event.currentTarget.selectionStart ?? currentValue.length;
    const selectionEnd = event.currentTarget.selectionEnd ?? currentValue.length;
    const hasSelection = selectionEnd > selectionStart;

    if (!hasSelection && currentValue.length >= maxDigits) {
      event.preventDefault();
    }
  };

/** Вставка с нецифрами или с перебором длины отклоняется целиком. */
export const allowOnlyDigitsPaste =
  (maxDigits?: number) => (event: ClipboardEvent<HTMLInputElement>) => {
    const text = event.clipboardData.getData("text");

    if (!/^\d*$/.test(text)) {
      event.preventDefault();
      return;
    }

    if (!maxDigits) return;

    const currentValue = event.currentTarget.value ?? "";
    const selectionStart = event.currentTarget.selectionStart ?? currentValue.length;
    const selectionEnd = event.currentTarget.selectionEnd ?? currentValue.length;
    const selectionLength = Math.max(0, selectionEnd - selectionStart);
    const nextLength = currentValue.length - selectionLength + text.length;

    if (nextLength > maxDigits) {
      event.preventDefault();
    }
  };
