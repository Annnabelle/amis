import { Input, type InputRef } from "antd";
import { type ChangeEvent, type KeyboardEvent, useRef } from "react";

type PhoneInputProps = {
  value?: string;
  onChange?: (value: string) => void;
};

const COUNTRY_CODE = "998";
const MAX_LOCAL_LENGTH = 9;

const PhoneInput = ({ value = "", onChange }: PhoneInputProps) => {
  const inputRef = useRef<InputRef>(null);

  const getLocalDigits = (digits: string) => {
    const onlyDigits = digits.replace(/\D/g, "");

    return onlyDigits.startsWith(COUNTRY_CODE)
      ? onlyDigits.slice(COUNTRY_CODE.length, COUNTRY_CODE.length + MAX_LOCAL_LENGTH)
      : onlyDigits.slice(0, MAX_LOCAL_LENGTH);
  };

  const formatPhone = (digits: string) => {
    const localDigits = getLocalDigits(digits);

    if (!localDigits) return "";

    let formatted = "+998";
    if (localDigits.length > 0) formatted += " (" + localDigits.substring(0, 2);
    if (localDigits.length >= 2) formatted += ") " + localDigits.substring(2, 5);
    if (localDigits.length >= 5) formatted += "-" + localDigits.substring(5, 7);
    if (localDigits.length >= 7) formatted += "-" + localDigits.substring(7, 9);

    return formatted;
  };

  const updateValue = (localDigits: string) => {
    onChange?.(localDigits ? `${COUNTRY_CODE}${localDigits}` : "");
  };

  const countLocalDigitsBefore = (text: string, index: number) => {
    const digitsBefore = text.slice(0, index).replace(/\D/g, "");

    return Math.max(0, digitsBefore.length - COUNTRY_CODE.length);
  };

  const setCaretAfterLocalDigit = (localDigitIndex: number) => {
    requestAnimationFrame(() => {
      const input = inputRef.current?.input;
      if (!input) return;

      const nextValue = input.value;
      let seenLocalDigits = 0;

      if (localDigitIndex <= 0) {
        for (let i = 0; i < nextValue.length; i += 1) {
          if (nextValue.slice(0, i).replace(/\D/g, "").length >= COUNTRY_CODE.length) {
            input.setSelectionRange(i, i);
            return;
          }
        }

        input.setSelectionRange(nextValue.length, nextValue.length);
        return;
      }

      for (let i = 0; i < nextValue.length; i += 1) {
        if (/\d/.test(nextValue[i]) && nextValue.slice(0, i + 1).replace(/\D/g, "").length > COUNTRY_CODE.length) {
          seenLocalDigits += 1;
        }

        if (seenLocalDigits >= localDigitIndex) {
          input.setSelectionRange(i + 1, i + 1);
          return;
        }
      }

      input.setSelectionRange(nextValue.length, nextValue.length);
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateValue(getLocalDigits(e.target.value));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Backspace" && e.key !== "Delete") return;

    const input = e.currentTarget;
    const selectionStart = input.selectionStart ?? input.value.length;
    const selectionEnd = input.selectionEnd ?? input.value.length;
    const localDigits = getLocalDigits(value);

    const startLocalIndex = countLocalDigitsBefore(input.value, selectionStart);
    const endLocalIndex = countLocalDigitsBefore(input.value, selectionEnd);

    if (selectionStart !== selectionEnd) {
      e.preventDefault();
      updateValue(localDigits.slice(0, startLocalIndex) + localDigits.slice(endLocalIndex));
      setCaretAfterLocalDigit(startLocalIndex);
      return;
    }

    if (e.key === "Backspace" && startLocalIndex > 0) {
      e.preventDefault();
      const nextCaretIndex = startLocalIndex - 1;
      updateValue(localDigits.slice(0, nextCaretIndex) + localDigits.slice(startLocalIndex));
      setCaretAfterLocalDigit(nextCaretIndex);
      return;
    }

    if (e.key === "Delete" && startLocalIndex < localDigits.length) {
      e.preventDefault();
      updateValue(localDigits.slice(0, startLocalIndex) + localDigits.slice(startLocalIndex + 1));
      setCaretAfterLocalDigit(startLocalIndex);
    }
  };

  return (
    <Input
      ref={inputRef}
      size="large"
      className="input"
      placeholder="+998 (__) ___-__-__"
      inputMode="numeric"
      value={formatPhone(value)}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
};

export default PhoneInput;
