import { useNavigate } from "react-router-dom";
import type {MultiLanguage} from "shared/types/dtos";

export const useNavigationBack = () => {
  const navigate = useNavigate();
  return (path: string) => {
    navigate(path);
  };
};

export const FormatUzbekPhoneNumber = (raw: unknown) => {
  if (raw === undefined || raw === null) return "";

  const value = String(raw);
  const digits = value.replace(/\D/g, "");
  let localDigits = "";

  if (digits.length === 12 && digits.startsWith("998")) {
    localDigits = digits.slice(3);
  } else if (digits.length === 9) {
    localDigits = digits;
  } else if (digits.length === 10 && digits.startsWith("0")) {
    localDigits = digits.slice(1);
  }

  if (localDigits.length === 9) {
    const operator = localDigits.slice(0, 2);
    const part1 = localDigits.slice(2, 5);
    const part2 = localDigits.slice(5, 7);
    const part3 = localDigits.slice(7, 9);

    return `+998 ${operator} ${part1} ${part2} ${part3}`;
  }

  return value;
};


export type LanguageKey = keyof MultiLanguage;

export const getFileNameFromDisposition = (disposition?: string) => {
  if (!disposition) return null;

  // filename*=UTF-8''...
  const utf8Match = disposition.match(/filename\*\=UTF-8''(.+)/i);
  if (utf8Match && utf8Match[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  // filename="..."
  const asciiMatch = disposition.match(/filename="(.+)"/i);
  if (asciiMatch && asciiMatch[1]) {
    return asciiMatch[1];
  }

  return null;
};





