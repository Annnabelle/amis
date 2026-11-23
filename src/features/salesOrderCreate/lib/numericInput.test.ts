import { describe, expect, it, vi } from "vitest";
import type { ClipboardEvent, KeyboardEvent } from "react";

import {
  allowOnlyDigitsKeyDown,
  allowOnlyDigitsPaste,
  decimalParser,
  digitsOnlyParser,
} from "features/salesOrderCreate/lib/numericInput";

const keyEvent = (
  key: string,
  value = "",
  selection: [number, number] = [value.length, value.length],
) => {
  const preventDefault = vi.fn();

  const event = {
    key,
    ctrlKey: false,
    metaKey: false,
    altKey: false,
    preventDefault,
    currentTarget: {
      value,
      selectionStart: selection[0],
      selectionEnd: selection[1],
    },
  } as unknown as KeyboardEvent<HTMLInputElement>;

  return { event, preventDefault };
};

const pasteEvent = (
  text: string,
  value = "",
  selection: [number, number] = [value.length, value.length],
) => {
  const preventDefault = vi.fn();

  const event = {
    clipboardData: { getData: () => text },
    preventDefault,
    currentTarget: {
      value,
      selectionStart: selection[0],
      selectionEnd: selection[1],
    },
  } as unknown as ClipboardEvent<HTMLInputElement>;

  return { event, preventDefault };
};

describe("числовой ввод", () => {
  it("оставляет в значении только цифры и обрезает по длине", () => {
    expect(digitsOnlyParser()("12a3 4")).toBe("1234");
    expect(digitsOnlyParser(3)("123456")).toBe("123");
  });

  it("дробное значение принимает запятую", () => {
    expect(decimalParser()("12,345")).toBe("12.34");
    expect(decimalParser(2)("12345.6")).toBe("12.6");
    expect(decimalParser()("abc")).toBe("");
  });

  it("нецифровую клавишу не пропускает", () => {
    const { event, preventDefault } = keyEvent("a");
    allowOnlyDigitsKeyDown()(event);
    expect(preventDefault).toHaveBeenCalled();
  });

  it("управляющие клавиши и сочетания пропускает", () => {
    const backspace = keyEvent("Backspace");
    allowOnlyDigitsKeyDown()(backspace.event);
    expect(backspace.preventDefault).not.toHaveBeenCalled();

    const digit = keyEvent("7");
    allowOnlyDigitsKeyDown()(digit.event);
    expect(digit.preventDefault).not.toHaveBeenCalled();
  });

  it("на предельной длине цифру не добавляет, а поверх выделения добавляет", () => {
    const full = keyEvent("5", "123");
    allowOnlyDigitsKeyDown(3)(full.event);
    expect(full.preventDefault).toHaveBeenCalled();

    const selected = keyEvent("5", "123", [0, 3]);
    allowOnlyDigitsKeyDown(3)(selected.event);
    expect(selected.preventDefault).not.toHaveBeenCalled();
  });

  it("вставку с буквами или с перебором длины отклоняет целиком", () => {
    const letters = pasteEvent("12a");
    allowOnlyDigitsPaste()(letters.event);
    expect(letters.preventDefault).toHaveBeenCalled();

    const tooLong = pasteEvent("456", "123");
    allowOnlyDigitsPaste(4)(tooLong.event);
    expect(tooLong.preventDefault).toHaveBeenCalled();

    const fits = pasteEvent("4", "123");
    allowOnlyDigitsPaste(4)(fits.event);
    expect(fits.preventDefault).not.toHaveBeenCalled();
  });
});
