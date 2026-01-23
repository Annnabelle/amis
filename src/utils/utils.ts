import { useNavigate } from "react-router-dom";
import type {MultiLanguage} from "../dtos";

export const useNavigationBack = () => {
  const navigate = useNavigate();
  return (path: string) => {
    navigate(path);
  };
};

export const FormatUzbekPhoneNumber = (raw: any) => {
  const digits = raw.replace(/\D/g, ""); 

  if (digits.length === 12 && digits.startsWith("998")) {
    const operator = digits.slice(3, 5);
    const part1 = digits.slice(5, 8);
    const part2 = digits.slice(8, 10);
    const part3 = digits.slice(10, 12);
    return `+998 (${operator}) ${part1}-${part2}-${part3}`;
  }

  return raw; // если формат не подходит, возвращаем как есть
};


export const formatDate = (date: string | Date | undefined, locale = "ru-RU") => {
  if (!date) return "-";

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
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


