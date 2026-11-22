import dayjs from "dayjs";
import "dayjs/locale/ru";
import "dayjs/locale/uz-latn";
import "dayjs/locale/en";

import { Language } from "shared/types/dtos";
import { normalizeLanguage } from "shared/lib/language";

const DATE_FORMAT = "DD.MM.YYYY";
const DATE_TIME_FORMAT = "DD.MM.YYYY HH:mm";
const DATE_TIME_SECONDS_FORMAT = "DD.MM.YYYY HH:mm:ss";
const TIME_FORMAT = "HH:mm:ss";

/** Имена локалей dayjs отличаются от кодов языков интерфейса. */
const DAYJS_LOCALE: Record<Language, string> = {
  [Language.Russian]: "ru",
  [Language.Uzbek]: "uz-latn",
  [Language.English]: "en",
};

/** Названия месяцев и дней берутся из локали языка интерфейса. */
export const applyDateLocale = (language: string) => {
  dayjs.locale(DAYJS_LOCALE[normalizeLanguage(language)]);
};

type DateInput = string | number | Date | dayjs.Dayjs | null | undefined;

const format = (value: DateInput, pattern: string, fallback: string) => {
  if (value === null || value === undefined || value === "") return fallback;

  const parsed = dayjs(value);

  return parsed.isValid() ? parsed.format(pattern) : fallback;
};

export const formatDate = (value: DateInput, fallback = "-") =>
  format(value, DATE_FORMAT, fallback);

export const formatDateTime = (value: DateInput, fallback = "-") =>
  format(value, DATE_TIME_FORMAT, fallback);

/** С секундами — там, где важен точный момент: журнал событий, заявки. */
export const formatDateTimeSeconds = (value: DateInput, fallback = "-") =>
  format(value, DATE_TIME_SECONDS_FORMAT, fallback);

export const formatTime = (value: DateInput, fallback = "-") =>
  format(value, TIME_FORMAT, fallback);
