import { useNavigate } from "react-router-dom";

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
